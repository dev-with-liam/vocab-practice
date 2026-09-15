# HSPT Vocab Practice

A static GitHub Pages app for practicing 380 entrance-exam vocabulary words.

## Features

- Flashcards by world or across all 380 words
- Multiple-choice synonym quiz
- Typed answer practice from synonym prompts
- Searchable word list
- Local progress tracking with mastered, missed, and streak counts
- No build step and no runtime dependencies
- Includes 200 HSPT workbook words, 80 ISEE practice words, and 100 SSAT high-school prep words

## Run Locally

Open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish To GitHub Pages

1. Create a GitHub repository.
2. Push this folder to the repository.
3. In GitHub, go to `Settings` -> `Pages`.
4. Set the source to `GitHub Actions`.
5. Push to `main`; the included workflow deploys the site.

## Regenerate Vocabulary Data

The generated HSPT workbook data lives in `data/vocabulary.js`. To regenerate it from the PDF:

```bash
python3 scripts/extract-vocab.py "/Users/liamsood/Downloads/Vocabulary-Workbook (1).pdf" data/vocabulary.js
```
