#!/usr/bin/env python3
# Összefűzi a forrásdarabokat egyetlen önálló index.html-be (beágyazott KaTeX-szel).
import io, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
KX   = os.path.join(ROOT, "_katex")

def read(p):
    with io.open(p, "r", encoding="utf-8") as f:
        return f.read()

katex_css = read(os.path.join(KX, "katex-embedded.css"))
katex_js  = read(os.path.join(KX, "katex.min.js"))
autorender= read(os.path.join(KX, "auto-render.min.js"))
app_css   = read(os.path.join(HERE, "app.css"))
body_html = read(os.path.join(HERE, "body.html"))
content_js= read(os.path.join(HERE, "content.js"))
lessons_js= read(os.path.join(HERE, "lessons.js"))
content2_js= read(os.path.join(HERE, "content2.js"))
exp2_js   = read(os.path.join(HERE, "exp2.js"))
engine_js = read(os.path.join(HERE, "engine.js"))

html = (
"<!doctype html>\n<html lang=\"hu\">\n<head>\n"
"<meta charset=\"UTF-8\">\n"
"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover\">\n"
"<title>Numerikus módszerek — vizsgafelkészítő</title>\n"
"<style>\n" + katex_css + "\n</style>\n"
"<style>\n" + app_css + "\n</style>\n"
"</head>\n<body>\n"
+ body_html +
"\n<script>\n" + katex_js + "\n</script>\n"
"<script>\n" + autorender + "\n</script>\n"
"<script>\n" + content_js + "\n</script>\n"
"<script>\n" + lessons_js + "\n</script>\n"
"<script>\n" + content2_js + "\n</script>\n"
"<script>\n" + exp2_js + "\n</script>\n"
"<script>\n" + engine_js + "\n</script>\n"
"</body>\n</html>\n"
)

out = os.path.join(ROOT, "index.html")
with io.open(out, "w", encoding="utf-8") as f:
    f.write(html)
print("Wrote", out, "(", len(html), "bytes )")
