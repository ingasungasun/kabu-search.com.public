#!/usr/bin/env python

import re
import zipfile

import bs4

import edinet.taxonomy_thesaurus
import edinet.xbrl.report.calculator
from edinet.errors import TaxonomyError

CONSOLIDATED_PATTERN = re.compile("^CurrentYear(Instant|Duration)$")
NON_CONSOLIDATED_PATTERN = re.compile(
    "^CurrentYear(Instant|Duration)_NonConsolidatedMember$"
)
UNIT_REFS_TO_BE_IGNORED = ["USD", "USDPerShares"]

THESAURUSES = [
    edinet.taxonomy_thesaurus.IFRS,
    edinet.taxonomy_thesaurus.USGAAP,
    edinet.taxonomy_thesaurus.JGAAP,
]

TITLES_FOR_IDENTIFICATION = [
    "OperatingCashFlow",
    "InvestingCashFlow",
    "FinancingCashFlow",
]

TITLES_NON_CONSOLIDATED_ONLY = [
    "DividendPaidPerShare",
    "PayoutRatio",
    "IssuedShares",
]

type Tags = dict[str, dict[str, str]]
type Thesaurus = dict[str, list[str]]
type Items = dict[str, int | float]


def select_tags_from_beautifulsoup(soup: bs4.BeautifulSoup) -> Tags:
    consolidated = {}
    non_consolidated = {}

    for tag in soup.find_all(attrs={"contextRef": CONSOLIDATED_PATTERN}):
        name = tag.name
        value = tag.string
        unit_ref = tag.get("unitRef")

        if unit_ref is not None and unit_ref in UNIT_REFS_TO_BE_IGNORED:
            continue

        if isinstance(value, str):
            if re.search(r"^-?\d+$", value):
                consolidated[name] = int(value)
            elif re.search(r"^-?(\d+)?\.\d+$", value):
                consolidated[name] = float(value)

    for tag in soup.find_all(attrs={"contextRef": NON_CONSOLIDATED_PATTERN}):
        name = tag.name
        value = tag.string
        unit_ref = tag.get("unitRef")

        if unit_ref is not None and unit_ref in UNIT_REFS_TO_BE_IGNORED:
            continue

        if isinstance(value, str):
            if re.search(r"^-?\d+$", value):
                non_consolidated[name] = int(value)
            elif re.search(r"^-?(\d+)?\.\d+$", value):
                non_consolidated[name] = float(value)

    return {
        "consolidated": consolidated,
        "non_consolidated": non_consolidated,
    }


def decide_on_thesaurus(tags: Tags) -> Thesaurus:
    for thesaurus in THESAURUSES:
        for title in TITLES_FOR_IDENTIFICATION:
            for variant in thesaurus[title]:
                if (
                    variant in tags["consolidated"]
                    or variant in tags["non_consolidated"]
                ):
                    return thesaurus
    else:
        raise TaxonomyError("Unable to determine taxonomy.")


def check_whether_consolidated(tags: Tags):
    for thesaurus in THESAURUSES:
        for title in TITLES_FOR_IDENTIFICATION:
            for variant in thesaurus[title]:
                if variant in tags["consolidated"]:
                    return True
    else:
        return False


def decide_on_standard(thesaurus: Thesaurus):
    match thesaurus:
        case edinet.taxonomy_thesaurus.IFRS:
            standard = "IFRS"

        case edinet.taxonomy_thesaurus.USGAAP:
            standard = "USGAAP"

        case edinet.taxonomy_thesaurus.JGAAP:
            standard = "JGAAP"

        case _:
            raise TaxonomyError("Invalid value of variable 'thesaurus'.")

    return standard


def select_suitable_items_from_tags(
    tags: Tags, thesaurus: Thesaurus, is_consolidated: bool
) -> Items:
    items = {}

    for title, variants in thesaurus.items():
        if not is_consolidated or title in TITLES_NON_CONSOLIDATED_ONLY:
            tags_to_use = tags["non_consolidated"]
        else:
            tags_to_use = tags["consolidated"]

        for variant in variants:
            if variant in tags_to_use:
                items[title] = tags_to_use[variant]
                break

    return items


def normalize_items(items: Items):
    normalized_items = {}

    for name, fn in edinet.xbrl.report.calculator.name_to_function.items():
        if callable(fn):
            normalized_items[name] = fn(items)
        else:
            normalized_items[name] = items.get(name)

    return normalized_items


def analyze(xbrl_file: zipfile.ZipExtFile):
    soup = bs4.BeautifulSoup(xbrl_file.read(), features="xml", from_encoding="utf-8")
    tags = select_tags_from_beautifulsoup(soup)
    thesaurus = decide_on_thesaurus(tags)
    is_consolidated = check_whether_consolidated(tags)
    standard = decide_on_standard(thesaurus)
    items = select_suitable_items_from_tags(tags, thesaurus, is_consolidated)
    report = normalize_items(items)

    return {
        "report": report,
        "standard": standard,
        "is_consolidated": is_consolidated,
    }
