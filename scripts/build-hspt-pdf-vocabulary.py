#!/usr/bin/env python3
"""Build the HSPT PDF vocabulary data file.

The PDF stores numbered words in a left column and definitions in a wider right
column. Plain text extraction can scramble wrapped definitions, so this script
uses text coordinates from pypdf to rebuild each visual row.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader


FILLER_SENTENCES = (
    "During a HSPT prep match",
    "During class",
    "At lunch",
    "In middle school",
    "can mean",
)

CONTEXTS = [
    "student council",
    "science fair",
    "mock trial",
    "history project",
    "soccer practice",
    "library debate",
    "morning announcements",
    "school newspaper",
    "theater rehearsal",
    "community cleanup",
]

PDF_SET_START = 22

TAIL_ENTRIES = {
    424: ("semi", "half; a prefix meaning half or partly"),
    425: ("mono", "one; single"),
    426: ("pluri", "many; more than one"),
    427: ("multi", "many; much; multiple"),
    428: ("poly", "many; much"),
    429: ("duo", "two items of the same kind"),
    430: ("quad", "four; a rectangular area surrounded by buildings"),
    431: ("quat", "four"),
    432: ("quint", "five; one of five children born at the same time"),
    433: ("pent", "five"),
    434: ("sext", "six; the fourth of the seven canonical hours"),
    435: ("sept", "seven; people descended from a common ancestor"),
    436: ("dec", "ten"),
    437: ("cent", "one hundred; a fractional monetary unit"),
    438: ("mill", "one thousand; a facility for manufacturing"),
    439: ("proto", "first; earliest; original"),
    440: ("ology", "the study of a subject"),
    441: ("micro", "extremely small"),
    442: ("macro", "very large"),
    443: ("hypo", "under; below; less than normal"),
    444: ("hyper", "over; above; excessive"),
    445: ("tachy", "fast; rapid"),
    446: ("brady", "slow"),
    447: ("inter", "between; among; or place in a grave"),
    448: ("homo", "same; or a member of the family Hominidae"),
    449: ("post", "after; or an upright piece of timber or metal"),
    450: ("pro", "for; in favor of"),
    451: ("retro", "backward; reminiscent of the past"),
    452: ("a", "not; without; or the first letter of the alphabet"),
    453: ("ab", "away from; or the muscles of the abdomen"),
    454: ("anti", "against; not in favor of"),
    455: ("in", "in; into; or not"),
    456: ("non", "not; negation of a word or group of words"),
    457: ("e", "out; or the fifth letter of the alphabet"),
    458: ("ex", "out of; former; or the twenty-fourth letter of the alphabet"),
    459: ("con", "against; an argument opposed to a proposal"),
    460: ("col", "together; or a pass between mountain peaks"),
    461: ("auto", "self; or a motor vehicle"),
    462: ("morph", "shape; form; cause to change shape"),
    463: ("graph", "write; draw; a visual representation of quantities"),
    464: ("pater", "father"),
    465: ("mater", "mother"),
    466: ("frat", "brother; a social club for male undergraduates"),
    467: ("gen", "birth; origin; or informal information"),
    468: ("tact", "touch; consideration in dealing with others"),
    469: ("son", "sound; or a male human offspring"),
    470: ("corp", "body; or a business firm"),
    471: ("man", "hand; or an adult male person"),
    472: ("ad", "toward; or a public promotion"),
    473: ("ante", "before; the initial contribution each player makes to the pot"),
    474: ("il", "not; a form of in- before some words"),
    475: ("intro", "within; inward; or a brief introductory passage"),
    476: ("peri", "around; or a supernatural being in Persian folklore"),
    477: ("re", "again; back; or the second note of a major scale"),
}

SPECIAL_EXAMPLES = {
    "wan": "After three sleepless nights, her wan face made the nurse ask if she felt well.",
    "wane": "Interest in the rumor began to wane once the truth was announced.",
    "wax": "The art teacher warmed the wax before students shaped it into seals.",
    "whim": "On a whim, the class moved its book discussion outside under the oak tree.",
    "wince": "Eli tried not to wince when the bandage came off his scraped knee.",
    "wrath": "The referee's unfair call stirred the crowd's wrath.",
    "yearn": "After a month indoors, the hikers began to yearn for a clear trail.",
    "zeal": "The volunteers attacked the cleanup with zeal and finished before noon.",
    "zealot": "The zealot defended the rule so fiercely that no compromise seemed possible.",
    "zenith": "Winning the state championship was the zenith of the team's season.",
    "zephyr": "A cool zephyr moved through the open classroom windows.",
}

DEFINITION_OVERRIDES = {
    96: "careful, thorough, and guided by a sense of duty",
    398: "complete; absolute; or to speak aloud",
}

ROOT_EXAMPLES = {
    "semi": "In semicircle and semifinal, semi signals something half or partly complete.",
    "mono": "Mono helped her decode monologue as one person speaking alone.",
    "pluri": "The word plurilingual uses pluri to suggest many languages.",
    "multi": "Multi in multicultural reminded the class that the festival included many traditions.",
    "poly": "Poly in polygon helped Liam remember that the shape had many sides.",
    "duo": "The talent-show duo practiced until the two singers could enter together.",
    "quad": "Quad helped the geometry group remember that quadrilateral refers to four sides.",
    "quat": "Quat pointed the Latin club toward the idea of four in older word roots.",
    "quint": "Quint helped the class connect quintet with a group of five musicians.",
    "pent": "Pent in pentagon reminded the team to draw five sides.",
    "sext": "Sext helped the etymology notes mark a connection to six.",
    "sept": "Sept in September once pointed to the seventh month in an older calendar.",
    "dec": "Dec helped Mateo remember that decade names a span of ten years.",
    "cent": "Cent in century reminded the class to count one hundred years.",
    "mill": "Mill in millennium helped the timeline jump by one thousand years.",
    "proto": "Proto in prototype told the team they were looking at the first version.",
    "ology": "Biology uses ology to show it is the study of living things.",
    "micro": "Micro in microscope reminded her that the tool reveals extremely small details.",
    "macro": "Macro helped the economics class discuss very large patterns instead of tiny choices.",
    "hypo": "Hypo in hypothermia warned the hikers that body temperature had fallen below normal.",
    "hyper": "Hyper in hyperactive suggested energy above the usual level.",
    "tachy": "Tachy helped the medic read tachycardia as an unusually fast heartbeat.",
    "brady": "Brady helped the medic read bradycardia as an unusually slow heartbeat.",
    "inter": "Inter in international showed that the project involved nations between and among one another.",
    "homo": "Homo in homogeneous helped the science group describe a sample that was the same throughout.",
    "post": "Post in postgame told fans the interview happened after the match.",
    "pro": "During the debate, the pro side argued in favor of the proposal.",
    "retro": "The retro poster looked as if it belonged in an older movie theater.",
    "a": "A in apolitical helped her see that the word meant without political interest.",
    "ab": "Ab in abduct helped the class notice a sense of movement away.",
    "anti": "The anti-litter campaign argued against trashing the park.",
    "in": "In in indirect can signal not, while in insert it means into.",
    "non": "Non in nonfiction told the reader the book was not invented.",
    "e": "E in eject helped the class hear the idea of throwing something out.",
    "ex": "Ex in exhale reminded everyone that air moves out of the lungs.",
    "con": "The con speaker presented the argument against the new rule.",
    "col": "Col in collaborate helped the group hear the idea of working together.",
    "auto": "Auto in autobiography showed that the writer told a story about the self.",
    "morph": "Morph in metamorphosis helped explain how the caterpillar changed shape.",
    "graph": "Graph in autograph connected writing with a person's signature.",
    "pater": "Pater in paternal helped the class connect the word with father.",
    "mater": "Mater in maternal helped the class connect the word with mother.",
    "frat": "Frat in fraternal helped the class connect the word with brotherhood.",
    "gen": "Gen in generate pointed toward birth, origin, or producing something new.",
    "tact": "Her tact kept the peer review honest without hurting anyone's feelings.",
    "son": "Son in sonorous helped the choir describe a rich sound.",
    "corp": "Corp in corporation reminded the class of a body of people acting together.",
    "man": "Man in manual helped the class remember work done by hand.",
    "ad": "Ad in advance suggested movement toward the front.",
    "ante": "Ante in antecedent helped the grammar group spot the word that came before.",
    "il": "Il in illegal showed the negative meaning of not lawful.",
    "intro": "Intro in introduce suggested leading something inward or into view.",
    "peri": "Peri in perimeter helped the geometry group trace around the shape.",
    "re": "Re in reread reminded Noah to read the paragraph again.",
}


def clean(value: str) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    return value.replace(" ,", ",").replace(" .", ".")


def extract_entries(pdf_path: Path) -> list[dict[str, str | int]]:
    reader = PdfReader(str(pdf_path))
    entries: list[dict[str, str | int]] = []

    for page in reader.pages:
        fragments: list[tuple[float, float, str]] = []

        def visitor(text: str, _cm, tm, _font_dict, _font_size) -> None:
            text = clean(text)
            if text:
                fragments.append((round(float(tm[5]), 1), round(float(tm[4]), 1), text))

        page.extract_text(visitor_text=visitor)

        lines: dict[float, list[tuple[float, str]]] = {}
        for y, x, text in fragments:
            if text in {"HSPT vocabulary", "Page", "of"} or y < 40:
                continue
            lines.setdefault(y, []).append((x, text))

        current: dict[str, str | int] | None = None
        for y in sorted(lines, reverse=True):
            parts = sorted(lines[y])
            number = next((text for x, text in parts if x < 35 and re.fullmatch(r"\d+", text)), None)
            word = next((text for x, text in parts if 35 <= x < 125 and re.fullmatch(r"[A-Za-z][A-Za-z'-]*", text)), None)
            definition = clean(" ".join(text for x, text in parts if x >= 120))

            if number and word:
                current = {"number": int(number), "word": word, "definition": definition}
                entries.append(current)
            elif current and definition:
                current["definition"] = clean(f"{current['definition']} {definition}")

    entries.sort(key=lambda entry: int(entry["number"]))
    cleaned = [entry for entry in entries if int(entry["number"]) < min(TAIL_ENTRIES)]
    for number, (word, definition) in TAIL_ENTRIES.items():
        cleaned.append({"number": number, "word": word, "definition": definition})
    return cleaned


def meaning_clues(definition: str) -> list[str]:
    pieces = [
        clean(piece)
        for piece in re.split(r";|, or | OR |\\bOR\\b", definition)
        if clean(piece)
    ]
    if not pieces:
        pieces = [definition]
    compact: list[str] = []
    for piece in pieces:
        piece = re.sub(r"^\([^)]*\)\s*", "", piece)
        piece = clean(piece.rstrip("."))
        if piece and piece not in compact:
            compact.append(piece)
    return compact[:3] or [definition]


def article(word: str) -> str:
    return "an" if word[:1].lower() in "aeiou" else "a"


def example_for(word: str, definition: str, index: int) -> str:
    lower = word.lower()
    context = CONTEXTS[index % len(CONTEXTS)]
    meaning = meaning_clues(definition)[0].lower()

    if lower in SPECIAL_EXAMPLES:
        return SPECIAL_EXAMPLES[lower]
    if lower in ROOT_EXAMPLES:
        return ROOT_EXAMPLES[lower]

    rules = [
        (("less", "decrease", "subside"), f"After the storm began to {lower}, the team moved practice back onto the field."),
        (("assist", "encourage"), f"The witness refused to {lower} the prank, even when friends begged for help."),
        (("humiliation", "submissive"), f"His {lower} apology showed how badly the mistake had shaken his confidence."),
        (("reject", "disavow"), f"In the debate, Lena chose to {lower} the rumor instead of quietly accepting it."),
        (("dwell", "address"), f"The old farmhouse became their {lower} while the family repaired their city apartment."),
        (("secretly", "hide"), f"The thief tried to {lower} through the back alley before anyone noticed the missing laptop."),
        (("self-indulgent", "eating", "drinking"), f"His {lower} habits helped him ignore the dessert table until after the race."),
        (("yield", "agree"), f"The club president decided to {lower} to the committee's request for a later vote."),
        (("concurrence", "agreement"), f"The judges reached an {lower} after reviewing the final round scores."),
        (("sharp", "taste", "smell"), f"The {lower} smell of vinegar drifted through the science lab."),
        (("fear", "phobia"), f"Because of her {lower}, Maya avoided the glass elevator at the museum."),
        (("height", "highest"), f"The climbers paused at the {lower} of the trail to look over the valley."),
        (("friendly", "warmth"), f"An {lower} host greeted every new student by name."),
        (("attack", "assail"), f"The editorial did not merely disagree with the plan; it tried to {lower} every detail."),
        (("pain", "relief"), f"A cold cloth helped {lower} the runner's sore ankle after the meet."),
        (("opposite",), f"The quiet library was the {lower} of the noisy cafeteria."),
        (("hidden storage",), f"The hikers found a {lower} of dry matches under a loose stone."),
        (("loud confusing", "outcry"), f"A {lower} rose from the crowd when the final goal was waved off."),
        (("honest", "straightforward", "frank"), f"Her {lower} answer made the team trust the schedule she proposed."),
        (("surrender",), f"After three failed attempts, the chess player had to {lower}."),
        (("secret", "covert"), f"The students planned a {lower} birthday surprise in the art room."),
        (("persuasive",), f"His {lower} explanation convinced the principal to extend the fundraiser."),
        (("carefully", "deeply"), f"Before answering, Nora took a minute to {lower} the trick question."),
        (("comfort", "emotional"), f"The counselor tried to {lower} the student after the disappointing audition."),
        (("awareness of danger",), f"The sudden alarm filled the hallway with {lower}."),
        (("large in number", "large in the amount", "large in quantity"), f"The garden produced a {lower} supply of tomatoes after the long rain."),
        (("genuine", "imitating"), f"The museum guide spotted the {lower} coin before it reached the display case."),
        (("credibility",), f"The candidate gained {lower} by admitting the mistake before anyone asked."),
        (("criticize", "scold"), f"The coach did not {lower} the goalie; she showed him how to reset."),
        (("make clear", "clarify"), f"The diagram helped {lower} the confusing instructions."),
        (("knowledge", "understanding"), f"Students grew {lower} of the deadline after the reminder appeared online."),
        (("informal", "conversation"), f"The essay sounded too {lower} until she revised the slang."),
        (("begin", "start"), f"The ceremony will {lower} as soon as the musicians take their seats."),
        (("defeat",), f"Marcus had to {lower} after the evidence proved his first answer wrong."),
        (("happen simultaneously",), f"The two school events will {lower} unless one club changes its date."),
        (("trust", "confidence"), f"Jada chose to {lower} in her teacher about the missing notes."),
        (("call forth", "bring to mind"), f"The song could {lower} memories of summer camp with only a few notes."),
        (("physical", "material"), f"The sculpture gave a {lower} form to an idea the class had only discussed."),
        (("origin", "universe"), f"The lesson on {lower} made the night sky feel much older."),
    ]

    definition_lower = definition.lower()
    for keys, sentence in rules:
        if any(key in definition_lower for key in keys):
            return sentence

    if definition_lower.startswith(("to ", "make ", "become ", "provide ", "prevent ", "avoid ", "exchange ", "scold ", "attack ", "agree ")):
        return f"The {context} leader had to {lower} when the situation called for {meaning}."
    if definition_lower.startswith(("a ", "an ", "the ")) or "person who" in definition_lower or "quality" in definition_lower or "trait" in definition_lower:
        return f"The article used {lower} for {article(meaning)} {meaning}."
    if "having" in definition_lower or "showing" in definition_lower or "marked by" in definition_lower or definition_lower.startswith(("very ", "not ", "kind ", "remote ", "carefree ")):
        return f"The {lower} response stood out during the {context} because it showed {meaning}."
    return f"The {context} notes used {lower} to describe {meaning}."


def validate(entries: list[dict[str, object]]) -> None:
    numbers = [int(entry["number"]) for entry in entries]
    expected = list(range(1, max(numbers) + 1))
    if numbers != expected:
        raise RuntimeError("PDF entries are not a complete numbered sequence.")

    for entry in entries:
        word = str(entry["word"]).lower()
        example = str(entry["example"]).lower()
        if not str(entry.get("definition", "")).strip():
            raise RuntimeError(f"Missing definition: {entry['word']}")
        if word not in example:
            raise RuntimeError(f"Example does not contain target word: {entry['word']}")
        if any(filler.lower() in example for filler in FILLER_SENTENCES):
            raise RuntimeError(f"Generic example remained: {entry['word']}")
        if " to discuss:" in example or "described ." in example:
            raise RuntimeError(f"Weak generated example remained: {entry['word']}")


def build(pdf_path: Path) -> list[dict[str, object]]:
    raw_entries = extract_entries(pdf_path)
    built: list[dict[str, object]] = []
    for index, entry in enumerate(raw_entries):
        definition = clean(DEFINITION_OVERRIDES.get(int(entry["number"]), str(entry["definition"])))
        set_number = PDF_SET_START + index // 20
        built.append(
            {
                "source": "HSPT PDF",
                "set": set_number,
                "number": int(entry["number"]),
                "word": str(entry["word"]).capitalize(),
                "partOfSpeech": "term",
                "synonyms": meaning_clues(definition),
                "definition": definition,
                "example": example_for(str(entry["word"]), definition, index),
            }
        )
    validate(built)
    return built


def main() -> None:
    if len(sys.argv) != 3:
        print("Usage: build-hspt-pdf-vocabulary.py /path/to/pdf output.js", file=sys.stderr)
        raise SystemExit(2)

    entries = build(Path(sys.argv[1]))
    output = Path(sys.argv[2])
    output.write_text(
        "window.HSPT_PDF_VOCABULARY_WORDS = "
        + json.dumps(entries, indent=2, ensure_ascii=True)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(entries)} HSPT PDF entries to {output}")


if __name__ == "__main__":
    main()
