# Word Quest

A static GitHub Pages app for practicing 877 vocabulary words.

## GitHub Pages

- GitHub repo: https://github.com/dev-with-liam/vocab-practice
- Live app: https://dev-with-liam.github.io/vocab-practice/
- About page: https://dev-with-liam.github.io/vocab-practice/about.html

## Features

- Flashcards by world or across all 877 words
- Multiple-choice synonym and antonym quiz
- Separate synonym and opposite multiple-choice practice
- Mini-games: Match, Sort, and Scramble
- Searchable word list
- Local progress tracking with mastered, missed, and streak counts
- No build step and no runtime dependencies
- Includes 20 starter words, 200 HSPT workbook words, 80 ISEE practice words, 100 SSAT high-school prep words, and 477 HSPT PDF words and roots
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
