from dataclasses import dataclass, field
from enum import Enum
from heapq import heappush, heappop
from itertools import count
from operator import attrgetter
from typing import Iterable, Iterator, Mapping, Optional, Sequence, Set, Tuple
import aocd

Position = Tuple[int, int]  # y, x order

class NoTargetsRemaining(Exception):
    """No more targets to attack"""

class NoTargetsReachable(Exception):
    """No path found that reaches a target"""

class ElfDied(Exception):
    """We lost, because an elf died"""

class Race(Enum):
    elf = 'E'
    goblin = 'G' 

@dataclass(order=True)
class Unit:
    race: Race = field(compare=False)
    y: int
    x: int
    hitpoints: int = field(default=200, compare=False)
    attackpower: int = field(default=3, compare=False)

    @property
    def pos(self) -> Position:
        return self.y, self.x
    
    def adjacent(self, cave: 'CaveCombat') -> Set[Position]:
        """All cave positions adjacent to the current position"""
        positions = (
            (self.y + dy, self.x + dx)
            for dy, dx in ((-1, 0), (0, -1), (0, 1), (1, 0))
        )
        return {(y, x) for y, x in positions if cave.map[y][x] == '.'}

    def available(self, cave: 'CaveCombat') -> Set[Position]:
        """All positions this unit could move to"""
        return {pos for pos in self.adjacent(cave) if cave[pos] is None}

    def turn(self, cave: 'CaveCombat') -> None:
        # find targets to go after
        targets = [u for u in cave.units if u.race is not self.race]
        if not targets:
            # end combat
            raise NoTargetsRemaining

        # determine if we need to move
        adjacent = self.adjacent(cave)
        in_range = [
            u for pos in adjacent for u in (cave[pos],)
            if u and u.race is not self.race
        ]
        
        # we need to move, make a move if possible
        if not in_range:
            # find a target to move to
            target_positions = set().union(*(t.available(cave) for t in targets))
            if not target_positions:
                # no positions to move to, turn ends
                return
        
            # pick a shortest path to one of the positions, returns our new position
            try:
                self.y, self.x = cave.search_path(self.pos, target_positions)
            except NoTargetsReachable:
                pass
            
            # check for in-range targets once more now that we have moved
            adjacent = self.adjacent(cave)
            in_range = [
                u for pos in adjacent for u in (cave[pos],)
                if u and u.race is not self.race
            ]

        # attack if in range of a target
        if in_range:
            # pick target with lowest hitpoints; ties broken by reading order
            target = min(in_range, key=attrgetter('hitpoints', 'y', 'x'))
            target.hitpoints -= self.attackpower
            if target.hitpoints <= 0:
                # target died, remove them from the cave
                cave.units.remove(target)
                if cave.no_elf_dies and target.race is Race.elf:
                    raise ElfDied
            return
        
_sentinel_first_pos: Position = (-1, -1)

@dataclass(frozen=True, order=True)
class Node:
    """Node on the A* search graph"""
    y: int
    x: int
    distance: int = 0
    # position of first actual transition node. Needed to distinguish
    # between multiple possible paths to the same goal, and this is
    # used to set the new unit position once a path has been picked.
    first_pos: Position = _sentinel_first_pos
        
    @property
    def pos(self) -> Position:
        return self.y, self.x
        
    def cost(self, goals: Set[Position]) -> int:
        """Calculate the cost for this node, f(n) = g(n) + h(n)
        
        The cost of this node is the distance travelled (g) plus
        estimated cost to get to nearest goal (h).
        
        Here we use the manhattan distance to the nearest goal as
        the estimated cost.
        
        """
        distances = (abs(y - self.y) + abs(x - self.x) for y, x in goals)
        return self.distance + min(distances)
    
    def transitions(self, cave: 'CaveCombat') -> Iterator['Node']:
        cls = type(self)
        positions = (
            (self.y + dy, self.x + dx)
            for dy, dx in ((-1, 0), (0, -1), (0, 1), (1, 0))
        )
        return (
            cls(
                y, x, self.distance + 1,
                (y, x) if self.first_pos == _sentinel_first_pos else self.first_pos,
            )
            for y, x in positions
            if cave.map[y][x] == '.' and cave[(y, x)] is None
        )

