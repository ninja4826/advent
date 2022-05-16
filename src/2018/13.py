import re
from sys import stdin
from dataclasses import dataclass, field
from enum import Enum
from itertools import count
from typing import Optional, Sequence, Set, Tuple

class Direction(Enum):
    up = '^', -1, 0, 'left', 'right'
    down = 'v', 1, 0, 'right', 'left'
    left = '<', 0, -1, 'down', 'up'
    right = '>', 0, 1, 'up', 'down'
    
    def __new__(cls, char: str, dy: int, dx: int, left: str, right: str) -> None:
        instance = object.__new__(cls)
        instance._value_ = char
        instance.dy = dy
        instance.dx = dx
        instance._turns = {'left': left, 'right': right}
        return instance
    
    def make_turn(self, move: 'Move') -> 'Direction':
        turn = self._turns.get(move.name, self.name)
        return type(self)[turn]

class Move(Enum):
    left = 0
    straight = 1
    right = 2
    
    @property
    def next(self) -> 'Move':
        enum = type(self)
        return enum((self.value + 1) % len(enum))

@dataclass(frozen=True, order=True)
class Cart:
    # order matters here; y must be compared before x
    y: int
    x: int
    direction: Direction = field(compare=False)
    last_intersection_move: Move = field(
        default=Move.right, compare=False)
    id: int = field(default_factory=count().__next__, compare=False)

    @property
    def pos(self) -> Tuple[int, int]:
        return self.y, self.x
    
    @property
    def next_pos(self) -> Tuple[int, int]:
        return (self.y + self.direction.dy, self.x + self.direction.dx)
    
    def move(self, next_map_char: str) -> 'Cart':
        y, x = self.next_pos
        direction = self.direction
        last_move = self.last_intersection_move
        if next_map_char == '+':
            last_move = last_move.next
            direction = direction.make_turn(last_move)
        elif next_map_char == '\\':
            if direction in (Direction.up, Direction.down):
                turn = Move.left
            else:
                turn = Move.right
            direction = direction.make_turn(turn)
        elif next_map_char == '/':
            if direction in (Direction.up, Direction.down):
                turn = Move.right
            else:
                turn = Move.left
            direction = direction.make_turn(turn)
        return type(self)(y, x, direction, last_move, id=self.id)

class Tracks:
    def __init__(self, trackmap: Sequence[str], carts: Set[Cart]):
        self.trackmap = trackmap
        self.start_state = self.carts = carts
    
    @classmethod
    def from_raw_map(cls, map: str):
        lines = map.splitlines()
        cleaned = []
        carts = set()
        for y, line in enumerate(lines):
            for m in re.finditer(r'[<^>v]', line):
                direction = Direction(m[0])
                x = m.start()
                if direction.name in ('up', 'down'):
                    section = '|'
                else:
                    section = '-'
                line = f"{line[:x]}{section}{line[x + 1:]}"
                carts.add(Cart(y, x, direction))
            cleaned.append(line)
        return cls(cleaned, carts)

    def reset(self):
        self.carts = self.start_state
        
    def __str__(self):
        lines = [list(l) for l in self.trackmap]
        for cart in self.carts:
            lines[cart.y][cart.x] = cart.direction.value
        return '\n'.join([''.join(l) for l in lines])
    
    def step(self, remove_collided: bool = False) -> Optional[Tuple[int, int]]:
        new_state = set(self.carts)
        for cart in sorted(self.carts):
            try:
                new_state.remove(cart)
            except KeyError:
                # cart was removed due to a collision
                continue
            ny, nx = cart.next_pos
            cart = cart.move(self.trackmap[ny][nx])
            if cart in new_state:
                # collision!
                if not remove_collided:
                    return cart.pos
                new_state.remove(cart)
                continue
            new_state.add(cart)
        self.carts = new_state
    
    def run_carts(self, remove_collided: bool = False) -> Tuple[int, int]:
        while True:
            pos = self.step(remove_collided)
            if pos is not None:
                self.reset()
                return pos[::-1]
            if len(self.carts) == 1:
                # last cart standing
                cart, = self.carts
                self.reset()
                return cart.pos[::-1]
text_file = open("./inputs/13.txt", "r")

data = text_file.read()

text_file.close()

tracks = Tracks.from_raw_map(data)

print('Part 1:', ','.join(map(str, tracks.run_carts())))
print('Part 2:', ','.join(map(str, tracks.run_carts(True))))