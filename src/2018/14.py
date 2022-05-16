from typing import Optional, List

_start = "37101012451589167792"

def chocolate_chart(recipes: int, start: str = _start, elf1: int = 8, elf2: int = 4) -> str:
    chart = list(map(int, start))
    # we need the next 10 results
    target = recipes + 10
    while len(chart) < target:
        score1, score2 = chart[elf1], chart[elf2]
        chart += map(int, str(score1 + score2))
        elf1, elf2 = (elf1 + score1 + 1) % len(chart), (elf2 + score2 + 1) % len(chart)
    
    # we could have produced 11 new recipes past the recipe count?
    return ''.join(map(str, chart[recipes:recipes + 10]))

# no actual work done, just asserting the start chart value correct
assert chocolate_chart(9) == '5158916779'
assert chocolate_chart(5) == '0124515891'

# actually re-create the work
assert chocolate_chart(9, '37', 0, 1) == '5158916779'
assert chocolate_chart(5, '37', 0, 1) == '0124515891'

# extrapolating from the chart
assert chocolate_chart(18) == '9251071085'
assert chocolate_chart(2018) == '5941429882'

print('Part 1:', chocolate_chart(293801))

def chocolate_chart_substring(target: str) -> int:
    chart: List[int] = [3, 7]
    elf1: int = 0
    elf2: int = 1
    matched: int = 0
    while True:
        score1, score2 = chart[elf1], chart[elf2]
        new_score = str(score1 + score2)
        for d in new_score:
            if target[matched] == d:
                matched += 1
            else:
                # no match, start at 0, but do check for a new match
                matched = 1 if target[0] == d else 0
            chart.append(int(d))
            if matched == len(target):
                return len(chart) - len(target)
        elf1, elf2 = (elf1 + score1 + 1) % len(chart), (elf2 + score2 + 1) % len(chart)

tests = {
    '51589': 9,
    '01245': 5,
    '92510': 18,
    '59414': 2018,
}
for target, expected in tests.items():
    assert chocolate_chart_substring(target) == expected, f"{target} != {expected}"

print('Part 2:', chocolate_chart_substring('293801'))