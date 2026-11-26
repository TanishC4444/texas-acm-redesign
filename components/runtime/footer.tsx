import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function ChapterFooter() {
    return (
        <footer className="acm-footer">
            <div className="acm-footer-top">
                <div>
                    <p className="acm-eyebrow">THERE’S A PLACE FOR YOU HERE.</p>
                    <h2>
                        Let’s make
                        <br />
                        something of it.
                    </h2>
                </div>
                <a
                    className="rt-button"
                    href="https://discord.gg/tspJCpFFKx"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Join the community <ArrowUpRight size={20} aria-hidden="true" />
                </a>
            </div>
            <div className="acm-footer-bottom">
                <Link className="acm-footer-brand" href="/" aria-label="Texas ACM home">
                    <img src="/texasacm-symbol.svg" alt="" width="36" height="30" />
                    <strong>texas acm</strong>
                </Link>
                <p>
                    The University of Texas at Austin
                    <br />
                    Association for Computing Machinery
                </p>
                <nav aria-label="Footer navigation">
                    <a
                        href="https://www.instagram.com/texas_acm/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Instagram ↗
                    </a>
                    <a
                        href="https://www.linkedin.com/company/utexas-acm/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn ↗
                    </a>
                    <Link href="/signin">Event sign-in</Link>
                    <Link href="/officer">Officer login</Link>
                </nav>
            </div>
        </footer>
    );
}
