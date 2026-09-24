# Word Quest

A static GitHub Pages app for practicing 380 vocabulary words.

## GitHub Pages

- GitHub repo: https://github.com/dev-with-liam/vocab-practice
- Live app: https://dev-with-liam.github.io/vocab-practice/

## Features

- Flashcards by HSPT, ISEE, or SSAT category
- Multiple-choice synonym and antonym quiz
- Separate synonym and opposite multiple-choice practice
- Mini-games: Match, Sort, and Scramble
- Searchable word list
- Local progress tracking with mastered, missed, and streak counts
- No build step and no runtime dependencies
- Includes 200 HSPT workbook words, 80 ISEE practice words, and 100 SSAT high-school prep words
- Vault includes 677 HSPT words by combining workbook and extended HSPT vocabulary
- Uses short middle-school themed sentences in the app

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
