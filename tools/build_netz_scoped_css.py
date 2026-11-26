"""
Genera assets/css/netz-scoped.css: el CSS de NETZ (bootstrap + main + fontawesome + responsive
+ typography + whatsapp) con cada regla prefijada por `.netz-scope`.

Sirve para páginas independientes (p. ej. e-commerce-demo.html) que tienen su propio diseño
pero deben mostrar el navbar y el footer de NETZ idénticos: se envuelven en
<div class="netz-scope">...</div> y el CSS de NETZ solo afecta a ese bloque.

Uso:  python tools/build_netz_scoped_css.py
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS_DIR = os.path.join(ROOT, 'assets', 'css')
SOURCES = ['bootstrap.min.css', 'main.min.css', 'fontawesome-all.css',
           'responsive.css', 'typography.css', 'whatsapp.css']
OUT = os.path.join(CSS_DIR, 'netz-scoped.css')
SCOPE = '.netz-scope'
KF_PREFIX = 'nz-'
IMPORTS = []  # @import de fuentes externas, se escriben al inicio

PASSTHROUGH_AT = ('@font-face', '@page', '@charset', '@import', '@namespace', '@-ms-viewport', '@viewport')
KEYFRAMES_RE = re.compile(r'@(-webkit-|-moz-|-o-)?keyframes\s+([\w-]+)', re.I)


def strip_comments(css):
    return re.sub(r'/\*.*?\*/', '', css, flags=re.S)


def split_top(s, sep=','):
    """Divide por `sep` ignorando lo que esté dentro de () o []."""
    out, depth, cur = [], 0, ''
    for ch in s:
        if ch in '([':
            depth += 1
        elif ch in ')]':
            depth -= 1
        if ch == sep and depth == 0:
            out.append(cur)
            cur = ''
        else:
            cur += ch
    out.append(cur)
    return out


def scope_selector(sel):
    sel = sel.strip()
    if not sel:
        return sel
    # html / :root al inicio -> se quitan
    sel = re.sub(r'^(html|:root)(?=\s|$|[.#:\[])', '', sel).strip()
    if not sel:
        return SCOPE
    # body al inicio -> el propio contenedor
    m = re.match(r'^body(?=\s|$|[.#:\[>+~])', sel)
    if m:
        rest = sel[4:]
        return SCOPE + rest
    if sel.startswith('>'):
        return SCOPE + ' ' + sel
    return SCOPE + ' ' + sel


def find_block_end(css, start):
    """`start` apunta justo después de '{'. Devuelve el índice del '}' que cierra."""
    depth = 1
    i = start
    in_str = None
    while i < len(css):
        ch = css[i]
        if in_str:
            if ch == '\\':
                i += 2
                continue
            if ch == in_str:
                in_str = None
        elif ch in '"\'':
            in_str = ch
        elif ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return len(css)


def process(css, kf_names):
    out = []
    i = 0
    n = len(css)
    while i < n:
        # saltar espacios
        while i < n and css[i] in ' \t\r\n':
            i += 1
        if i >= n:
            break
        if css[i] == '@':
            # at-rule
            stmt = re.match(r'@(import|charset|namespace)\s+(?:url\(\s*)?(["\'])(.*?)\2\s*\)?[^;{]*;', css[i:], re.I | re.S)
            if stmt:
                # @import de fuentes externas (http/https) -> se suben al inicio del archivo;
                # los @import relativos (owl, slick, etc.) no hacen falta para navbar/footer.
                if stmt.group(1).lower() == 'import' and stmt.group(3).startswith(('http://', 'https://', '//')):
                    IMPORTS.append(stmt.group(0).strip())
                i += stmt.end()
                continue
            brace = css.find('{', i)
            head = css[i:brace].strip()
            end = find_block_end(css, brace + 1)
            body = css[brace + 1:end]
            low = head.lower()
            if KEYFRAMES_RE.match(head):
                head = KEYFRAMES_RE.sub(lambda m: '@%skeyframes %s%s' % (m.group(1) or '', KF_PREFIX, m.group(2)), head)
                out.append(head + '{' + body + '}')
            elif low.startswith(PASSTHROUGH_AT):
                out.append(head + '{' + body + '}')
            else:  # @media, @supports, @document...
                out.append(head + '{' + process(body, kf_names) + '}')
            i = end + 1
            continue
        brace = css.find('{', i)
        if brace == -1:
            break
        selectors = css[i:brace]
        end = find_block_end(css, brace + 1)
        decls = css[brace + 1:end]
        scoped = ','.join(scope_selector(s) for s in split_top(selectors))
        decls = rename_animations(decls, kf_names)
        out.append(scoped + '{' + decls + '}')
        i = end + 1
    return '\n'.join(out)


def rename_animations(decls, kf_names):
    def fix(m):
        prop, val = m.group(1), m.group(2)
        val = re.sub(r'[\w-]+', lambda w: KF_PREFIX + w.group(0) if w.group(0) in kf_names else w.group(0), val)
        return prop + val
    return re.sub(r'((?:-webkit-|-moz-|-o-)?animation(?:-name)?\s*:)([^;}]*)', fix, decls)


def main():
    parts = []
    for name in SOURCES:
        path = os.path.join(CSS_DIR, name)
        with open(path, encoding='utf-8', errors='ignore') as fh:
            parts.append((name, strip_comments(fh.read())))
    kf_names = set()
    for _, css in parts:
        kf_names |= {m.group(2) for m in KEYFRAMES_RE.finditer(css)}
    body = []
    for name, css in parts:
        body.append('/* ---- %s ---- */' % name)
        body.append(process(css, kf_names))
    result = IMPORTS + ['/* GENERADO por tools/build_netz_scoped_css.py — no editar a mano */'] + body
    with open(OUT, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('\n'.join(result) + '\n')
    print('OK ->', OUT, '(%d keyframes renombrados)' % len(kf_names))


if __name__ == '__main__':
    main()
