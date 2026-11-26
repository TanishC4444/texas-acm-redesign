'use client';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { Volume2, VolumeX } from 'lucide-react';
const Sound = createContext({
    enabled: false,
    unavailable: false,
    toggle: async () => false,
    reveal: () => {},
    stop: () => {},
});
export function SiteSoundProvider({ children }: { children: ReactNode }) {
    const [enabled, setEnabled] = useState(false);
    const [unavailable, setUnavailable] = useState(false);
    const active = useRef(false);
    const context = useRef<AudioContext | null>(null);
    const master = useRef<GainNode | null>(null);
    const voices = useRef(new Set<OscillatorNode>());
    const stop = useCallback(() => {
        voices.current.forEach((voice) => {
            try {
                voice.stop();
            } catch {}
        });
        voices.current.clear();
    }, []);
    const tone = useCallback(
        (frequency: number, delay: number, duration: number, volume: number) => {
            const ctx = context.current;
            if (!active.current || !ctx || ctx.state !== 'running' || !master.current) return;
            const oscillator = ctx.createOscillator();
            const envelope = ctx.createGain();
            const at = ctx.currentTime + delay;
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, at);
            envelope.gain.setValueAtTime(0, at);
            envelope.gain.linearRampToValueAtTime(volume, at + 0.025);
            envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
            oscillator.connect(envelope);
            envelope.connect(master.current);
            voices.current.add(oscillator);
            oscillator.onended = () => {
                voices.current.delete(oscillator);
                oscillator.disconnect();
                envelope.disconnect();
            };
            oscillator.start(at);
            oscillator.stop(at + duration + 0.03);
        },
        [],
    );
    const reveal = useCallback(() => {
        stop();
        // Two quiet notes follow the symbol-to-name reveal.
        tone(261.63, 0, 0.7, 0.08);
        tone(392, 0.65, 0.9, 0.06);
    }, [stop, tone]);
    const toggle = useCallback(async () => {
        if (active.current) {
            active.current = false;
            setEnabled(false);
            stop();
            void context.current?.suspend();
            return false;
        }
        try {
            if (!context.current) {
                context.current = new AudioContext();
                master.current = context.current.createGain();
                master.current.gain.value = 0.16;
                master.current.connect(context.current.destination);
            }
            await context.current.resume();
            if (context.current.state !== 'running') throw new Error('Audio unavailable');
            active.current = true;
            setEnabled(true);
            setUnavailable(false);
            return true;
        } catch {
            setUnavailable(true);
            active.current = false;
            setEnabled(false);
            return false;
        }
    }, [stop]);
    useEffect(() => {
        const click = (event: MouseEvent) => {
            if (!active.current || location.pathname.startsWith('/officer')) return;
            const control = (event.target as Element)?.closest('a,button');
            if (!control || control.closest('form') || control.hasAttribute('data-sound-toggle'))
                return;
            tone(440, 0, 0.055, 0.045);
        };
        const hide = () => {
            if (document.hidden) stop();
        };
        document.addEventListener('click', click);
        document.addEventListener('visibilitychange', hide);
        return () => {
            document.removeEventListener('click', click);
            document.removeEventListener('visibilitychange', hide);
            stop();
            void context.current?.close();
            context.current = null;
        };
    }, [stop, tone]);
    return (
        <Sound.Provider value={{ enabled, unavailable, toggle, reveal, stop }}>
            {children}
        </Sound.Provider>
    );
}
export function useSiteSound() {
    return useContext(Sound);
}
export function SoundToggle({ onEnable }: { onEnable?: () => void }) {
    const sound = useSiteSound();
    return (
        <button
            type="button"
            className="sound-toggle"
            data-sound-toggle
            data-track="toggle-sound"
            aria-pressed={sound.enabled}
            aria-label={sound.enabled ? 'Turn sound off' : 'Turn sound on'}
            onClick={async () => {
                if (await sound.toggle()) onEnable?.();
            }}
        >
            {sound.enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
            <span>
                {sound.unavailable ? 'Sound unavailable' : sound.enabled ? 'Sound on' : 'Sound off'}
            </span>
        </button>
    );
}
