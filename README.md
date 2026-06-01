# Juurdepääsupiirangu määramise prototüüp

See on prototüüp dokumendi juurdepääsupiirangu tuletamiseks metaandmetest.
Fookus on suund D: automatiseeritud ettepanek, selge "miks" ja töötaja kinnitamine.

## Mis on sees

- `pages/index.tsx` — kaksveeruline vorm + automaatne piirangupaneel
- `pages/api/juurdepääsupiirang/tuleta.ts` — API endpoint metaandmete hindamiseks
- `lib/meta.ts` — metaandmetest tuletamise loogika
- `lib/engine.ts` — AvTS § 35 alusel hindav otsustusmootor
- `components/AccessRestrictionPanel.tsx` — visuaalne vaatemoodul
- `styles/globals.css` — disainitokenid ja vormistiilid

## Käivitamine

1. `npm install`
2. `npm run dev`
3. Ava `http://localhost:3000`
