import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export const metadata = { title: 'Design directions | Texas ACM' };
export default function Designs() {
    return (
        <div className="design-gallery">
            <span className="eyebrow">TEXAS ACM / CREATIVE DIRECTIONS</span>
            <h1>
                Same people.
                <br />
                <em>Two possibilities.</em>
            </h1>
            <p>
                Both directions draw from ACM’s Instagram: mint palettes, retro interfaces, collage,
                and a friendly, student-first voice. Explore the full homepage in either direction.
            </p>
            <div className="design-options">
                <Link href="/" className="design-option design-campus">
                    <span className="eyebrow">DIRECTION 01 / CAMPUS STUDIO</span>
                    <h2>
                        Your people.
                        <br />
                        Your next
                        <br />
                        <em>big thing.</em>
                    </h2>
                    <div className="design-swatches">
                        <i />
                        <i />
                        <i />
                    </div>
                    <p>
                        Mint. Paper. Punchy orange. A playful editorial direction with a retro
                        community window.
                    </p>
                    <span className="button button-dark">
                        Explore Campus Studio <ArrowUpRight size={18} />
                    </span>
                </Link>
                <Link href="/designs/night" className="design-option design-night">
                    <span className="eyebrow">DIRECTION 02 / AFTER HOURS</span>
                    <h2>
                        Stay curious.
                        <br />
                        Make a little
                        <br />
                        <em>noise.</em>
                    </h2>
                    <div className="design-swatches">
                        <i />
                        <i />
                        <i />
                    </div>
                    <p>
                        Ink. Electric mint. Warm orange. A high-contrast direction with the energy
                        of a late-night build.
                    </p>
                    <span className="button button-mint">
                        Explore After Hours <ArrowUpRight size={18} />
                    </span>
                </Link>
            </div>
            <p className="design-note">
                Campus Studio is the current implementation. After Hours is an alternate homepage
                treatment for comparison.
            </p>
        </div>
    );
}
