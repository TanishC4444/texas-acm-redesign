export const defaults = {
    theme: 'system',
    layout: 'grid',
    accent: 'green',
    motion: 'auto',
    text: '100',
    contrast: 'standard',
    spacing: 'standard',
    links: 'standard',
} as const;
export type Settings = {
    theme: 'system' | 'dark' | 'light';
    layout: 'grid' | 'read';
    accent: 'green';
    motion: 'auto' | 'full' | 'reduced' | 'off';
    text: '100' | '115' | '130' | '150' | '200';
    contrast: 'standard' | 'high';
    spacing: 'standard' | 'relaxed';
    links: 'standard' | 'underlined';
};
export const options: { [K in keyof Settings]: readonly Settings[K][] } = {
    theme: ['system', 'dark', 'light'],
    layout: ['grid'],
    accent: ['green'],
    motion: ['auto', 'full', 'reduced', 'off'],
    text: ['100', '115', '130', '150', '200'],
    contrast: ['standard', 'high'],
    spacing: ['standard', 'relaxed'],
    links: ['standard', 'underlined'],
};
export function validateSettings(raw: unknown): Settings {
    const next: Settings = { ...defaults };
    if (raw && typeof raw === 'object')
        for (const key of Object.keys(options) as (keyof Settings)[]) {
            const value = (raw as Record<string, unknown>)[key];
            if ((options[key] as readonly unknown[]).includes(value))
                Object.assign(next, { [key]: value });
        }
    return next;
}
export function applySettings(value: Settings) {
    const el = document.documentElement;
    const dark =
        value.theme === 'dark' ||
        (value.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    el.dataset.theme = dark ? 'dark' : 'light';
    el.classList.toggle('dark', dark);
    for (const [key, val] of Object.entries(value)) if (key !== 'theme') el.dataset[key] = val;
    el.dataset.motionResolved =
        value.motion === 'auto'
            ? matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'reduced'
                : 'full'
            : value.motion;
}
export const settingsScript = `try{const o=${JSON.stringify(options)},d=${JSON.stringify(defaults)};let s={...d};const h=new URLSearchParams(location.hash.slice(1));const raw=h.has('look')?JSON.parse(h.get('look')):JSON.parse(localStorage.getItem('acm-runtime-settings')||'{}');for(const k in o)if(raw&&o[k].includes(raw[k]))s[k]=raw[k];const e=document.documentElement;const dark=s.theme==='dark'||(s.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);e.dataset.theme=dark?'dark':'light';e.classList.toggle('dark',dark);for(const k in s)if(k!=='theme')e.dataset[k]=s[k];e.dataset.motionResolved=s.motion==='auto'?(matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':'full'):s.motion;if(h.has('look'))localStorage.setItem('acm-runtime-settings',JSON.stringify(s));}catch{document.documentElement.dataset.theme='dark';}`;
