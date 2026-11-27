'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
    collection,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import { firebaseApp, storageBucket } from '@/lib/firebase/app';
import { firebaseClient } from '@/lib/firebase/client';
import { photoSlots, chapterLibrary, validPhotoUrl } from '@/lib/site-photos';
const maxPhotoSize = 6 * 1024 * 1024;
const photoTypes = ['image/jpeg', 'image/png', 'image/webp'];

export function PhotosPanel({ uid }: { uid: string }) {
    const [slot, setSlot] = useState<string>(photoSlots[0].id);
    const [saved, setSaved] = useState<Record<string, { url: string; alt: string }>>({});
    const [url, setUrl] = useState<string>(photoSlots[0].src);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [size, setSize] = useState('');
    const [alt, setAlt] = useState<string>(photoSlots[0].alt);
    const initialized = useRef(false);
    const [notice, setNotice] = useState('');
    const [busy, setBusy] = useState(false);
    useEffect(
        () =>
            onSnapshot(
                collection(firebaseClient().db, 'sitePhotos'),
                (snapshot) => {
                    const next = Object.fromEntries(
                        snapshot.docs.map((d) => [d.id, d.data() as { url: string; alt: string }]),
                    );
                    setSaved(next);
                    if (!initialized.current) {
                        initialized.current = true;
                        if (next.home) {
                            setUrl(next.home.url);
                            setAlt(next.home.alt);
                        }
                    }
                },
                () => setNotice('Photo settings are unavailable. Check project access.'),
            ),
        [],
    );
    useEffect(() => {
        if (!file) {
            setPreviewUrl('');
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);
    function choose(id: string) {
        initialized.current = true;
        const fallback = photoSlots.find((p) => p.id === id)!;
        const photo = saved[id];
        setSlot(id);
        setFile(null);
        setSize('');
        setUrl(photo?.url || fallback.src);
        setAlt(photo?.alt || fallback.alt);
        setNotice('');
    }
    async function save(e: FormEvent) {
        e.preventDefault();
        if ((!file && !validPhotoUrl(url)) || !alt.trim() || alt.length > 240) {
            setNotice(
                'Choose a chapter photo or use a full HTTPS image URL and a short description.',
            );
            return;
        }
        setBusy(true);
        try {
            let publishedUrl = url;
            if (file) {
                if (!storageBucket) {
                    setNotice('Photo uploads need the Firebase Storage bucket configured.');
                    return;
                }
                const { getStorage, ref, uploadBytes, getDownloadURL } =
                    await import('firebase/storage');
                const path = 'site-photos/' + slot + '/' + crypto.randomUUID();
                const uploaded = await uploadBytes(ref(getStorage(firebaseApp()), path), file, {
                    contentType: file.type,
                    cacheControl: 'public,max-age=31536000,immutable',
                });
                publishedUrl = await getDownloadURL(uploaded.ref);
                setUrl(publishedUrl);
                setFile(null);
            }
            await setDoc(doc(firebaseClient().db, 'sitePhotos', slot), {
                url: publishedUrl,
                alt: alt.trim(),
                updatedAt: serverTimestamp(),
                updatedBy: uid,
            });
            setNotice('Photo published. The website updates automatically.');
        } catch {
            setNotice(
                'Unable to publish. Check the connection, Storage and Firestore rules, and your officer access. If an upload finished, its URL is ready to retry.',
            );
        } finally {
            setBusy(false);
        }
    }
    const preview =
        previewUrl ||
        (validPhotoUrl(url) ? url : photoSlots.find((photo) => photo.id === slot)?.src);
    const hero = ['home', 'gallery-1', 'events'].includes(slot);
    const desktopRatio = hero ? '2.1' : ['industry', 'about'].includes(slot) ? '1.57' : '1.5';
    const mobileRatio = hero ? '1.42' : '1.78';
    return (
        <div className="photo-editor">
            <form onSubmit={save}>
                <label>
                    Website photo
                    <select disabled={busy} value={slot} onChange={(e) => choose(e.target.value)}>
                        {photoSlots.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="photo-library" aria-label="Chapter photo library">
                    {chapterLibrary.map((src) => (
                        <button
                            type="button"
                            key={src}
                            aria-label={`Choose ${photoSlots.find((p) => p.src === src)?.alt}`}
                            aria-pressed={!file && url === src}
                            disabled={busy}
                            onClick={() => {
                                setFile(null);
                                setSize('');
                                setUrl(src);
                                setAlt(photoSlots.find((p) => p.src === src)?.alt || alt);
                            }}
                        >
                            <img src={src} alt="" loading="lazy" />
                        </button>
                    ))}
                </div>
                <label>
                    Upload photo
                    <input
                        type="file"
                        accept={photoTypes.join(',')}
                        disabled={busy}
                        onChange={(event) => {
                            const upload = event.target.files?.[0];
                            event.target.value = '';
                            if (!upload) return;
                            if (!photoTypes.includes(upload.type) || upload.size > maxPhotoSize) {
                                setNotice('Choose a JPG, PNG, or WebP up to 6 MB.');
                                return;
                            }
                            setFile(upload);
                            setSize('');
                            setNotice('');
                        }}
                    />
                </label>
                {file && (
                    <p className="status-note">
                        {file.name} · {(file.size / 1048576).toFixed(1)} MB
                    </p>
                )}
                {!storageBucket && (
                    <p className="status-note">
                        You can preview a file here. Publishing uploads requires Firebase Storage
                        configuration.
                    </p>
                )}
                <label>
                    Image URL
                    <input
                        type="text"
                        value={url}
                        disabled={busy}
                        onChange={(e) => {
                            setFile(null);
                            setSize('');
                            setUrl(e.target.value.trim());
                        }}
                    />
                </label>
                <p>Use the library, a file up to 6 MB, or an HTTPS image link.</p>
                <label>
                    Image description
                    <input
                        value={alt}
                        disabled={busy}
                        maxLength={240}
                        required
                        onChange={(e) => setAlt(e.target.value)}
                    />
                </label>
                <button
                    className="button button-dark"
                    disabled={busy || (!!file && !storageBucket)}
                >
                    {busy ? 'Publishing…' : 'Publish photo'}
                </button>
                <p role="status">{notice}</p>
            </form>
            <div className="photo-size-previews">
                <h2>Crop previews</h2>
                {size && <p className="status-note">Original: {size}</p>}
                <figure>
                    <img
                        style={{ aspectRatio: desktopRatio }}
                        src={preview}
                        alt={alt}
                        referrerPolicy="no-referrer"
                        onLoad={({ currentTarget }) =>
                            setSize(
                                `${currentTarget.naturalWidth} × ${currentTarget.naturalHeight} px`,
                            )
                        }
                    />
                    <figcaption>Desktop · {desktopRatio}:1</figcaption>
                </figure>
                <figure className="photo-size-mobile">
                    <img
                        style={{ aspectRatio: mobileRatio }}
                        src={preview}
                        alt=""
                        referrerPolicy="no-referrer"
                    />
                    <figcaption>Mobile · {mobileRatio}:1</figcaption>
                </figure>
            </div>
        </div>
    );
}
export function AnalyticsPanel() {
    const [events, setEvents] = useState<
        { type: string; path: string; target: string; recordedAt?: { toDate: () => Date } }[]
    >([]);
    const [status, setStatus] = useState('Loading activity…');
    useEffect(
        () =>
            onSnapshot(
                query(
                    collection(firebaseClient().db, 'siteActivity'),
                    orderBy('recordedAt', 'desc'),
                    limit(1000),
                ),
                (s) => {
                    setEvents(s.docs.map((d) => d.data() as (typeof events)[number]));
                    setStatus('');
                },
                () =>
                    setStatus(
                        'Analytics are unavailable. Check deployed rules and officer access.',
                    ),
            ),
        [],
    );
    const since = Date.now() - 30 * 86400000;
    const recent = events.filter((e) => (e.recordedAt?.toDate().getTime() ?? 0) >= since);
    const counts = new Map<string, { views: number; clicks: number }>();
    recent.forEach((e) => {
        const row = counts.get(e.path) || { views: 0, clicks: 0 };
        if (e.type === 'view') row.views++;
        else row.clicks++;
        counts.set(e.path, row);
    });
    const targets = new Map<string, number>();
    recent
        .filter((e) => e.type === 'click')
        .forEach((e) => targets.set(e.target, (targets.get(e.target) || 0) + 1));
    return (
        <div className="analytics-panel">
            <p>
                Last 30 days, within the latest 1,000 recorded events. Counts represent activity,
                not unique visitors. No cookies or visitor profiles; Do Not Track is respected.
                Officer pages and form entries are excluded.
            </p>
            {status ? (
                <p role="status">{status}</p>
            ) : (
                <>
                    <div className="dashboard-stats">
                        <div>
                            <span>Page views</span>
                            <strong>{recent.filter((e) => e.type === 'view').length}</strong>
                        </div>
                        <div>
                            <span>Link & control clicks</span>
                            <strong>{recent.filter((e) => e.type === 'click').length}</strong>
                        </div>
                    </div>
                    <h2>Pages</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Page</th>
                                <th>Views</th>
                                <th>Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...counts]
                                .sort((a, b) => b[1].views - a[1].views)
                                .map(([path, c]) => (
                                    <tr key={path}>
                                        <td>{path}</td>
                                        <td>{c.views}</td>
                                        <td>{c.clicks}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {!recent.length && <p>No activity recorded yet.</p>}
                    <h2>Clicked destinations</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Destination / control</th>
                                <th>Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...targets]
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 20)
                                .map(([target, count]) => (
                                    <tr key={target}>
                                        <td>{target}</td>
                                        <td>{count}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}
