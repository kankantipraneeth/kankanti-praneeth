# Fonts

`anek-telugu-pra.woff2` is a subset of **Anek Telugu** (Ek Type, variable `wght` 100–800 and `wdth` 75–125),
licensed under the SIL Open Font License 1.1 (https://openfontlicense.org). Subsetting is permitted by the OFL.

It contains only U+0C2A (ప), U+0C4D (్) and U+0C30 (ర) plus the glyphs their shaping needs, so the
specimen glyph ప్ర renders with the full variable axes at 9 KB instead of 393 KB.

Regenerate from the full font (as downloaded by next/font from Google Fonts):

```
pyftsubset AnekTelugu.woff2 --text="ప్ర" --layout-features='*' --flavor=woff2 --output-file=app/fonts/anek-telugu-pra.woff2
```

If the site ever renders more Telugu text, switch back to `Anek_Telugu` from `next/font/google`.
