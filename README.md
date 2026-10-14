# Word Quest

A static GitHub Pages app with 857 vocabulary study entries across HSPT, ISEE, and SSAT.

## GitHub Pages

- GitHub repo: https://github.com/dev-with-liam/vocab-practice
- Live app: https://dev-with-liam.github.io/vocab-practice/

## Features

- Guided daily sessions mix up to 10 due reviews and new words, with saved resume and a results summary
- Separate XP and mastery: earn 10 XP per word per day; master a word with successful recall on three separate days
- Reviews return after 1, 3, 7, 14, and 30 days; missed words return the next day
- Existing mastered and missed words migrate automatically; XP starts at zero for old saves
- Learn, Practice, and Games navigation with controls specific to the current activity

- Flashcards by HSPT, ISEE, or SSAT category
- Multiple-choice synonym and antonym quiz with answer explanations and examples
- Built-in spoken pronunciation for flashcards and vault entries
- Separate synonym and opposite multiple-choice practice
- Mini-games: Match, Sort, and Scramble
- Searchable word list
- Local progress tracking with XP, mastery, missed words, review dates, and session history
- No build step and no runtime dependencies
- One shared study catalog: 677 HSPT entries (630 distinct words), 80 ISEE words, and 100 SSAT words
- All 200 workbook and 477 extended HSPT entries are included in flashcards, daily sessions, synonym practice, and the vault
- Daily sessions avoid repeated spellings; answer choices have distinct labels
- Opposites uses entries with available opposite clues; the screen shows its coverage count
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

## Check Learning Rules

```bash
node --test tests/*.test.cjs
```

Progress and session state are stored locally under `vocab-progress`. `learning.js` owns migration, XP, mastery, and review scheduling. Clearing browser data removes progress; the Saved progress menu can copy a JSON backup.

Coverage checks verify every supplied entry is reachable through daily sessions and preserve existing entry IDs. These counts describe the bundled study lists, not an exhaustive list of possible exam vocabulary.
