import re
from dataclasses import dataclass, field, replace
from enum import Enum
from itertools import chain
from operator import attrgetter
from typing import Dict, FrozenSet, Iterable, Mapping, Optional, Sequence, Set, Tuple

_parse_group = re.compile(
    r'(?P<units>\d+) units each with '
    r'(?P<hit_points>\d+) hit points '
    r'(?:\('
        r'(?P<modifiers>(?:(?:weak|immune) to (?:[^;)]+)(?:; )?)+)'
    r'\) )?'
    r'with an attack that does '
    r'(?P<attack_damage>\d+) (?P<attack_type>\w+) damage '
    r'at initiative (?P<initiative>\d+)'
).search
_parse_modifiers = re.compile(r'(?P<type>weak|immune) to (?P<attack_types>[^;]+)').finditer

@dataclass(unsafe_hash=True)
class Group:
    # per-unit attributes
    hit_points: int
    attack_damage: int
    attack_type: str
    initiative: int
    weaknesses: FrozenSet[str]
    immunities: FrozenSet[str]

    # only mutated attribute
    units: int = field(hash=False)

    @classmethod
    def from_line(cls, line: str) -> 'Group':
        match = _parse_group(line)
        assert match is not None
        kwargs = match.groupdict()
        modifiers = kwargs.pop('modifiers') or ''
        by_type = {'weak': set(), 'immune': set()}
        for match in _parse_modifiers(modifiers):
            by_type[match['type']].update(map(str.strip, match['attack_types'].split(',')))
        kwargs['weaknesses'] = frozenset(by_type['weak'])
        kwargs['immunities'] = frozenset(by_type['immune'])
        for attr, type_ in cls.__annotations__.items():
            if attr not in {'weaknesses', 'immunities'}:
                kwargs[attr] = type_(kwargs[attr])
        return cls(**kwargs)

    @property
    def effective_power(self) -> int:
        return self.units * self.attack_damage
    
    def potential_damage(self, attacker: 'Group') -> int:
        modifier = 1
        if attacker.attack_type in self.weaknesses:
            modifier = 2
        elif attacker.attack_type in self.immunities:
            modifier = 0
        return modifier * attacker.effective_power
    
    def select_target(self, targets: Iterable['Group']) -> Optional['Group']:
        available = sorted((
            (target.potential_damage(self), target.effective_power, target.initiative, target)
            for target in targets
        ), reverse=True)
        return next((target for damage, *_, target in available if damage), None)

@dataclass(frozen=True)
class Army:
    name: str
    groups: Set[Group] = field(hash=False)
        
    @classmethod
    def from_lines(cls, name: str, lines: Iterable[str]) -> 'Army':
        groups = []
        for line in lines:
            if not line.strip():
                break
            groups.append(Group.from_line(line))
        return cls(name, groups)
    
    def boost(self, amount: int) -> 'Army':
        if self.name != 'Immune System':
            amount = 0
        return type(self)(self.name, {replace(g, attack_damage=g.attack_damage + amount) for g in self.groups})
    
    @property
    def units(self) -> int:
        return sum(g.units for g in self.groups)
    
    def select_targets(self, enemy: 'Army') -> Iterable[Tuple[Group, Group]]:
        available = set(enemy.groups)
        sort_key = attrgetter('effective_power', 'initiative')
        for group in sorted(self.groups, key=sort_key, reverse=True):
            selected = group.select_target(available)
            if selected is None:
                continue
            available.remove(selected)
            yield group, selected
    
    def __len__(self) -> int:
        return len(self.groups)
    
class StaleMate(Exception):
    """Neither army can attack anymore"""

class ImmuneSystemSimulator:
    def __init__(self, armies: Sequence[Army]) -> None:
        self.armies = armies
    
    @classmethod
    def from_lines(cls, lines: Iterable[str]) -> 'ImmuneSystemSimulator':
        armies = []
        it = iter(lines)
        for line in it:
            if line.strip().endswith(':'):
                armies.append(Army.from_lines(line.strip().rstrip(':'), it))
        return cls(armies)
    
    def boost(self, amount: int) -> 'ImmuneSystemSimulator':
        return type(self)([a.boost(amount) for a in self.armies])

    def fight(self) -> None:
        # selection phase
        # attacking group, defending group, defending army
        selections: List[Tuple[Group, Group, Army]] = []
        for army in self.armies:
            other = next(a for a in self.armies if a is not army)
            selections += (
                (attacker, selected, other.groups)
                for attacker, selected in army.select_targets(other)
            )
        
        if not selections:
            raise StaleMate
        # attacking phase
        sort_key = lambda ai: ai[0].initiative
        changed = False
        for attacker, defender, groupset in sorted(selections, key=sort_key, reverse=True):
            if attacker.units <= 0 or defender.units <= 0:
                # attacker or defender is dead
                continue
            before = defender.units
            defender.units -= defender.potential_damage(attacker) // defender.hit_points
            if defender.units <= 0:
                groupset.remove(defender)
            if defender.units < before:
                changed = True
        if not changed:
            # stalemate, no-one has enough effective power remaining
            raise StaleMate
    
    @property
    def units(self) -> Mapping[str, int]:
        return {a.name: a.units for a in self.armies}
    
    def combat(self) -> None:        
        while all(self.armies):
            self.fight()

import aocd

data = aocd.get_data(day=24, year=2018)

simulation = ImmuneSystemSimulator.from_lines(data.splitlines())
simulation.combat()
print(simulation.armies)
print('Part 1:', next(filter(None, simulation.units.values())))

from itertools import count
simulation = ImmuneSystemSimulator.from_lines(data.splitlines())
for boost in count(1):
    boosted = simulation.boost(boost)
    try:
        boosted.combat()
    except StaleMate:
        continue
    if boosted.units['Immune System']:
        print('Part 2:', boosted.units['Immune System'])
        break