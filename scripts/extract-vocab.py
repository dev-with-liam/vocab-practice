#!/usr/bin/env python3
"""Extract the 200 vocabulary entries from the workbook PDF."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader


WORD_PAGE_STARTS = [4, 10, 16, 22, 28, 34, 40, 46, 52, 58]

FIXES = {
    "ﬁ": "fi",
    "ﬂ": "fl",
    "su,icient": "sufficient",
    "e,icient": "efficient",
    "e,iciency": "efficiency",
    "e,ort": "effort",
    "e,ortless": "effortless",
    "e,ective": "effective",
    "di,er": "differ",
    "di,erent": "different",
    "indi,erent": "indifferent",
    "Indi,erent": "Indifferent",
    "o,ended": "offended",
    "a,ection": "affection",
    "a,ectionate": "affectionate",
    "a,inity": "affinity",
    "a,luent": "affluent",
    "a,lict": "afflict",
    "o,icial": "official",
    "diCicult": "difficult",
    "eCort": "effort",
    "di,icult": "difficult",
    "di,iculty": "difficulty",
    "oCer": "offer",
    "oCering": "offering",
    "oCice": "office",
    "traCic": "traffic",
    "eCiciently": "efficiently",
    "ANluent": "Affluent",
    "a8luent": "affluent",
    "IndiNerent": "Indifferent",
    "indi8erent": "indifferent",
    "well-o,": "well-off",
}


def clean(value: str) -> str:
    value = " ".join(value.split())
    for bad, good in FIXES.items():
        value = value.replace(bad, good)
    return value


def extract(pdf_path: Path) -> list[dict[str, object]]:
    reader = PdfReader(str(pdf_path))
    entries: list[dict[str, object]] = []

    for set_number, start in enumerate(WORD_PAGE_STARTS, 1):
        lines: list[str] = []
        for page_index in (start, start + 1):
            text = reader.pages[page_index].extract_text() or ""
            for raw_line in text.splitlines():
                line = raw_line.strip()
                if not line or line.startswith("©") or re.match(r"Set \d+: Words", line):
                    continue
                lines.append(line)

        current: dict[str, object] | None = None
        for line in lines:
            match = re.match(r"^(\d{1,2})\.\s+(.+?)\s+[–-]\s+\(([^)]+)\)\s+(.+)$", line)
            if match:
                if current:
                    entries.append(current)
                number, word, part_of_speech, synonyms = match.groups()
                current = {
                    "set": set_number,
                    "number": int(number),
                    "word": clean(word),
                    "partOfSpeech": clean(part_of_speech),
                    "synonyms": [clean(item) for item in synonyms.split(", ")],
                    "example": "",
                }
            elif current:
                current["example"] = clean(f"{current['example']} {line}")

        if current:
            entries.append(current)

    if len(entries) != 200:
        raise RuntimeError(f"Expected 200 entries, extracted {len(entries)}")
    return entries


def main() -> None:
    if len(sys.argv) != 3:
        print("Usage: extract-vocab.py /path/to/workbook.pdf output.js", file=sys.stderr)
        raise SystemExit(2)

    entries = extract(Path(sys.argv[1]))
    output = Path(sys.argv[2])
    output.write_text(
        "window.VOCABULARY_WORDS = "
        + json.dumps(entries, indent=2, ensure_ascii=True)
        + ";\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
