'use client';
import { useEffect, useRef } from 'react';
import CircuitField from './circuit-field';
export default function ChapterReveal({ onSkip }: { onSkip: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
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
            className="chapter-reveal"
            aria-label="Texas ACM logo introduction"
            onCancel={(e) => {
                e.preventDefault();
                onSkip();
            }}
        >
            <CircuitField />
            <div className="reveal-logo">
                <img className="reveal-logo-base" src="/texasacm-logo-white.svg" alt="Texas ACM" />
                {Array.from({ length: 8 }, (_, i) => (
                    <img
                        key={i}
                        className={`logo-slice slice-${i}`}
                        src="/texasacm-logo-white.svg"
                        alt=""
                        aria-hidden="true"
                    />
                ))}
                <img
                    className="logo-channel channel-orange"
                    src="/texasacm-logo-white.svg"
                    alt=""
                    aria-hidden="true"
                />
                <img
                    className="logo-channel channel-blue"
                    src="/texasacm-logo-white.svg"
                    alt=""
                    aria-hidden="true"
                />
            </div>
            <div className="reveal-scan" aria-hidden="true" />
            <button className="reveal-skip" autoFocus onClick={onSkip}>
                Skip introduction ↗
            </button>
            <div className="reveal-shutter shutter-left" aria-hidden="true" />
            <div className="reveal-shutter shutter-right" aria-hidden="true" />
            <div className="reveal-shutter shutter-top" aria-hidden="true" />
            <div className="reveal-shutter shutter-bottom" aria-hidden="true" />
        </dialog>
    );
}
