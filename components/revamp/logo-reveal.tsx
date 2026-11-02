'use client';
import { useEffect, useRef } from 'react';
import { SoundToggle, useSiteSound } from './site-sound';
export const INTRO_DURATION = 2700;
export default function ChapterReveal({ onSkip }: { onSkip: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const sound = useSiteSound();
    useEffect(() => {
        if (sound.enabled) sound.reveal();
        return sound.stop;
    }, [sound.enabled, sound.reveal, sound.stop]);
    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        dialog.current?.showModal();
        return () => {
            dialog.current?.close();
            if (previous?.isConnected) previous.focus();
        };
    }, []);
    return (
        <dialog
            ref={dialog}
            className="identity-intro"
            aria-label="Texas ACM introduction"
            onCancel={(e) => {
                e.preventDefault();
                onSkip();
            }}
        >
            <div className="identity-intro-sound">
                <SoundToggle />
            </div>
            <svg
                className="identity-lockup"
                viewBox="0 0 1144 262"
                role="img"
                aria-label="Texas ACM"
            >
                <defs>
                    <clipPath id="identity-symbol-crop">
                        <rect width="330" height="262" />
                    </clipPath>
                    <clipPath id="identity-name-crop">
                        <rect className="identity-name-window" x="340" width="804" height="262" />
                    </clipPath>
                </defs>
                {/* Both pieces are cropped views of the unchanged official logo asset. */}
                <g className="identity-symbol" clipPath="url(#identity-symbol-crop)">
                    <image href="/texasacm-logo-white.svg" width="1144" height="262" />
                </g>
                <g clipPath="url(#identity-name-crop)">
                    <image href="/texasacm-logo-white.svg" width="1144" height="262" />
                </g>
            </svg>
            <button
                className="identity-intro-skip"
                autoFocus
                onClick={onSkip}
                aria-label="Skip introduction"
            >
                Skip intro
            </button>
        </dialog>
    );
}
