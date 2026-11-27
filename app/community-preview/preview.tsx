'use client';

import { useEffect, useState, type FormEvent } from 'react';

const opportunities = {
    Build: 'Find a design partner for a campus transit prototype.',
    Join: 'Pair with a student founder to build a volunteer scheduling app.',
    Test: 'Spend 10 minutes trying a new course-planning workflow.',
};

export function StartupPreview() {
    const [filter, setFilter] = useState<keyof typeof opportunities>('Build');
    return (
        <>
            <div className="community-switches" role="group" aria-label="Startup opportunities">
                {(['Build', 'Join', 'Test'] as const).map((kind) => (
                    <button
                        className="rt-button"
                        key={kind}
                        onClick={() => setFilter(kind)}
                        aria-pressed={filter === kind}
                    >
                        {kind}
                    </button>
                ))}
            </div>
            <p role="status">{opportunities[filter]}</p>
        </>
    );
}

const answer = 'STACK';
const maxAttempts = 4;
const storageKey = 'acm-community-preview-guesses';

export function CommunityGame() {
    const [guesses, setGuesses] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [ready, setReady] = useState(false);
    useEffect(() => {
        try {
            const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
            if (Array.isArray(saved)) {
                setGuesses(
                    saved
                        .filter(
                            (guess): guess is string =>
                                typeof guess === 'string' && /^[A-Z]{5}$/.test(guess),
                        )
                        .slice(0, maxAttempts),
                );
            }
        } catch {
            // The puzzle can still be played for this visit.
        }
        setReady(true);
    }, []);

    const won = guesses.includes(answer);
    const complete = won || guesses.length >= maxAttempts;
    function submit(event: FormEvent) {
        event.preventDefault();
        if (!ready || complete || !/^[A-Z]{5}$/.test(input)) return;
        const next = [...guesses, input];
        setGuesses(next);
        setInput('');
        try {
            localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
            // Keep the score for this visit.
        }
    }

    function reset() {
        setGuesses([]);
        setInput('');
        try {
            localStorage.removeItem(storageKey);
        } catch {
            // The in-memory round has already been reset.
        }
    }

    return (
        <div className="community-game">
            <div>
                <p>Guess the five-letter CS term in four tries. Clue: last in, first out.</p>
                <ul className="community-guesses" aria-label="Guesses">
                    {guesses.map((guess, i) => (
                        <li
                            key={i}
                            aria-label={
                                guess +
                                ', ' +
                                [...guess].filter((letter, pos) => letter === answer[pos]).length +
                                ' letters in the right position'
                            }
                        >
                            {[...guess].map((letter, pos) => (
                                <span
                                    key={pos}
                                    data-correct={letter === answer[pos]}
                                    aria-hidden="true"
                                >
                                    {letter}
                                </span>
                            ))}
                        </li>
                    ))}
                </ul>
                <form onSubmit={submit}>
                    <label htmlFor="community-guess">Your guess</label>
                    <input
                        id="community-guess"
                        autoComplete="off"
                        maxLength={5}
                        minLength={5}
                        pattern="[A-Z]{5}"
                        required
                        value={input}
                        onChange={(event) =>
                            setInput(event.target.value.toUpperCase().replace(/[^A-Z]/g, ''))
                        }
                        disabled={!ready || complete}
                    />
                    <button className="rt-button rt-primary" disabled={!ready || complete}>
                        Guess
                    </button>
                </form>
                <p role="status">
                    {won
                        ? 'Correct. You earned 10 demo points.'
                        : complete
                          ? 'The term was STACK.'
                          : maxAttempts -
                            guesses.length +
                            ' attempts left. Mint marks a letter in the right position.'}
                </p>
                {complete && (
                    <button className="rt-button" onClick={reset}>
                        Reset demo puzzle
                    </button>
                )}
            </div>
            <div className="community-score">
                <h3>Sample season standings</h3>
                <ol>
                    <li>
                        Byte Club <strong>80 pts</strong>
                    </li>
                    <li>
                        Kernel Crew <strong>60 pts</strong>
                    </li>
                    <li>
                        You <strong>{won ? 10 : 0} pts</strong>
                    </li>
                </ol>
                <p>
                    Demo score stays in this browser. Live scores would use opt-in member profiles
                    and server-awarded points.
                </p>
            </div>
        </div>
    );
}
