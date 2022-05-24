from collections import defaultdict
from operator import lt, gt, le, ge, eq, ne

with open("inputs/8.txt") as f:
    instructions = f.readlines()

registers = defaultdict(int)
operators = {
    '<': lt,
    '>': gt,
    '==': eq,
    '!=': ne,
    '<=': le,
    '>=': ge
}

maximum = 0

for line in instructions:
    register, instruction, amount, _, cond_reg, operator, value = line.split()
    direction = 1 if instruction == 'inc' else -1
    if operators[operator](registers[cond_reg], int(value)):
        registers[register] += direction * int(amount)
        maximum = max(registers[register], maximum)

print(max(registers.values()))
print(maximum)