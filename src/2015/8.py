data = open('./inputs/8.txt', 'r').read().splitlines()

print(sum(len(line) - len(eval(line)) for line in data))
print(sum(line.count(r'"') + line.count('\\') + 2 for line in data))