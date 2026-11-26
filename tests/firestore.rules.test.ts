import { readFileSync } from 'node:fs';
import {
    initializeTestEnvironment,
    assertFails,
    assertSucceeds,
    RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import { ContentConflict, saveOfficerContent } from '../lib/firebase/officer-content';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
    serverTimestamp,
    Timestamp,
    deleteDoc,
    type Firestore,
} from 'firebase/firestore';
let env: RulesTestEnvironment;
const projectId = 'demo-texas-acm';
function actor(uid: string, secondFactor = 'totp', verified = true) {
    return env
        .authenticatedContext(uid, {
            email: `${uid}@example.com`,
            email_verified: verified,
            firebase: {
                sign_in_provider: 'password',
                ...(secondFactor ? { sign_in_second_factor: secondFactor } : {}),
            },
        })
        .firestore();
}
function content(uid = 'editor', status = 'draft') {
    return {
        kind: 'event',
        title: 'Workshop',
        description: 'Build something.',
        category: 'Academics',
        date: '2026-11-14T17:00:00.000Z',
        location: 'GDC',
        url: 'https://example.com',
        image: '',
        status,
        createdBy: uid,
        updatedBy: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
}
beforeAll(async () => {
    env = await initializeTestEnvironment({
        projectId,
        firestore: {
            host: '127.0.0.1',
            port: 8080,
            rules: readFileSync('firestore.rules', 'utf8'),
        },
    });
});
afterAll(async () => {
    await env?.cleanup();
});
beforeEach(async () => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async (c) => {
        const db = c.firestore();
        for (const [uid, role, active] of [
            ['editor', 'editor', true],
            ['admin', 'admin', true],
            ['inactive', 'editor', false],
        ])
            await setDoc(doc(db, 'officers', String(uid)), {
                name: uid,
                email: `${uid}@example.com`,
                role,
                active,
            });
        for (const status of ['draft', 'published', 'archived'])
            await setDoc(doc(db, 'content', status), {
                ...content(),
                status,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
    });
});
describe('officer access', () => {
    it('denies anonymous writes', async () => {
        await assertFails(
            setDoc(doc(env.unauthenticatedContext().firestore(), 'content', 'new'), content()),
        );
    });
    it('denies editing without MFA, with SMS alone, or with unverified email', async () => {
        for (const db of [
            actor('editor', ''),
            actor('editor', 'phone'),
            actor('editor', 'totp', false),
        ])
            await assertFails(setDoc(doc(db, 'content', 'new'), content()));
    });
    it('denies unapproved or deactivated accounts', async () => {
        for (const uid of ['outsider', 'inactive'])
            await assertFails(setDoc(doc(actor(uid), 'content', 'new'), content(uid)));
    });
    it('permits an approved verified officer with TOTP to create and edit', async () => {
        const db = actor('editor');
        await assertSucceeds(setDoc(doc(db, 'content', 'new'), content()));
        await assertSucceeds(
            updateDoc(doc(db, 'content', 'new'), {
                title: 'Updated workshop',
                status: 'published',
                updatedBy: 'editor',
                updatedAt: serverTimestamp(),
            }),
        );
    });
    it('lets an officer read their own approval before MFA, but not another officer', async () => {
        const db = actor('editor', '');
        await assertSucceeds(getDoc(doc(db, 'officers', 'editor')));
        await assertFails(getDoc(doc(db, 'officers', 'admin')));
    });
    it('blocks role escalation and self-provisioning', async () => {
        await assertFails(updateDoc(doc(actor('editor'), 'officers', 'editor'), { role: 'admin' }));
        await assertFails(
            setDoc(doc(actor('outsider'), 'officers', 'outsider'), {
                name: 'Outsider',
                email: 'o@example.com',
                active: true,
                role: 'admin',
            }),
        );
    });
    it('allows admins to manage others but blocks self-deactivation', async () => {
        const db = actor('admin');
        await assertSucceeds(updateDoc(doc(db, 'officers', 'editor'), { active: false }));
        await assertFails(updateDoc(doc(db, 'officers', 'admin'), { active: false }));
        await assertSucceeds(getDocs(collection(db, 'officers')));
    });
    it('enforces deactivation on the next request using the same token', async () => {
        const db = actor('editor');
        await assertSucceeds(getDoc(doc(db, 'content', 'draft')));
        await env.withSecurityRulesDisabled(async (c) =>
            updateDoc(doc(c.firestore(), 'officers', 'editor'), { active: false }),
        );
        await assertFails(getDoc(doc(db, 'content', 'draft')));
        await assertFails(
            updateDoc(doc(db, 'content', 'draft'), {
                title: 'Blocked',
                updatedBy: 'editor',
                updatedAt: serverTimestamp(),
            }),
        );
    });
});
describe('public content boundaries and validation', () => {
    it('serves published content but hides drafts and archives from public readers', async () => {
        const db = env.unauthenticatedContext().firestore();
        await assertSucceeds(getDoc(doc(db, 'content', 'published')));
        await assertFails(getDoc(doc(db, 'content', 'draft')));
        await assertFails(getDoc(doc(db, 'content', 'archived')));
        await assertSucceeds(
            getDocs(
                query(
                    collection(db, 'content'),
                    where('status', '==', 'published'),
                    where('kind', '==', 'event'),
                ),
            ),
        );
        await assertFails(getDocs(collection(db, 'content')));
    });
    it('rejects unsafe links, invalid kinds, and excess fields even for officers', async () => {
        const db = actor('editor');
        for (const change of [
            { url: 'javascript:alert(1)' },
            { image: 'http://example.com/x.jpg' },
            { kind: 'admin' },
            { extra: true },
            { title: 'x'.repeat(141) },
            { status: 'private' },
            { date: 'bad-date' },
        ])
            await assertFails(setDoc(doc(db, 'content', 'new'), { ...content(), ...change }));
    });
    it('preserves authorship and rejects deletions', async () => {
        const db = actor('editor');
        await assertFails(
            updateDoc(doc(db, 'content', 'draft'), {
                createdBy: 'admin',
                updatedBy: 'editor',
                updatedAt: serverTimestamp(),
            }),
        );
        await assertFails(deleteDoc(doc(db, 'content', 'draft')));
    });
    it('denies all unrecognized collections', async () => {
        await assertFails(setDoc(doc(actor('admin'), 'private', 'x'), { secret: 'x' }));
    });
});

describe('site photos and anonymous activity', () => {
    it('allows public photo reads, but only verified MFA officers can publish valid slots', async () => {
        const photo = {
            url: '/studio/acmformal25.webp',
            alt: 'Texas ACM formal',
            updatedBy: 'editor',
            updatedAt: serverTimestamp(),
        };
        await assertSucceeds(setDoc(doc(actor('editor'), 'sitePhotos', 'home'), photo));
        await assertSucceeds(
            getDoc(doc(env.unauthenticatedContext().firestore(), 'sitePhotos', 'home')),
        );
        await assertFails(setDoc(doc(actor('editor', ''), 'sitePhotos', 'home'), photo));
        await assertFails(setDoc(doc(actor('editor'), 'sitePhotos', 'unknown'), photo));
        await assertFails(
            setDoc(doc(actor('editor'), 'sitePhotos', 'home'), {
                ...photo,
                url: 'javascript:alert(1)',
            }),
        );
    });
    it('accepts anonymous bounded activity but rejects private fields and officer paths', async () => {
        const db = env.unauthenticatedContext().firestore();
        const event = { type: 'view', path: '/about', target: '', recordedAt: serverTimestamp() };
        await assertSucceeds(setDoc(doc(db, 'siteActivity', 'view'), event));
        await assertFails(
            setDoc(doc(db, 'siteActivity', 'private'), { ...event, email: 'person@example.com' }),
        );
        await assertFails(
            setDoc(doc(db, 'siteActivity', 'officer'), { ...event, path: '/officer' }),
        );
        await assertFails(
            setDoc(doc(db, 'siteActivity', 'bad-time'), {
                ...event,
                recordedAt: Timestamp.fromMillis(0),
            }),
        );
        await assertFails(setDoc(doc(db, 'siteActivity', 'view'), event));
    });
    it('limits activity reads to active verified MFA officers', async () => {
        await env.withSecurityRulesDisabled((c) =>
            setDoc(doc(c.firestore(), 'siteActivity', 'sample'), {
                type: 'view',
                path: '/',
                target: '',
                recordedAt: Timestamp.now(),
            }),
        );
        await assertFails(
            getDocs(collection(env.unauthenticatedContext().firestore(), 'siteActivity')),
        );
        await assertFails(getDocs(collection(actor('editor', ''), 'siteActivity')));
        await assertSucceeds(getDocs(collection(actor('editor'), 'siteActivity')));
    });
});

describe('dashboard workflow', () => {
    it('publishes and archives a draft through the same service the dashboard uses', async () => {
        // The rules harness returns a compat wrapper accepted by the modular SDK.
        const db = actor('editor') as unknown as Firestore;
        const publicDb = env.unauthenticatedContext().firestore();
        const initial = { ...content(), updatedAt: undefined };
        const id = await saveOfficerContent(db, 'editor', {
            ...initial,
            kind: 'event',
            status: 'draft',
        });
        await assertFails(getDoc(doc(publicDb, 'content', id)));
        const first = await getDoc(doc(db, 'content', id));
        await saveOfficerContent(db, 'editor', {
            ...initial,
            id,
            kind: 'event',
            status: 'published',
            updatedAt: first.get('updatedAt'),
        });
        const published = await assertSucceeds(getDoc(doc(publicDb, 'content', id)));
        expect(published.get('status')).toBe('published');
        expect(published.get('createdBy')).toBe('editor');
        await saveOfficerContent(db, 'editor', {
            ...initial,
            id,
            kind: 'event',
            status: 'archived',
            updatedAt: published.get('updatedAt'),
        });
        await assertFails(getDoc(doc(publicDb, 'content', id)));
    });
    it('allows only one of two concurrent edits against the same revision', async () => {
        // The rules harness returns a compat wrapper accepted by the modular SDK.
        const db = actor('editor') as unknown as Firestore;
        const original = await getDoc(doc(db, 'content', 'draft'));
        const edit = {
            ...content(),
            id: original.id,
            kind: 'event',
            status: 'draft',
            updatedAt: original.get('updatedAt'),
        } as const;
        const results = await Promise.allSettled([
            saveOfficerContent(db, 'editor', { ...edit, title: 'First edit' }),
            saveOfficerContent(db, 'editor', { ...edit, title: 'Second edit' }),
        ]);
        expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
        expect(results.find((result) => result.status === 'rejected')?.reason).toBeInstanceOf(
            ContentConflict,
        );
        expect(['First edit', 'Second edit']).toContain(
            (await getDoc(doc(db, 'content', 'draft'))).get('title'),
        );
    });
    it('allows incomplete drafts but rejects unpublishable events and forms', async () => {
        const db = actor('editor');
        await assertSucceeds(
            setDoc(doc(db, 'content', 'missing-date-draft'), { ...content(), date: '' }),
        );
        await assertFails(
            setDoc(doc(db, 'content', 'missing-date'), {
                ...content('editor', 'published'),
                date: '',
            }),
        );
        await assertFails(
            setDoc(doc(db, 'content', 'missing-link'), {
                ...content('editor', 'published'),
                kind: 'form',
                url: '',
            }),
        );
    });
    it('blocks direct officer creation and email reassignment by a browser admin', async () => {
        const db = actor('admin');
        await assertFails(
            setDoc(doc(db, 'officers', 'new'), {
                name: 'New',
                email: 'new@example.com',
                active: true,
                role: 'editor',
            }),
        );
        await assertFails(updateDoc(doc(db, 'officers', 'editor'), { email: 'other@example.com' }));
        await assertSucceeds(updateDoc(doc(db, 'officers', 'editor'), { role: 'admin' }));
    });
});

describe('public website directory', () => {
    function entry(kind = 'contact', url = 'mailto:corporate@example.com') {
        return {
            kind,
            url,
            title: 'Contact us',
            description: '',
            category: '',
            image: '',
            links: '',
            hidden: false,
            updatedAt: serverTimestamp(),
        };
    }
    it('lets an active MFA officer publish contacts, resources, and officer profiles', async () => {
        const db = actor('editor');
        await assertSucceeds(setDoc(doc(db, 'siteDirectory', 'contact'), entry()));
        await assertSucceeds(
            setDoc(doc(db, 'siteDirectory', 'resource'), entry('link', '/cs-guide')),
        );
        await assertSucceeds(
            setDoc(doc(db, 'siteDirectory', 'officer'), {
                ...entry('officer', ''),
                category: 'President',
                image: '/studio/officers/jayden.webp',
                links: 'https://linkedin.com/in/example\nhttps://github.com/example',
            }),
        );
        const guest = env.unauthenticatedContext().firestore();
        await assertSucceeds(getDocs(collection(guest, 'siteDirectory')));
    });
    it('denies unapproved or non-MFA writes and unsafe destinations', async () => {
        for (const db of [actor('inactive'), actor('outsider'), actor('editor', '')])
            await assertFails(setDoc(doc(db, 'siteDirectory', 'contact'), entry()));
        const db = actor('editor');
        for (const url of [
            'javascript:alert(1)',
            '//bad.example',
            'mailto:bad@example.com?bcc=x@example.com',
        ])
            await assertFails(setDoc(doc(db, 'siteDirectory', 'contact'), entry('contact', url)));
        await assertFails(setDoc(doc(db, 'siteDirectory', 'resource'), entry('link')));
        await assertFails(
            setDoc(doc(db, 'siteDirectory', 'officer'), {
                ...entry('officer', ''),
                links: 'javascript:alert(1)',
            }),
        );
    });
    it('hides entries without leaving private fields and keeps entry kinds stable', async () => {
        const db = actor('editor');
        const contact = doc(db, 'siteDirectory', 'contact');
        await assertSucceeds(setDoc(contact, entry()));
        await assertFails(setDoc(contact, { ...entry(), hidden: true }));
        await assertFails(
            setDoc(contact, { kind: 'officer', hidden: true, updatedAt: serverTimestamp() }),
        );
        await assertSucceeds(
            setDoc(contact, { kind: 'contact', hidden: true, updatedAt: serverTimestamp() }),
        );
        const publicDoc = await getDoc(
            doc(env.unauthenticatedContext().firestore(), 'siteDirectory', 'contact'),
        );
        expect(publicDoc.get('hidden')).toBe(true);
        expect(publicDoc.get('url')).toBeUndefined();
    });
});
