'use client';
import { useEffect, useState } from 'react';
import { useRuntime } from './provider';
import { Join, RouteLink } from './primitives';
import LayeredPhoto, { type HeroPhoto } from './layered-photo';
import ChapterReveal, { INTRO_DURATION } from '@/components/revamp/logo-reveal';
const photos: HeroPhoto[] = [
    {
        src: '/studio/acmformal25.webp',
        alt: 'Texas ACM members at the chapter formal',
        slot: 'home',
        height: 1064,
        logoTop: 86,
        alignTop: true,
        foreground:
            'M 260 1064 L 268 365 Q 269 336 289 325 L 318 305 Q 321 269 330 243 Q 346 203 374 202 Q 406 201 423 237 Q 429 251 426 267 Q 439 236 473 235 Q 505 234 520 264 L 534 320 Q 550 285 576 276 Q 607 266 628 293 L 645 331 Q 657 303 668 283 Q 689 248 720 249 Q 749 250 764 279 L 778 327 Q 784 300 812 287 L 821 267 Q 808 266 802 247 Q 791 229 801 215 Q 812 203 829 206 Q 844 190 868 193 Q 883 193 892 187 Q 905 184 908 201 Q 908 210 899 222 Q 914 246 899 280 Q 940 289 962 326 Q 967 287 974 254 Q 987 211 1016 210 Q 1046 207 1064 234 Q 1082 267 1081 307 L 1096 335 Q 1107 300 1117 267 Q 1128 233 1154 230 Q 1180 229 1194 254 Q 1207 280 1207 317 Q 1217 274 1242 257 Q 1268 242 1294 264 Q 1317 285 1321 336 L 1362 420 L 1370 1064 Z',
    },
    {
        src: '/studio/pwp.webp',
        alt: 'Students meeting professors at Texas ACM',
        slot: 'gallery-1',
        height: 1331,
        logoTop: 390,
        foreground:
            'M 141 1331 L 150 732 Q 171 688 217 676 Q 188 658 186 618 Q 180 590 199 572 Q 216 554 237 554 Q 253 542 271 553 Q 297 552 312 571 Q 335 576 341 602 Q 353 622 341 648 Q 330 673 309 680 Q 349 684 371 706 Q 399 730 395 789 L 410 1331 Z M 730 1331 L 734 993 Q 738 965 765 945 L 853 904 L 846 872 Q 825 849 823 812 Q 813 775 824 737 Q 824 716 843 705 Q 852 684 877 681 Q 890 666 911 670 Q 931 659 956 669 Q 977 670 987 682 Q 1015 682 1021 703 Q 1041 713 1035 737 Q 1048 762 1031 793 Q 1024 851 1005 881 L 1074 869 Q 1120 868 1147 905 Q 1179 951 1168 1031 L 1180 1331 Z',
    },
    {
        src: '/studio/family-feud.webp',
        alt: 'Texas ACM students at Family Feud',
        slot: 'events',
        height: 1067,
        logoTop: 305,
        foreground:
            'M 0 1067 L 0 591 Q 6 569 23 552 Q 8 528 19 501 Q 29 469 67 463 Q 100 461 113 490 Q 128 517 114 543 L 100 560 Q 141 573 170 604 Q 174 559 188 539 Q 195 502 220 485 Q 243 469 271 478 Q 308 479 324 507 Q 340 532 328 568 Q 357 580 376 603 L 402 1067 Z M 542 1067 L 540 733 Q 547 687 574 653 L 586 631 Q 574 605 581 574 Q 590 537 618 532 Q 651 523 668 547 Q 685 569 676 601 L 666 620 Q 709 630 735 656 L 747 1067 Z M 725 1067 L 733 781 Q 739 758 783 745 Q 771 729 775 706 Q 766 682 777 658 Q 786 635 808 623 Q 827 613 857 616 Q 890 616 906 641 Q 923 661 916 691 Q 911 715 910 740 Q 953 751 979 774 Q 1010 801 1004 839 L 1030 1067 Z',
    },
];
let introduced = false;
export default function RuntimeHero() {
    const { settings } = useRuntime();
    const [active, setActive] = useState(0);
    const [intro, setIntro] = useState(false);
    useEffect(() => {
        if (introduced) return;
        introduced = true;
        if (location.hash && !location.hash.startsWith('#look=')) return;
        if (
            document.documentElement.dataset.motionResolved !== 'full' ||
            document.documentElement.dataset.layout === 'read'
        )
            return;
        setIntro(true);
    }, []);
    useEffect(() => {
        if (!intro) return;
        const timer = setTimeout(() => setIntro(false), INTRO_DURATION);
        return () => clearTimeout(timer);
    }, [intro]);
    useEffect(() => {
        if (!intro) return;
        if (document.documentElement.dataset.motionResolved !== 'full') setIntro(false);
    }, [intro, settings.motion]);
    useEffect(() => {
        if (
            settings.layout === 'read' ||
            document.documentElement.dataset.motionResolved !== 'full'
        )
            return;
        const timer = setInterval(() => {
            if (!document.hidden && document.documentElement.dataset.motionResolved === 'full')
                setActive((value) => (value + 1) % photos.length);
        }, 6500);
        return () => clearInterval(timer);
    }, [settings.motion, settings.layout]);
    return (
        <>
            {intro && <ChapterReveal onSkip={() => setIntro(false)} />}
            <section
                className="vibrant-opening acm-immersive-hero"
                data-intro={intro}
                aria-labelledby="acm-home-title"
            >
                <h1 id="acm-home-title" className="sr-only">
                    Texas ACM
                </h1>
                <div className="vibrant-stage">
                    <div className="acm-hero-main">
                        <div className="vibrant-art">
                            <div className="vibrant-photos" aria-label="Chapter photos">
                                {photos.map((photo, i) => (
                                    <LayeredPhoto
                                        key={photo.src}
                                        photo={photo}
                                        active={i === active}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="rt-actions acm-hero-actions">
                            <Join />
                            <RouteLink href="/#calendar">See events</RouteLink>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
