'use client';
import ManagedPhoto from './site-photos';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, X, Expand } from 'lucide-react';
const images = [
    { src: 'acmretreat25', alt: 'Texas ACM members together at retreat' },
    { src: 'acmformal25', alt: 'Texas ACM students at the chapter formal' },
    { src: 'familyfeud25', alt: 'Texas ACM Family Feud event' },
    { src: 'acmhand25', alt: 'Texas ACM members at a campus organization table' },
];
export default function ChapterGallery({ still = false }: { still?: boolean }) {
    const reduced = useReducedMotion();
    const [selected, setSelected] = useState<number | null>(null);
    const root = useRef<HTMLDivElement>(null);
    const dialog = useRef<HTMLDialogElement>(null);
    const trigger = useRef<HTMLElement | null>(null);
    const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] });
    const fan = useTransform(scrollYProgress, [0, 0.45, 1], [-2, 0, 1]);
    const rise = useTransform(scrollYProgress, [0, 0.5, 1], [12, 0, -8]);
    useEffect(() => {
        if (selected === null) return;
        dialog.current?.showModal();
        return () => {
            dialog.current?.close();
            trigger.current?.focus();
        };
    }, [selected === null]);
    function close() {
        setSelected(null);
    }
    return (
        <div className="chapter-photo-gallery" ref={root}>
            <div className="chapter-contact-sheet">
                {images.map((photo, i) => (
                    <motion.button
                        key={photo.src}
                        className={`chapter-contact-photo contact-${i}`}
                        data-track={`open-gallery-${i}`}
                        style={
                            reduced || still
                                ? { rotate: 0, y: 0 }
                                : { rotate: i % 2 ? fan : 0, y: i % 2 ? rise : 0 }
                        }
                        onClick={(e) => {
                            trigger.current = e.currentTarget;
                            setSelected(i);
                        }}
                        aria-label={`Open photo: ${photo.alt}`}
                    >
                        <ManagedPhoto
                            slot={`gallery-${i}`}
                            src={`/studio/${photo.src}.webp`}
                            alt={photo.alt}
                            loading="lazy"
                        />
                        <span className="photo-expand">
                            <Expand size={20} />
                            <span>View photo</span>
                        </span>
                    </motion.button>
                ))}
            </div>
            {selected !== null && (
                <dialog
                    ref={dialog}
                    className="chapter-photo-viewer"
                    aria-label="Texas ACM photo gallery"
                    onCancel={(e) => {
                        e.preventDefault();
                        close();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            setSelected((selected + 1) % images.length);
                        }
                        if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            setSelected((selected + images.length - 1) % images.length);
                        }
                    }}
                >
                    <div className="photo-viewer-tools">
                        <p>Texas ACM</p>
                        <button onClick={close} autoFocus aria-label="Close photo gallery">
                            <X />
                        </button>
                    </div>
                    <ManagedPhoto
                        slot={`gallery-${selected}`}
                        className="chapter-expanded-photo"
                        src={`/studio/${images[selected].src}.webp`}
                        alt={images[selected].alt}
                    />
                    <div className="photo-viewer-controls">
                        <button
                            onClick={() =>
                                setSelected((selected + images.length - 1) % images.length)
                            }
                            aria-label="Previous chapter photo"
                        >
                            <ArrowLeft />
                        </button>
                        <p aria-live="polite">{images[selected].alt}</p>
                        <button
                            onClick={() => setSelected((selected + 1) % images.length)}
                            aria-label="Next chapter photo"
                        >
                            <ArrowRight />
                        </button>
                    </div>
                </dialog>
            )}
        </div>
    );
}