@dataclass
class CaveCombat:
    map: Sequence[str]
    units: Sequence[Unit]
    round: int = 0
    no_elf_dies: bool = False
        
    def __post_init__(self):
        # internal cache of unit positions, updated before each unit turn
        self._unit_positions: Mapping = {}
    
    @classmethod
    def from_lines(cls, lines: Iterable[str], elf_attackpower: int = 3) -> 'CaveCombat':
        map = []
        units = []
        unit_chars = ''.join(r.value for r in Race)
        for y, line in enumerate(lines):
            cleaned = []
            for x, c in enumerate(line):
                if c in unit_chars:
                    attackpower = elf_attackpower if c == 'E' else 3
                    units.append(Unit(Race(c), y, x, attackpower=attackpower))
                    c = '.'
                cleaned.append(c)
            map.append(''.join(cleaned))
        return cls(map, units)

    def __str__(self) -> str:
        map = [list(l) for l in self.map]
        for unit in self.units:
            map[unit.y][unit.x] = unit.race.value
        return '\n'.join([''.join(l) for l in map])

    def __getitem__(self, yx: Position) -> Optional[Unit]:
        if self._unit_positions:
            return self._unit_positions.get(yx)
        return next((u for u in self.units if u.pos == yx), None)
    
    def do_battle(self) -> int:
        while True:
            result = self.turn()
            if result is not None:
                return result

    def turn(self) -> Optional[int]:
        for unit in sorted(self.units):
            # skip units that are dead; these are still in the sorted
            # loop iterable but have been removed from self.units
            if unit.hitpoints <= 0:
                continue
                
            # cache unit positions once per round
            self._unit_positions = {u.pos: u for u in self.units}
            
            try:
                unit.turn(self)
            except NoTargetsRemaining:
                return self.round * sum(u.hitpoints for u in self.units)

        self.round += 1
        return None
    
    def search_path(self, start: Position, goals: Set[Position]) -> Position:
        start_node = Node(*start)
        open = {start_node}
        unique = count()  # tie breaker when costs are equal
        pqueue = [(start_node.cost(goals), start_node.first_pos, next(unique), start_node)]
        closed = set()
        distances = {start_node.pos: 0}  # pos -> distance. Ignore nodes that are longer.
        while open:
            node = heappop(pqueue)[-1]

            if node.pos in goals:
                return node.first_pos

            open.remove(node)
            closed.add(node)
            for new in node.transitions(self):
                if new in closed or new in open:
                    continue
                if distances.get(new.pos, float('inf')) < new.distance:
                    # already reached this point with a shorter path
                    continue
                open.add(new)
                distances[new.pos] = new.distance
                heappush(pqueue, (new.cost(goals), new.first_pos, next(unique), new))
                
        raise NoTargetsReachable

movetest = CaveCombat.from_lines('''\
#########
#G..G..G#
#.......#
#.......#
#G..E..G#
#.......#
#.......#
#G..G..G#
#########'''.splitlines())
outputs = (
    '#########\n#G..G..G#\n#.......#\n#.......#\n#G..E..G#\n#.......#\n#.......#\n#G..G..G#\n#########',
    '#########\n#.G...G.#\n#...G...#\n#...E..G#\n#.G.....#\n#.......#\n#G..G..G#\n#.......#\n#########',
    '#########\n#..G.G..#\n#...G...#\n#.G.E.G.#\n#.......#\n#G..G..G#\n#.......#\n#.......#\n#########',
    '#########\n#.......#\n#..GGG..#\n#..GEG..#\n#G..G...#\n#......G#\n#.......#\n#.......#\n#########'
)
for expected in outputs:
    assert str(movetest) == expected
    movetest.turn()

combattest = CaveCombat.from_lines('''\
#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######'''.splitlines())
rounds = (
    (0, '#######\n#.G...#\n#...EG#\n#.#.#G#\n#..G#E#\n#.....#\n#######', ('G', 200), ('E', 200), ('G', 200), ('G', 200), ('G', 200), ('E', 200)),
    (1, '#######\n#..G..#\n#...EG#\n#.#G#G#\n#...#E#\n#.....#\n#######', ('G', 200), ('E', 197), ('G', 197), ('G', 200), ('G', 197), ('E', 197)),
    (2, '#######\n#...G.#\n#..GEG#\n#.#.#G#\n#...#E#\n#.....#\n#######', ('G', 200), ('G', 200), ('E', 188), ('G', 194), ('G', 194), ('E', 194)),
    (23, '#######\n#...G.#\n#..G.G#\n#.#.#G#\n#...#E#\n#.....#\n#######', ('G', 200), ('G', 200), ('G', 131), ('G', 131), ('E', 131)),
    (24, '#######\n#..G..#\n#...G.#\n#.#G#G#\n#...#E#\n#.....#\n#######', ('G', 200), ('G', 131), ('G', 200), ('G', 128), ('E', 128)),
    (25, '#######\n#.G...#\n#..G..#\n#.#.#G#\n#..G#E#\n#.....#\n#######', ('G', 200), ('G', 131), ('G', 125), ('G', 200), ('E', 125)),
    (26, '#######\n#G....#\n#.G...#\n#.#.#G#\n#...#E#\n#..G..#\n#######', ('G', 200), ('G', 131), ('G', 122), ('E', 122), ('G', 200)),
    (27, '#######\n#G....#\n#.G...#\n#.#.#G#\n#...#E#\n#...G.#\n#######', ('G', 200), ('G', 131), ('G', 119), ('E', 119), ('G', 200)),
    (28, '#######\n#G....#\n#.G...#\n#.#.#G#\n#...#E#\n#....G#\n#######', ('G', 200), ('G', 131), ('G', 116), ('E', 113), ('G', 200)),
    (47, '#######\n#G....#\n#.G...#\n#.#.#G#\n#...#.#\n#....G#\n#######', ('G', 200), ('G', 131), ('G', 59), ('G', 200)),
)
for round, expected, *units in rounds:
    while combattest.round != round:
        combattest.turn()
    assert str(combattest) == expected
    assert [(u.race.value, u.hitpoints) for u in sorted(combattest.units)] == units

