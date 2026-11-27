'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { normalizeDeadline } from '@/lib/runtime-forms';
import { firebaseClient } from '@/lib/firebase/client';
import {
    directoryEntry,
    partnerTiers,
    validateDirectory,
    type DirectoryEntry,
    type DirectoryKind,
} from '@/lib/site-directory';
import { useSiteDirectory } from '@/components/runtime/site-directory';

const labels: Record<DirectoryKind, string> = {
    glossary: 'term',
    faq: 'question',
    link: 'resource link',
    contact: 'contact',
    partner: 'company',
    officer: 'officer profile',
    form: 'form',
};

export default function DirectoryPanel({
    kind,
    allowAdd = true,
}: {
    kind: DirectoryKind;
    allowAdd?: boolean;
}) {
    const { entries, status } = useSiteDirectory(kind, true);
    const [editing, setEditing] = useState<DirectoryEntry | null>(null);
    const [search, setSearch] = useState('');
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState('');
    const titleInput = useRef<HTMLInputElement>(null);
    const editingId = editing?.id;
    useEffect(() => {
        if (editingId) titleInput.current?.focus();
    }, [editingId]);

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!editing || busy) return;
        const { id, ...fields } = editing;
        fields.url = fields.url.trim();
        fields.image = fields.image.trim();
        fields.links = fields.links
            .split('\n')
            .map((url) => url.trim())
            .filter(Boolean)
            .join('\n');
        const hidden = fields.hidden;
        const error = hidden ? null : validateDirectory({ id, ...fields });
        if (error) {
            setNotice(error);
            return;
        }
        setBusy(true);
        setNotice('');
        try {
            await setDoc(doc(firebaseClient().db, 'siteDirectory', id), {
                ...(hidden ? { kind, hidden } : { ...fields, title: fields.title.trim() }),
                updatedAt: serverTimestamp(),
            });
            setEditing(null);
            setNotice(hidden ? 'Removed from the public list.' : 'Published to the site.');
        } catch {
            setNotice(
                'The change could not be saved. Check officer access and the deployed website rules.',
            );
        } finally {
            setBusy(false);
        }
    }

    function change(field: keyof DirectoryEntry, value: string | boolean) {
        setEditing((current) => current && { ...current, [field]: value });
    }
    const label = labels[kind];
    const deadline =
        editing?.category && Number.isFinite(Date.parse(editing.category))
            ? new Intl.DateTimeFormat('en-CA', {
                  timeZone: 'America/Chicago',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
              }).format(new Date(editing.category))
            : '';
    const groups =
        kind === 'glossary' || kind === 'officer' || kind === 'partner' || kind === 'form';
    const showImage = kind === 'partner' || kind === 'officer';
    return (
        <section className="officer-directory-editor" aria-label={label + ' editor'}>
            <div className="officer-directory-toolbar">
                <label>
                    Search {kind === 'partner' ? 'companies' : label + 's'}
                    <input value={search} onChange={(event) => setSearch(event.target.value)} />
                </label>
                {allowAdd && (
                    <button
                        className="button button-dark"
                        onClick={() => {
                            setNotice('');
                            setEditing(
                                directoryEntry(
                                    kind,
                                    kind + '-' + crypto.randomUUID(),
                                    '',
                                    kind === 'partner' ? { category: 'Banner only' } : {},
                                ),
                            );
                        }}
                    >
                        Add {label}
                    </button>
                )}
            </div>
            {status === 'unavailable' && (
                <p className="status-note">
                    Saved changes could not load. Showing the built-in entries.
                </p>
            )}
            {editing && (
                <form
                    className="officer-directory-form"
                    onSubmit={save}
                    aria-label={'Edit ' + label}
                >
                    <label>
                        {kind === 'officer' || kind === 'partner' ? 'Name' : 'Title'}
                        <input
                            ref={titleInput}
                            required={!editing.hidden}
                            maxLength={160}
                            value={editing.title}
                            onChange={(e) => change('title', e.target.value)}
                        />
                    </label>
                    {groups &&
                        (kind === 'partner' ? (
                            <label>
                                Placement
                                <select
                                    value={editing.category}
                                    onChange={(e) => change('category', e.target.value)}
                                >
                                    {partnerTiers.map((tier) => (
                                        <option key={tier}>{tier}</option>
                                    ))}
                                </select>
                            </label>
                        ) : kind === 'form' ? (
                            <label>
                                Deadline (optional, Central Time)
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) =>
                                        change('category', normalizeDeadline(e.target.value) ?? '')
                                    }
                                />
                            </label>
                        ) : (
                            <label>
                                {kind === 'officer' ? 'Role' : 'Category'}
                                <input
                                    maxLength={120}
                                    value={editing.category}
                                    onChange={(e) => change('category', e.target.value)}
                                />
                            </label>
                        ))}
                    {kind !== 'partner' && (
                        <label>
                            {kind === 'faq' ? 'Answer' : kind === 'officer' ? 'Bio' : 'Description'}
                            <textarea
                                rows={4}
                                maxLength={5000}
                                value={editing.description}
                                onChange={(e) => change('description', e.target.value)}
                            />
                        </label>
                    )}
                    {kind !== 'officer' && kind !== 'faq' && (
                        <label>
                            {kind === 'contact' ? 'Contact link (mailto or HTTPS)' : 'Destination'}
                            <input
                                maxLength={2048}
                                value={editing.url}
                                onChange={(e) => change('url', e.target.value)}
                            />
                        </label>
                    )}
                    {showImage && (
                        <label>
                            {kind === 'partner'
                                ? 'Logo URL or asset path'
                                : 'Portrait URL or asset path'}
                            <input
                                maxLength={2048}
                                value={editing.image}
                                onChange={(e) => change('image', e.target.value)}
                            />
                        </label>
                    )}
                    {kind === 'officer' && (
                        <label>
                            Profile links (one HTTPS URL per line)
                            <textarea
                                rows={3}
                                maxLength={4000}
                                value={editing.links}
                                onChange={(e) => change('links', e.target.value)}
                            />
                        </label>
                    )}
                    <label className="officer-directory-hide">
                        <input
                            type="checkbox"
                            checked={editing.hidden}
                            onChange={(e) => change('hidden', e.target.checked)}
                        />{' '}
                        Hide from the public list
                    </label>
                    {editing.hidden && (
                        <p className="status-note">
                            Custom item details are removed when you hide them. Built-in entries can
                            be restored.
                        </p>
                    )}
                    <div className="officer-directory-actions">
                        <button
                            className="button button-outline"
                            type="button"
                            disabled={busy}
                            onClick={() => {
                                setEditing(null);
                                setNotice('');
                            }}
                        >
                            Cancel
                        </button>
                        <button className="button button-dark" disabled={busy}>
                            {busy ? 'Saving…' : editing.hidden ? 'Hide item' : 'Publish'}
                        </button>
                    </div>
                </form>
            )}
            {notice && (
                <p className="status-note" role="status">
                    {notice}
                </p>
            )}
            <ul className="officer-directory-list">
                {entries
                    .filter((entry) =>
                        (entry.title + ' ' + entry.category)
                            .toLowerCase()
                            .includes(search.trim().toLowerCase()),
                    )
                    .map((entry) => (
                        <li key={entry.id}>
                            <div>
                                <strong>{entry.title || 'Hidden custom item'}</strong>
                                <span>{entry.hidden ? 'Hidden' : entry.category}</span>
                            </div>
                            <button
                                className="button button-outline"
                                disabled={busy}
                                onClick={() => {
                                    setEditing(entry);
                                    setNotice('');
                                }}
                            >
                                Edit
                            </button>
                        </li>
                    ))}
            </ul>
        </section>
    );
}
