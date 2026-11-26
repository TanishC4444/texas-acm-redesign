"""Create an offline visual proof from Next's actual prerendered pages.
This is not a replacement for the running Next app or an integration test.
"""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
public=(root/'public').as_uri()
static=(root/'.next/static').as_uri()
for route in ['index','about','partnership','cs-guide','atoz','faq','forms','officer']:
    src=root/'.next/server/app'/f'{route}.html'
    if not src.exists():continue
    s=src.read_text()
    s=re.sub(r'<script\b[^>]*>.*?</script>', '', s, flags=re.S)
    s=re.sub(r'<link\b(?=[^>]*(?:as="script"|rel="modulepreload"))[^>]*>', '', s)
    def stylesheet(match):
        path=match.group(1)
        css=(root/'.next'/path.removeprefix('/_next/')).read_text()
        css=css.replace('/_next/static', static)
        css=re.sub(r'url\([\'"]?(/(?!/|_next)[^\)\'\"]+)[\'"]?\)',lambda m: 'url("'+public+m[1]+'")',css)
        return '<style>'+css+'</style>'
    s=re.sub(r'<link\b[^>]*href="(/_next/[^\"]+\.css)"[^>]*>',stylesheet,s)
    s=s.replace('/_next/static',static)
    s=re.sub(r'(src|href)="(/(?!/|_next)[^\"]*)"',lambda m:m[1]+'="'+public+m[2]+'"' if m[2].split('?')[0].endswith(('.webp','.png','.svg','.jpg','.woff2','.ttf')) else m[0],s)
    s=s.replace('<html ', '<html data-motion-resolved="reduced" ')
    # Local links stay inside the review snapshot; external chapter links stay real.
    for url,target in [('/#calendar','index.html#calendar'),('/#resources','index.html#resources'),('/#chapter','index.html#chapter'),('/about','about.html'),('/partnership','partnership.html'),('/cs-guide','cs-guide.html'),('/atoz','atoz.html'),('/faq','faq.html'),('/forms','forms.html'),('/officer','officer.html'),('/','index.html')]:
        s=s.replace('href="'+url+'"','href="'+target+'"')
    s=s.replace('</head>','<style>.review-note{position:fixed;bottom:8px;right:8px;z-index:100;background:#203e30;color:#fff;padding:6px 10px;font:10px/1.4 monospace;border-radius:3px;pointer-events:none}</style></head>')
    s=s.replace('</body>','<div class="review-note">VISUAL REVIEW · LIVE INTEGRATIONS REQUIRE NEXT.JS</div></body>')
    (root/'review'/f'{route}.html').write_text(s)
print(root/'review/index.html')
