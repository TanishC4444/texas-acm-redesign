'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import {
    User,
    MultiFactorError,
    MultiFactorResolver,
    TotpSecret,
    TotpMultiFactorGenerator,
    getMultiFactorResolver,
    multiFactor,
    onIdTokenChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import QRCode from 'qrcode';
import {
    ArrowUpRight,
    Check,
    FileText,
    LayoutDashboard,
    LogOut,
    Plus,
    ShieldCheck,
    Users,
    X,
    Save,
    Eye,
    Archive,
    LockKeyhole,
    Search,
} from 'lucide-react';
import { firebaseClient, firebaseConfigured, prepareAuth } from '@/lib/firebase/client';
import {
    categories,
    ContentKind,
    ContentRecord,
    contentKinds,
    OfficerRecord,
    validateContent,
} from '@/lib/content';
const blank = (): Omit<ContentRecord, 'id' | 'createdBy' | 'updatedBy'> => ({
    kind: 'event',
    title: '',
    description: '',
    category: 'Community',
    date: '',
    location: '',
    url: '',
    image: '',
    status: 'draft',
});
function message(error: unknown): string {
    const code = error instanceof FirebaseError ? error.code : '';
    if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found'].includes(code))
        return 'We couldn’t sign you in. Check your email and password.';
    if (code === 'auth/invalid-verification-code')
        return 'That code didn’t match. Try the current code in your authenticator app.';
    if (code === 'auth/too-many-requests')
        return 'Too many attempts. Please wait a moment before trying again.';
    if (code === 'auth/requires-recent-login')
        return 'Please sign out and sign in again before setting up your authenticator.';
    if (code === 'auth/network-request-failed') return 'Check your connection and try again.';
    if (code === 'permission-denied')
        return 'This action was not permitted. Check your officer access and sign in again with 2FA.';
    if (code === 'auth/operation-not-allowed')
        return 'This sign-in or 2FA method is not enabled for the project yet. Contact the site administrator.';
    return 'We couldn’t complete that action. Please try again or contact the site administrator.';
}
export default function OfficerPortal() {
    const currentUid = useRef<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [officer, setOfficer] = useState<OfficerRecord | null>(null);
    const [loading, setLoading] = useState(firebaseConfigured);
    const [roleLoading, setRoleLoading] = useState(false);
    const [secondFactor, setSecondFactor] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);
    const [factorId, setFactorId] = useState('');
    const [secret, setSecret] = useState<TotpSecret | null>(null);
    const [qr, setQr] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [records, setRecords] = useState<ContentRecord[]>([]);
    const [recordsLoading, setRecordsLoading] = useState(true);
    const [view, setView] = useState<'content' | 'team'>('content');
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const editorRef = useRef<HTMLDivElement>(null);
    const [editing, setEditing] = useState<
        (ReturnType<typeof blank> & { id?: string; createdBy?: string }) | null
    >(null);
    const [team, setTeam] = useState<(OfficerRecord & { id: string })[]>([]);
    useEffect(() => {
        if (!firebaseConfigured) return;
        const { auth } = firebaseClient();
        return onIdTokenChanged(auth, async (next) => {
            if (currentUid.current !== (next?.uid || null)) {
                setOfficer(null);
                currentUid.current = next?.uid || null;
            }
            setUser(next);
            setLoading(false);
            setSecondFactor(false);
            if (!next) {
                setOfficer(null);
                setSecret(null);
                setQr('');
                setRecords([]);
                setEditing(null);
                return;
            }
            try {
                const token = await next.getIdTokenResult();
                setSecondFactor(token.claims.firebase?.sign_in_second_factor === 'totp');
            } catch {
                setError('Your session expired. Please sign in again.');
            }
        });
    }, []);
    useEffect(() => {
        if (!user) return;
        setRoleLoading(true);
        const { db } = firebaseClient();
        return onSnapshot(
            doc(db, 'officers', user.uid),
            (snap) => {
                setOfficer(snap.exists() ? (snap.data() as OfficerRecord) : null);
                setRoleLoading(false);
            },
            () => {
                setOfficer(null);
                setRoleLoading(false);
            },
        );
    }, [user]);
    const authorized = Boolean(user?.emailVerified && secondFactor && officer?.active);
    useEffect(() => {
        if (!authorized) {
            setRecords([]);
            return;
        }
        setRecordsLoading(true);
        const { db } = firebaseClient();
        return onSnapshot(
            query(collection(db, 'content'), orderBy('updatedAt', 'desc')),
            (snap) => {
                setRecords(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as ContentRecord));
                setRecordsLoading(false);
            },
            (e) => {
                setError(message(e));
                setRecordsLoading(false);
            },
        );
    }, [authorized]);
    useEffect(() => {
        if (!authorized || officer?.role !== 'admin') return;
        const { db } = firebaseClient();
        return onSnapshot(
            collection(db, 'officers'),
            (snap) =>
                setTeam(
                    snap.docs.map(
                        (d) => ({ ...d.data(), id: d.id }) as OfficerRecord & { id: string },
                    ),
                ),
            (e) => setError(message(e)),
        );
    }, [authorized, officer?.role]);
    async function run(action: () => Promise<void>) {
        setBusy(true);
        setError('');
        setNotice('');
        try {
            await action();
        } catch (e) {
            setError(message(e));
        } finally {
            setBusy(false);
        }
    }
    async function login(e: FormEvent) {
        e.preventDefault();
        await run(async () => {
            await prepareAuth();
            try {
                await signInWithEmailAndPassword(firebaseClient().auth, email, password);
                setPassword('');
            } catch (e) {
                if (e instanceof FirebaseError && e.code === 'auth/multi-factor-auth-required') {
                    const next = getMultiFactorResolver(
                        firebaseClient().auth,
                        e as MultiFactorError,
                    );
                    const hint = next.hints.find(
                        (h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID,
                    );
                    if (!hint) {
                        setError(
                            'This account needs an authenticator-app factor. Contact your administrator.',
                        );
                        return;
                    }
                    setResolver(next);
                    setFactorId(hint.uid);
                    setPassword('');
                } else throw e;
            }
        });
    }
    async function confirmCode(e: FormEvent) {
        e.preventDefault();
        await run(async () => {
            if (!resolver) return;
            await resolver.resolveSignIn(
                TotpMultiFactorGenerator.assertionForSignIn(factorId, code),
            );
            setResolver(null);
            setCode('');
        });
    }
    async function setup() {
        await run(async () => {
            if (!user) return;
            const session = await multiFactor(user).getSession();
            const next = await TotpMultiFactorGenerator.generateSecret(session);
            setSecret(next);
            setQr(
                await QRCode.toDataURL(
                    next.generateQrCodeUrl(user.email || 'Officer', 'Texas ACM'),
                    { width: 230, margin: 2 },
                ),
            );
        });
    }
    async function enroll(e: FormEvent) {
        e.preventDefault();
        await run(async () => {
            if (!secret || !user) return;
            await multiFactor(user).enroll(
                TotpMultiFactorGenerator.assertionForEnrollment(secret, code),
                'Authenticator app',
            );
            setSecret(null);
            setQr('');
            setCode('');
            await signOut(firebaseClient().auth);
            setNotice(
                'Authenticator added. Sign in again and enter your code to open the workspace.',
            );
        });
    }
    async function reset() {
        await run(async () => {
            if (!email.trim()) {
                setError('Enter your officer email first.');
                return;
            }
            await sendPasswordResetEmail(firebaseClient().auth, email);
            setNotice(
                'If that email has an account, password reset instructions will arrive shortly.',
            );
        });
    }
    async function save(e: FormEvent) {
        e.preventDefault();
        if (!editing || !user) return;
        const invalid = validateContent(editing);
        if (invalid) {
            setError(invalid);
            return;
        }
        await run(async () => {
            const { db } = firebaseClient();
            const { id, createdBy, ...fields } = editing;
            const data = {
                ...fields,
                title: fields.title.trim(),
                description: fields.description.trim(),
                date: fields.date ? new Date(fields.date).toISOString() : '',
                updatedBy: user.uid,
                updatedAt: serverTimestamp(),
            };
            if (id) {
                await updateDoc(doc(db, 'content', id), data);
            } else {
                await addDoc(collection(db, 'content'), {
                    ...data,
                    createdBy: user.uid,
                    createdAt: serverTimestamp(),
                });
            }
            setEditing(null);
            setNotice(
                fields.status === 'published'
                    ? 'Published. The public website now shows this item.'
                    : 'Saved. Your content is up to date.',
            );
        });
    }
    const hasEditor = Boolean(editing);
    useEffect(() => {
        if (!hasEditor) return;
        const previous = document.activeElement as HTMLElement | null;
        const panel = editorRef.current;
        const focusable = () =>
            Array.from(
                panel?.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), input:not([disabled]), textarea, select, a[href]',
                ) || [],
            );
        focusable()[0]?.focus();
        const keys = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setEditing(null);
                setError('');
            }
            if (event.key === 'Tab') {
                const controls = focusable();
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };
        document.addEventListener('keydown', keys);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', keys);
            document.body.style.overflow = overflow;
            previous?.focus();
        };
    }, [hasEditor]);
    const feedback = (
        <>
            {error && (
                <p className="form-error" role="alert">
                    {error}
                </p>
            )}
            {notice && (
                <p className="form-success" role="status">
                    {notice}
                </p>
            )}
        </>
    );
    const signout = (
        <button
            className="text-link"
            onClick={() =>
                run(async () => {
                    await signOut(firebaseClient().auth);
                    setResolver(null);
                })
            }
            disabled={busy}
        >
            <LogOut size={15} /> Sign out
        </button>
    );
    if (!firebaseConfigured)
        return (
            <div className="officer-entry">
                <div className="officer-story">
                    <span className="eyebrow">TEXAS ACM / OFFICER WORKSPACE</span>
                    <h1>
                        Good ideas.
                        <br />
                        <em>Now live.</em>
                    </h1>
                    <p>
                        One home for the people who make ACM happen. Plan an event, share a
                        resource, and keep your community in the loop.
                    </p>
                    <div className="security-pill">
                        <ShieldCheck size={18} /> Officer access + authenticator 2FA
                    </div>
                    <span className="entry-star">✳</span>
                </div>
                <div className="login-window">
                    <div className="window-bar">
                        <span>
                            <i />
                            <i />
                            <i />
                        </span>
                        <span>officer_workspace</span>
                        <LockKeyhole size={14} />
                    </div>
                    <div className="login-body">
                        <ShieldCheck size={30} />
                        <h2>Workspace coming online.</h2>
                        <p>
                            The officer workspace is built, but this deployment has not been
                            connected to Firebase yet. Sign-in is unavailable until setup is
                            complete.
                        </p>
                        <a className="button button-dark" href="mailto:pres@texasacm.org">
                            Contact the ACM team <ArrowUpRight size={17} />
                        </a>
                        <a className="text-link" href="/designs">
                            Explore the new designs ↗
                        </a>
                    </div>
                </div>
            </div>
        );
    if (loading || roleLoading)
        return (
            <div className="portal-loading" role="status">
                Opening your workspace…
            </div>
        );
    if (!authorized)
        return (
            <div className="officer-entry">
                <div className="officer-story">
                    <span className="eyebrow">TEXAS ACM / OFFICER WORKSPACE</span>
                    <h1>
                        Good ideas.
                        <br />
                        <em>Now live.</em>
                    </h1>
                    <p>
                        For the people behind the plans. Your next event, announcement, or resource
                        starts here.
                    </p>
                    <div className="security-pill">
                        <ShieldCheck size={18} /> Approved officers. Verified email. Two factors.
                    </div>
                    <span className="entry-star">✳</span>
                </div>
                <div className="login-window">
                    <div className="window-bar">
                        <span>
                            <i />
                            <i />
                            <i />
                        </span>
                        <span>officer_workspace</span>
                        <LockKeyhole size={14} />
                    </div>
                    <div className="login-body">
                        {!user && !resolver && (
                            <>
                                <span className="eyebrow">WELCOME BACK, OFFICER.</span>
                                <h2>
                                    Make things
                                    <br />
                                    happen.
                                </h2>
                                <p>Sign in with your approved officer account.</p>
                                <form onSubmit={login}>
                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            autoComplete="username"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        Password
                                        <input
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </label>
                                    <button className="button button-dark" disabled={busy}>
                                        {busy ? 'Signing in…' : 'Continue'}
                                        <ArrowUpRight size={17} />
                                    </button>
                                </form>
                                <button className="text-link" disabled={busy} onClick={reset}>
                                    Set or reset your password
                                </button>
                                <small>
                                    New officer? Ask a site admin to add your account first.
                                </small>
                            </>
                        )}
                        {resolver && (
                            <>
                                <ShieldCheck size={30} />
                                <h2>One more check.</h2>
                                <p>Enter the six-digit code from your authenticator app.</p>
                                <form onSubmit={confirmCode}>
                                    <label>
                                        Authenticator code
                                        <input
                                            className="otp-input"
                                            autoComplete="one-time-code"
                                            inputMode="numeric"
                                            pattern="[0-9]{6}"
                                            minLength={6}
                                            maxLength={6}
                                            required
                                            value={code}
                                            onChange={(e) =>
                                                setCode(e.target.value.replace(/\D/g, ''))
                                            }
                                        />
                                    </label>
                                    <button className="button button-dark" disabled={busy}>
                                        Verify & sign in <Check size={17} />
                                    </button>
                                </form>
                                <button
                                    className="text-link"
                                    onClick={() => {
                                        setResolver(null);
                                        setCode('');
                                        setError('');
                                    }}
                                >
                                    Use another account
                                </button>
                            </>
                        )}
                        {user && !user.emailVerified && (
                            <>
                                <h2>Check your inbox.</h2>
                                <p>
                                    Verify your email before setting up 2FA. Follow the link in your
                                    verification email, then sign in again.
                                </p>
                                <button
                                    className="button button-dark"
                                    disabled={busy}
                                    onClick={() =>
                                        run(async () => {
                                            await sendEmailVerification(user);
                                            setNotice('Verification email sent.');
                                        })
                                    }
                                >
                                    Send verification email
                                </button>
                                {signout}
                            </>
                        )}
                        {user && user.emailVerified && !officer?.active && (
                            <>
                                <h2>Access is by invitation.</h2>
                                <p>
                                    This account does not have active officer access. Ask an ACM
                                    site administrator to approve it.
                                </p>
                                <p className="account-reference">Account reference: {user.uid}</p>
                                {signout}
                            </>
                        )}
                        {user && user.emailVerified && officer?.active && !secondFactor && (
                            <>
                                <h2>
                                    {multiFactor(user).enrolledFactors.length
                                        ? 'Sign in with 2FA.'
                                        : 'Secure your workspace.'}
                                </h2>
                                <p>
                                    {multiFactor(user).enrolledFactors.length
                                        ? 'Your current session has not completed an authenticator challenge. Sign out and sign in again to continue.'
                                        : 'Add an authenticator app before you can edit or publish. You’ll need it each time you sign in.'}
                                </p>
                                {!multiFactor(user).enrolledFactors.length && !secret && (
                                    <button
                                        className="button button-dark"
                                        onClick={setup}
                                        disabled={busy}
                                    >
                                        Set up authenticator <ShieldCheck size={18} />
                                    </button>
                                )}
                                {secret && (
                                    <>
                                        <img
                                            src={qr}
                                            width={230}
                                            height={230}
                                            className="totp-qr"
                                            alt="Scan this private setup QR code in your authenticator app"
                                        />
                                        <label className="setup-key-label">
                                            Or enter this setup key in your app
                                            <code className="setup-key">{secret.secretKey}</code>
                                        </label>
                                        <form onSubmit={enroll}>
                                            <label>
                                                Six-digit authenticator code
                                                <input
                                                    autoComplete="one-time-code"
                                                    inputMode="numeric"
                                                    pattern="[0-9]{6}"
                                                    maxLength={6}
                                                    required
                                                    value={code}
                                                    onChange={(e) =>
                                                        setCode(e.target.value.replace(/\D/g, ''))
                                                    }
                                                />
                                            </label>
                                            <button className="button button-dark" disabled={busy}>
                                                Confirm authenticator <Check size={17} />
                                            </button>
                                        </form>
                                    </>
                                )}
                                {signout}
                                <small>
                                    Lost your authenticator? An administrator must verify your
                                    identity before recovery.
                                </small>
                            </>
                        )}
                        {feedback}
                    </div>
                </div>
            </div>
        );
    const displayed = records.filter(
        (r) =>
            (filter === 'all' || r.kind === filter) &&
            `${r.title} ${r.category} ${r.description}`
                .toLowerCase()
                .includes(search.toLowerCase()),
    );
    return (
        <div className="officer-app">
            <aside className="officer-sidebar">
                <span className="eyebrow">THE WORKSPACE</span>
                <h2>
                    Behind
                    <br />
                    the <em>scenes.</em>
                </h2>
                <button
                    aria-current={view === 'content' ? 'page' : undefined}
                    onClick={() => {
                        setView('content');
                        setError('');
                    }}
                >
                    <LayoutDashboard size={17} /> Content studio
                </button>
                {officer?.role === 'admin' && (
                    <button
                        aria-current={view === 'team' ? 'page' : undefined}
                        onClick={() => setView('team')}
                    >
                        <Users size={17} /> Officer team
                    </button>
                )}
                <a href="/" target="_blank" rel="noopener noreferrer">
                    <Eye size={17} /> View website <ArrowUpRight size={14} />
                </a>
                <div className="sidebar-account">
                    <div className="security-pill">
                        <ShieldCheck size={15} /> 2FA verified
                    </div>
                    <strong>{officer?.name}</strong>
                    <small>{officer?.role}</small>
                    {signout}
                </div>
            </aside>
            <div className="officer-main">
                <header className="dashboard-heading">
                    <div>
                        <span className="eyebrow">
                            TEXAS ACM / {view === 'content' ? 'CONTENT STUDIO' : 'OFFICER TEAM'}
                        </span>
                        <h1>
                            {view === 'content'
                                ? 'Let’s make it happen.'
                                : 'Your people, with access.'}
                        </h1>
                        <p>
                            {view === 'content'
                                ? 'Draft it. Polish it. Put it out into the world.'
                                : 'Only admins can add officers or change their access.'}
                        </p>
                    </div>
                    {view === 'content' && (
                        <button
                            className="button button-dark"
                            onClick={() => {
                                setEditing(blank());
                                setError('');
                                setNotice('');
                            }}
                        >
                            <Plus size={17} /> Create something
                        </button>
                    )}
                </header>
                {feedback}
                {view === 'content' ? (
                    <>
                        <div className="dashboard-stats">
                            <div>
                                <span>ALL CONTENT</span>
                                <strong>{records.length.toString().padStart(2, '0')}</strong>
                            </div>
                            <div>
                                <span>LIVE ON THE SITE</span>
                                <strong>
                                    {records
                                        .filter((r) => r.status === 'published')
                                        .length.toString()
                                        .padStart(2, '0')}
                                </strong>
                            </div>
                            <div>
                                <span>WORK IN PROGRESS</span>
                                <strong>
                                    {records
                                        .filter((r) => r.status === 'draft')
                                        .length.toString()
                                        .padStart(2, '0')}
                                </strong>
                            </div>
                        </div>
                        <div className="content-toolbar">
                            <div role="group" aria-label="Filter content type">
                                {['all', ...contentKinds].map((kind) => (
                                    <button
                                        className={filter === kind ? 'active' : ''}
                                        key={kind}
                                        onClick={() => setFilter(kind)}
                                    >
                                        {kind === 'all' ? 'Everything' : kind + 's'}
                                    </button>
                                ))}
                            </div>
                            <label className="dashboard-search">
                                <Search size={15} />
                                <input
                                    aria-label="Search content"
                                    placeholder="Find something…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="content-list">
                            {recordsLoading ? (
                                <p className="status-note">Loading your content…</p>
                            ) : !displayed.length ? (
                                <div className="dashboard-empty">
                                    <FileText size={32} />
                                    <h2>
                                        {records.length
                                            ? 'No matching content.'
                                            : 'Your next big thing starts with a draft.'}
                                    </h2>
                                    <p>
                                        {records.length
                                            ? 'Try another filter or search.'
                                            : 'Create your first event, announcement, resource, or form. Only published items appear on the website.'}
                                    </p>
                                    <button
                                        className="button button-dark"
                                        onClick={() => setEditing(blank())}
                                    >
                                        <Plus size={16} /> New draft
                                    </button>
                                </div>
                            ) : (
                                displayed.map((r) => (
                                    <article key={r.id} className="content-row">
                                        <span className={`content-type type-${r.kind}`}>
                                            <FileText size={20} />
                                        </span>
                                        <div>
                                            <span className="eyebrow">
                                                {r.kind} / {r.category}
                                            </span>
                                            <h3>{r.title}</h3>
                                        </div>
                                        <span className={`status-badge status-${r.status}`}>
                                            {r.status}
                                        </span>
                                        <button
                                            className="text-link"
                                            onClick={() => {
                                                setEditing({
                                                    ...r,
                                                    date: r.date ? toLocalInput(r.date) : '',
                                                });
                                                setError('');
                                            }}
                                        >
                                            Edit <ArrowUpRight size={16} />
                                        </button>
                                    </article>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <TeamPanel team={team} currentUid={user!.uid} run={run} busy={busy} />
                )}
            </div>
            {editing && (
                <div className="editor-backdrop">
                    <div
                        className="content-editor"
                        ref={editorRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="editor-title"
                    >
                        <header>
                            <div>
                                <span className="eyebrow">CONTENT STUDIO</span>
                                <h2 id="editor-title">
                                    {editing.id ? 'Make it better.' : 'Start something good.'}
                                </h2>
                            </div>
                            <button
                                onClick={() => {
                                    setEditing(null);
                                    setError('');
                                }}
                                aria-label="Close editor"
                            >
                                <X />
                            </button>
                        </header>
                        <form onSubmit={save}>
                            <div className="field-pair">
                                <label>
                                    Content type
                                    <select
                                        value={editing.kind}
                                        onChange={(e) =>
                                            setEditing({
                                                ...editing,
                                                kind: e.target.value as ContentKind,
                                            })
                                        }
                                    >
                                        {contentKinds.map((k) => (
                                            <option key={k}>{k}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Category
                                    <select
                                        value={editing.category}
                                        onChange={(e) =>
                                            setEditing({ ...editing, category: e.target.value })
                                        }
                                    >
                                        {categories.map((k) => (
                                            <option key={k}>{k}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <label>
                                Title
                                <input
                                    required
                                    maxLength={140}
                                    value={editing.title}
                                    onChange={(e) =>
                                        setEditing({ ...editing, title: e.target.value })
                                    }
                                    placeholder="Something worth showing up for"
                                />
                            </label>
                            <label>
                                Description
                                <textarea
                                    required
                                    maxLength={5000}
                                    rows={5}
                                    value={editing.description}
                                    onChange={(e) =>
                                        setEditing({ ...editing, description: e.target.value })
                                    }
                                    placeholder="Give your community the details."
                                />
                            </label>
                            <div className="field-pair">
                                <label>
                                    Date & time (your device’s timezone)
                                    <input
                                        type="datetime-local"
                                        value={editing.date}
                                        onChange={(e) =>
                                            setEditing({ ...editing, date: e.target.value })
                                        }
                                    />
                                </label>
                                <label>
                                    Location
                                    <input
                                        maxLength={200}
                                        value={editing.location}
                                        onChange={(e) =>
                                            setEditing({ ...editing, location: e.target.value })
                                        }
                                        placeholder="GDC, a café, somewhere good…"
                                    />
                                </label>
                            </div>
                            <label>
                                Details / RSVP link
                                <input
                                    type="url"
                                    pattern="https://.*"
                                    maxLength={2048}
                                    value={editing.url}
                                    onChange={(e) =>
                                        setEditing({ ...editing, url: e.target.value })
                                    }
                                    placeholder="https://"
                                />
                            </label>
                            <label>
                                Image link (optional, HTTPS)
                                <input
                                    type="url"
                                    pattern="https://.*"
                                    maxLength={2048}
                                    value={editing.image}
                                    onChange={(e) =>
                                        setEditing({ ...editing, image: e.target.value })
                                    }
                                    placeholder="https://"
                                />
                            </label>
                            <label>
                                Visibility
                                <select
                                    value={editing.status}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            status: e.target.value as ContentRecord['status'],
                                        })
                                    }
                                >
                                    <option value="draft">Draft — officers only</option>
                                    <option value="published">
                                        Published — visible to everyone
                                    </option>
                                    <option value="archived">
                                        Archived — hidden from the site
                                    </option>
                                </select>
                            </label>
                            <p className="editor-hint">
                                Published {editing.kind}s appear automatically on{' '}
                                {editing.kind === 'event'
                                    ? 'the homepage and Events page'
                                    : editing.kind === 'announcement'
                                      ? 'the homepage'
                                      : editing.kind === 'resource'
                                        ? 'the resource hub and homepage'
                                        : 'the Forms page'}
                                . Event dates display in Central Time on the public site.
                            </p>
                            {error && (
                                <p className="form-error" role="alert">
                                    {error}
                                </p>
                            )}
                            <div className="editor-actions">
                                <button
                                    type="button"
                                    className="button button-outline"
                                    onClick={() => setEditing(null)}
                                >
                                    Cancel
                                </button>
                                <button className="button button-dark" disabled={busy}>
                                    <Save size={16} />
                                    {busy
                                        ? 'Saving…'
                                        : editing.status === 'published'
                                          ? 'Save & publish'
                                          : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
function toLocalInput(iso: string) {
    const d = new Date(iso);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
function TeamPanel({
    team,
    currentUid,
    run,
    busy,
}: {
    team: (OfficerRecord & { id: string })[];
    currentUid: string;
    run: (a: () => Promise<void>) => Promise<void>;
    busy: boolean;
}) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    async function invite(e: FormEvent) {
        e.preventDefault();
        await run(async () => {
            setStatus('');
            const { auth } = firebaseClient();
            const token = await auth.currentUser!.getIdToken();
            const res = await fetch('/api/officers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ email, name }),
            });
            if (!res.ok) {
                setStatus(
                    res.status === 503
                        ? 'Officer invitations are not configured on this deployment. Contact the project owner.'
                        : 'The invitation could not be created. Check the address and your admin access.',
                );
                return;
            }
            await sendPasswordResetEmail(auth, email);
            setStatus(
                'Officer added. A password setup email has been requested. They must verify their email and enroll in 2FA before editing.',
            );
            setEmail('');
            setName('');
        });
    }
    return (
        <>
            <form className="team-invite" onSubmit={invite}>
                <h2>Bring an officer on board.</h2>
                <p>
                    New accounts start as editors. You can promote an officer after they have
                    joined.
                </p>
                <div className="field-pair">
                    <label>
                        Full name
                        <input
                            required
                            maxLength={100}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label>
                        Officer email
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                </div>
                <button disabled={busy} className="button button-dark">
                    <Plus size={16} /> Add officer & send setup email
                </button>
                {status && (
                    <p role="status" className="status-note">
                        {status}
                    </p>
                )}
            </form>
            <div className="team-list">
                {team.map((person) => (
                    <div className="team-row" key={person.id}>
                        <div>
                            <strong>{person.name}</strong>
                            <span>{person.email}</span>
                        </div>
                        <label>
                            Role
                            <select
                                aria-label={`Role for ${person.name}`}
                                disabled={busy || person.id === currentUid}
                                value={person.role}
                                onChange={(e) =>
                                    run(async () => {
                                        await updateDoc(
                                            doc(firebaseClient().db, 'officers', person.id),
                                            { role: e.target.value },
                                        );
                                    })
                                }
                            >
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </label>
                        <button
                            className="button button-outline"
                            disabled={busy || person.id === currentUid}
                            onClick={() =>
                                run(async () => {
                                    await updateDoc(
                                        doc(firebaseClient().db, 'officers', person.id),
                                        { active: !person.active },
                                    );
                                })
                            }
                        >
                            {person.active ? 'Deactivate' : 'Reactivate'}
                        </button>
                    </div>
                ))}
            </div>
            <p className="status-note">
                Admins cannot change their own role or deactivate themselves here. Deactivation
                removes content access immediately through database rules. Account or MFA recovery
                must be handled by the Firebase project owner after identity verification.
            </p>
        </>
    );
}