assert combattest.turn() == 27730

tests = (
    (
        '#######\n#G..#E#\n#E#E.E#\n#G.##.#\n#...#E#\n#...E.#\n#######',
        '#######\n#...#E#\n#E#...#\n#.E##.#\n#E..#E#\n#.....#\n#######',
        36334
    ),
    (
        '#######\n#E..EG#\n#.#G.E#\n#E.##E#\n#G..#.#\n#..E#.#\n#######',
        '#######\n#.E.E.#\n#.#E..#\n#E.##.#\n#.E.#.#\n#...#.#\n#######',
        39514
    ),
    (
        '#######\n#E.G#.#\n#.#G..#\n#G.#.G#\n#G..#.#\n#...E.#\n#######',
        '#######\n#G.G#.#\n#.#G..#\n#..#..#\n#...#G#\n#...G.#\n#######',
        27755
    ),
    (
        '#######\n#.E...#\n#.#..G#\n#.###.#\n#E#G#G#\n#...#G#\n#######',
        '#######\n#.....#\n#.#G..#\n#.###.#\n#.#.#.#\n#G.G#G#\n#######',
        28944
    ),
    (
        '#########\n#G......#\n#.E.#...#\n#..##..G#\n#...##..#\n#...#...#\n#.G...G.#\n#.....G.#\n#########',
        '#########\n#.G.....#\n#G.G#...#\n#.G##...#\n#...##..#\n#.G.#...#\n#.......#\n#.......#\n#########',
        18740
    ),
)
for start, end, expected in tests:
    testcave = CaveCombat.from_lines(start.splitlines())
    assert testcave.do_battle() == expected
    assert str(testcave) == end

data = aocd.get_data(day=15, year=2018)

cave = CaveCombat.from_lines(data.splitlines())
print('Part 1:', cave.do_battle())

import math

def optimise_strength(cavelines: Iterable[str], verbose=False) -> int:
    log = print if verbose else lambda *a, **k: None
    elves = sum(l.count('E') for l in cavelines)
    goblins = sum(l.count('G') for l in cavelines)
    
    # worst case, highest strength required
    avga = (12 * max(0, goblins - 4) + 3 * (min(4, goblins) * (min(4, goblins) + 1)) // 2) / goblins
    high = min(200, math.ceil(200*goblins / (200 // avga)))
    
    # best case, lowest strength required
    minr = math.ceil(200 * elves / ((3 * math.ceil(elves / 4)) / elves))
    low = max(3, math.ceil((200 * goblins) / minr))
    
    last_high_outcome = 0
    log(f'Optimising, strength between {low} and {high}')
               
    while low < high:
        mid = (high - low) // 2 + low
        log(f'\n - Trying strength {mid}')
        cave = CaveCombat.from_lines(cavelines, mid)
        cave.no_elf_dies = True
        try:
            outcome = cave.do_battle()
        except ElfDied:
            # not high enough
            log(f'   - Too low, an elf died')
            low = mid
        else:
            log(f'   - Elves victorious')
            high = mid
            last_high_outcome = outcome

        # See if high is one step above low, that's our sweet spot
        if high == low + 1:
            return last_high_outcome
    assert False, f"wrong low or high starting points"

optimise_tests = (
    ('#######\n#.G...#\n#...EG#\n#.#.#G#\n#..G#E#\n#.....#\n#######', 4988),
    ('#######\n#E..EG#\n#.#G.E#\n#E.##E#\n#G..#.#\n#..E#.#\n#######', 31284),
    ('#######\n#E.G#.#\n#.#G..#\n#G.#.G#\n#G..#.#\n#...E.#\n#######', 3478),
    ('#######\n#.E...#\n#.#..G#\n#.###.#\n#E#G#G#\n#...#G#\n#######', 6474),
    ('#########\n#G......#\n#.E.#...#\n#..##..G#\n#...##..#\n#...#...#\n#.G...G.#\n#.....G.#\n#########', 1140),
)
for lines, expected in optimise_tests:
    assert optimise_strength(lines.splitlines()) == expected

print('Part 2:', optimise_strength(data.splitlines()))