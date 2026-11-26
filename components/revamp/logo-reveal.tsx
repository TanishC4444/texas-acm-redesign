'use client';
import { useEffect, useRef } from 'react';
import { SoundToggle, useSiteSound } from './site-sound';
export const INTRO_DURATION = 3400;
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
            <div className="identity-camera">
                <svg
                    className="identity-lockup"
                    viewBox="0 0 1144 262"
                    role="img"
                    aria-label="Texas ACM"
                >
                    <defs>
                        <g id="identity-color-mark" fill="none" strokeWidth="29">
                            <rect
                                x="86.655"
                                y="131"
                                width="156.262"
                                height="156.262"
                                rx="30.5"
                                transform="rotate(-45 86.655 131)"
                                stroke="#ff791d"
                            />
                            <circle cx="109.5" cy="130.351" r="95" stroke="#16945b" />
                        </g>
                        <mask
                            id="identity-wordmark"
                            maskUnits="userSpaceOnUse"
                            x="340"
                            y="0"
                            width="804"
                            height="262"
                        >
                            <image href="/texasacm-logo-white.svg" width="1144" height="262" />
                        </mask>
                        <clipPath id="identity-symbol-crop">
                            <rect width="330" height="262" />
                        </clipPath>
                        <clipPath id="identity-name-crop">
                            <rect
                                className="identity-name-window"
                                x="340"
                                width="804"
                                height="262"
                            />
                        </clipPath>
                    </defs>
                    {/* The mark uses the official geometry; the wordmark retains the original asset. */}
                    <g className="identity-symbol" clipPath="url(#identity-symbol-crop)">
                        <use href="#identity-color-mark" />
                    </g>
                    <g clipPath="url(#identity-name-crop)">
                        <rect
                            className="identity-wordmark"
                            x="340"
                            width="804"
                            height="262"
                            mask="url(#identity-wordmark)"
                        />
                    </g>
                </svg>
            </div>
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
