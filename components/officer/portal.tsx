'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { collection, doc, onSnapshot, where, query, type Timestamp } from 'firebase/firestore';
import QRCode from 'qrcode';
import {
    ContentConflict,
    saveOfficerContent,
    type ContentEdit,
} from '@/lib/firebase/officer-content';
import { PhotosPanel, AnalyticsPanel } from './site-panels';
import DirectoryPanel from './directory-panel';
import type { DirectoryKind } from '@/lib/site-directory';
import {
    ArrowUpRight,
    Check,
    FileText,
    LogOut,
    Plus,
    ShieldCheck,
    Users,
    Handshake,
    Mail,
    X,
    Save,
    Eye,
    LockKeyhole,
    Search,
    BookOpen,
    ClipboardList,
    Images,
    ChartNoAxesColumn,
} from 'lucide-react';
import { firebaseClient, firebaseConfigured, prepareAuth } from '@/lib/firebase/client';
import { categories, ContentRecord, OfficerRecord, validateContent } from '@/lib/content';
const blank = (kind: EditableContent = 'form'): ContentEdit => ({
    kind,
    title: '',
    description: '',
    category: 'Community',
    date: '',
    location: '',
    url: '',
    image: '',
    status: 'draft',
});
const contentLabels = {
    resource: {
        name: 'Resource',
        destination: 'Student resources on the homepage',
        Icon: BookOpen,
    },
    form: { name: 'Form', destination: 'the Forms page', Icon: ClipboardList },
};
type EditableContent = keyof typeof contentLabels;
const workspace = [
    { id: 'glossary', title: 'CS A–Z', Icon: BookOpen },
    { id: 'link', title: 'Resources', Icon: FileText },
    { id: 'contact', title: 'Contacts', Icon: Mail },
    { id: 'faq', title: 'FAQ', Icon: FileText },
    { id: 'partner', title: 'Partnerships', Icon: Handshake },
    { id: 'photos', title: 'Site photos', Icon: Images },
    { id: 'analytics', title: 'Analytics', Icon: ChartNoAxesColumn },
    { id: 'form', title: 'Forms', Icon: ClipboardList },
    { id: 'officer', title: 'About officers', Icon: Users },
] as const;
type Workspace = DirectoryKind | 'photos' | 'analytics';
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
    const [showPassword, setShowPassword] = useState(false);
    const [code, setCode] = useState('');
    const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);
    const [factorId, setFactorId] = useState('');
    const [secret, setSecret] = useState<TotpSecret | null>(null);
    const [qr, setQr] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [records, setRecords] = useState<(ContentRecord & { updatedAt?: Timestamp | null })[]>(
        [],
    );
    const [recordsError, setRecordsError] = useState(false);
    const [recordsRetry, setRecordsRetry] = useState(0);
    const running = useRef(false);
    const [recordsLoading, setRecordsLoading] = useState(true);
    const [view, setView] = useState<Workspace>('glossary');
    const [search, setSearch] = useState('');
    const [visibility, setVisibility] = useState('all');
    const editorRef = useRef<HTMLDivElement>(null);
    const [editing, setEditing] = useState<ContentEdit | null>(null);
    useEffect(() => {
        if (!firebaseConfigured) return;
        const { auth } = firebaseClient();
        let sequence = 0;
        const unsubscribe = onIdTokenChanged(auth, async (next) => {
            const attempt = ++sequence;
            const nextUid = next?.uid ?? null;
            if (currentUid.current !== nextUid) {
                currentUid.current = nextUid;
                setSecondFactor(false);
                setOfficer(null);
                setRoleLoading(!!next);
                setRecords([]);
                setEditing(null);
                setView('glossary');
                setSecret(null);
                setQr('');
            }
            setUser(next);
            setLoading(false);
            if (!next) return;

            try {
                const token = await next.getIdTokenResult();
                if (attempt === sequence && auth.currentUser?.uid === nextUid) {
                    setSecondFactor(token.claims.firebase?.sign_in_second_factor === 'totp');
                }
            } catch {
                if (attempt !== sequence || auth.currentUser?.uid !== nextUid) return;
                setSecondFactor(false);
                setError('Your session expired. Please sign in again.');
            }
        });
        return () => {
            sequence++;
            unsubscribe();
        };
    }, []);
    useEffect(() => {
        if (!user) return;
        setRoleLoading(true);
        const { db } = firebaseClient();
        return onSnapshot(
            doc(db, 'officers', user.uid),
            (snap) => {
                if (currentUid.current !== user.uid) return;
                setOfficer(snap.exists() ? (snap.data() as OfficerRecord) : null);
                setRoleLoading(false);
            },
            () => {
                if (currentUid.current !== user.uid) return;
                setOfficer(null);
                setRoleLoading(false);
            },
        );
    }, [user]);
    const authorized = Boolean(user?.emailVerified && secondFactor && officer?.active);
    useEffect(() => {
        if (!authorized) {
            setRecords([]);
            setEditing(null);
            return;
        }
        setRecordsError(false);
        setRecordsLoading(true);
        const { db } = firebaseClient();
        return onSnapshot(
            query(collection(db, 'content'), where('kind', 'in', ['form', 'resource'])),
            (snap) => {
                setRecords(
                    snap.docs
                        .map(
                            (d) =>
                                ({ ...d.data(), id: d.id }) as ContentRecord & {
                                    updatedAt?: Timestamp | null;
                                },
                        )
                        .sort(
                            (a, b) =>
                                (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0),
                        ),
                );
                setRecordsLoading(false);
            },
            () => {
                setRecordsError(true);
                setRecordsLoading(false);
            },
        );
    }, [authorized, recordsRetry, user?.uid]);
    async function run(action: () => Promise<void>) {
        if (running.current) return;
        running.current = true;
        setBusy(true);
        setError('');
        setNotice('');
        try {
            await action();
        } catch (e) {
            setError(
                e instanceof ContentConflict
                    ? 'Another officer saved changes. Copy any edits you want to keep, then reopen the item from the library.'
                    : message(e),
            );
        } finally {
            running.current = false;
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
    function openDraft(kind: EditableContent) {
        setError('');
        setNotice('');
        setEditing(blank(kind));
    }
    function clearFilters() {
        setSearch('');
        setVisibility('all');
    }
    async function refreshVerification() {
        if (!user) return;
        await run(async () => {
            await user.reload();
            if (!user.emailVerified) {
                setNotice(
                    'Verification is still pending. Open the link in your UT email, then check again.',
                );
                return;
            }
            await user.getIdToken(true);
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
            await saveOfficerContent(firebaseClient().db, user.uid, editing);
            setEditing(null);
            setNotice(
                editing.status === 'published'
                    ? 'Published.'
                    : editing.status === 'archived'
                      ? 'Archived.'
                      : 'Draft saved.',
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
                    'button:not([disabled]), input:not([disabled]), textarea, select, summary, a[href]',
                ) || [],
            );
        panel?.querySelector<HTMLInputElement>('input[name=title]')?.focus();
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
                        Texas ACM.
                        <br />
                        Officer workspace.
                    </h1>
                    <p>
                        One home for the people who make ACM happen. Plan an event, share a
                        resource, and keep your community in the loop.
                    </p>
                    <div className="security-pill">
                        <ShieldCheck size={18} /> Officer access + authenticator 2FA
                    </div>
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
                        Texas ACM.
                        <br />
                        Officer workspace.
                    </h1>
                    <p>
                        Publish chapter events, announcements, forms, and student resources. Sign in
                        with the email your administrator approved.
                    </p>
                    <div className="security-pill">
                        <ShieldCheck size={18} /> Approved officers. Verified email. Two factors.
                    </div>
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
                                <h2>Officer sign in</h2>
                                <ol className="signin-steps" aria-label="Sign-in steps">
                                    <li aria-current="step">1. Account</li>
                                    <li>2. Authenticator</li>
                                </ol>
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
                                    <label htmlFor="officer-password">Password</label>
                                    <div className="password-control">
                                        <input
                                            id="officer-password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            aria-controls="officer-password"
                                            aria-pressed={showPassword}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                            <span className="sr-only"> password</span>
                                        </button>
                                    </div>
                                    <button className="button button-dark" disabled={busy}>
                                        {busy ? 'Signing in…' : 'Sign in'}
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
                                <h2>Authenticator code</h2>
                                <ol className="signin-steps" aria-label="Sign-in steps">
                                    <li>1. Account ✓</li>
                                    <li aria-current="step">2. Authenticator</li>
                                </ol>
                                <p>Enter the six-digit code from your authenticator app.</p>
                                <form onSubmit={confirmCode}>
                                    <label>
                                        Authenticator code
                                        <input
                                            className="otp-input"
                                            autoFocus
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
                                    Open the verification link in your email, then check your status
                                    here.
                                </p>
                                <button
                                    className="button button-dark"
                                    disabled={busy}
                                    onClick={refreshVerification}
                                >
                                    I’ve verified my email
                                </button>
                                <button
                                    className="text-link"
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
    const recordKind = view === 'form' ? 'form' : 'resource';
    const showRecords =
        view === 'form' ||
        (view === 'link' && records.some((record) => record.kind === 'resource'));
    const sectionRecords = records.filter((record) => record.kind === recordKind);
    const displayed = sectionRecords.filter(
        (record) =>
            (visibility === 'all' || record.status === visibility) &&
            `${record.title} ${record.category} ${record.description}`
                .toLowerCase()
                .includes(search.trim().toLowerCase()),
    );
    return (
        <div className="officer-app">
            <nav className="officer-sidebar" aria-label="Officer workspace">
                <h2>Texas ACM</h2>
                {workspace.map(({ id, title, Icon }) => (
                    <button
                        key={id}
                        aria-current={view === id ? 'page' : undefined}
                        onClick={() => {
                            setView(id);
                            clearFilters();
                            setError('');
                            setNotice('');
                        }}
                    >
                        <Icon size={17} aria-hidden="true" /> {title}
                    </button>
                ))}
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
            </nav>
            <div className="officer-main">
                <header className="dashboard-heading">
                    <h1>{workspace.find((section) => section.id === view)?.title}</h1>
                </header>
                {feedback}
                {view === 'photos' ? (
                    <PhotosPanel uid={user!.uid} />
                ) : view === 'analytics' ? (
                    <AnalyticsPanel />
                ) : (
                    <DirectoryPanel key={view} kind={view} allowAdd={view !== 'form'} />
                )}
                {showRecords && (
                    <section
                        className="officer-managed-records"
                        aria-label={
                            recordKind === 'form'
                                ? 'Form drafts and published forms'
                                : 'Resource posts'
                        }
                    >
                        <div className="officer-library">
                            <h2>
                                {recordKind === 'form'
                                    ? 'Form drafts and published forms'
                                    : 'Resource posts'}
                            </h2>
                            {view === 'form' && (
                                <button
                                    className="button button-dark"
                                    onClick={() => openDraft('form')}
                                >
                                    <Plus size={17} /> New form
                                </button>
                            )}
                        </div>
                        {!recordsLoading && !recordsError && (
                            <div className="officer-queue" role="group" aria-label="Content status">
                                {(['draft', 'published', 'archived'] as const).map((status) => (
                                    <button
                                        key={status}
                                        aria-pressed={visibility === status}
                                        onClick={() => {
                                            clearFilters();
                                            setVisibility(visibility === status ? 'all' : status);
                                        }}
                                    >
                                        <strong>
                                            {
                                                sectionRecords.filter(
                                                    (record) => record.status === status,
                                                ).length
                                            }
                                        </strong>
                                        {status === 'draft'
                                            ? 'Drafts'
                                            : status === 'published'
                                              ? 'Published'
                                              : 'Archived'}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="officer-library">
                            {!recordsLoading && !recordsError && (
                                <p role="status">
                                    {displayed.length} of {sectionRecords.length} items
                                </p>
                            )}
                        </div>
                        <div className="content-toolbar">
                            <label className="dashboard-search">
                                <Search size={17} aria-hidden="true" />
                                <input
                                    aria-label="Search content"
                                    placeholder="Search content…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </label>
                            <label>
                                Status
                                <select
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                >
                                    <option value="all">All statuses</option>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </label>
                        </div>
                        <div className="content-list">
                            {recordsLoading ? (
                                <p className="status-note" role="status">
                                    Loading your content…
                                </p>
                            ) : recordsError ? (
                                <div className="dashboard-empty">
                                    <h2>Content is unavailable.</h2>
                                    <p role="status">
                                        Check your connection and officer access, then try again.
                                    </p>
                                    <button
                                        className="button button-outline"
                                        onClick={() => setRecordsRetry((count) => count + 1)}
                                    >
                                        Retry loading
                                    </button>
                                </div>
                            ) : !displayed.length ? (
                                <div className="dashboard-empty">
                                    <FileText size={32} />
                                    <h2>
                                        {sectionRecords.length
                                            ? 'No matching content.'
                                            : 'No content yet.'}
                                    </h2>
                                    <p>
                                        {sectionRecords.length
                                            ? 'Try another filter or search.'
                                            : 'Only published items appear on the website.'}
                                    </p>
                                    {sectionRecords.length > 0 && (
                                        <button
                                            className="button button-outline"
                                            onClick={clearFilters}
                                        >
                                            Clear filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                displayed.map((r) => (
                                    <article key={r.id} className="content-row">
                                        <span className={`content-type type-${r.kind}`}>
                                            <FileText size={20} />
                                        </span>
                                        <div>
                                            <h3>{r.title}</h3>
                                            <p>
                                                {contentLabels[recordKind].name} · {r.category}
                                                {r.date &&
                                                    Number.isFinite(Date.parse(r.date)) &&
                                                    ' · ' +
                                                        new Intl.DateTimeFormat('en-US', {
                                                            timeZone: 'America/Chicago',
                                                            dateStyle: 'medium',
                                                        }).format(new Date(r.date))}
                                            </p>
                                        </div>
                                        <span className={`status-badge status-${r.status}`}>
                                            {r.status}
                                        </span>
                                        <button
                                            className="text-link"
                                            aria-label={`Edit ${r.title}`}
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
                    </section>
                )}
            </div>
            {editing &&
                createPortal(
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
                                    <h2 id="editor-title">
                                        {editing.id ? 'Edit' : 'New'}{' '}
                                        {contentLabels[
                                            editing.kind === 'form' ? 'form' : 'resource'
                                        ].name.toLowerCase()}
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
                                        name="title"
                                        required
                                        maxLength={140}
                                        value={editing.title}
                                        onChange={(e) =>
                                            setEditing({ ...editing, title: e.target.value })
                                        }
                                        placeholder={`${contentLabels[editing.kind === 'form' ? 'form' : 'resource'].name} title`}
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
                                        placeholder="Add the details visitors need."
                                    />
                                </label>
                                <div className="field-pair">
                                    <label>
                                        {editing.kind === 'form' ? 'Deadline' : 'Date & time'} (your
                                        device’s timezone)
                                        <input
                                            type="datetime-local"
                                            required={
                                                editing.kind === 'event' &&
                                                editing.status === 'published'
                                            }
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
                                            placeholder="Room or venue"
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
                                <details className="officer-draft-preview">
                                    <summary>Preview content</summary>
                                    <h3>{editing.title.trim() || 'Untitled'}</h3>
                                    {editing.description.trim() && <p>{editing.description}</p>}
                                    {editing.location && <p>{editing.location}</p>}
                                </details>
                                <p className="editor-hint">
                                    When published, this {editing.kind} appears on{' '}
                                    {
                                        contentLabels[editing.kind === 'form' ? 'form' : 'resource']
                                            .destination
                                    }
                                    .
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
                                              ? 'Publish'
                                              : editing.status === 'draft'
                                                ? 'Save draft'
                                                : 'Archive'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
}
function toLocalInput(iso: string) {
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return '';
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
