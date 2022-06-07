from collections import deque

def make_hash(gens, chips, lift, *args):
    g = [gens.count(str(i)) for i in range(4)]
    c = [chips.count(str(i)) for i in range(4)]
    return ''.join(map(str, g+c)) + str(lift)

def is_invalid(gens, chips, lift, *args):
    if lift not in range(4):
        return True
    for generator, chip in zip(gens, chips):
        if chip != generator and any(gen == chip for gen in gens):
            return True
    return False

def is_solved(positions):
    return all(pos == 3 for pos in positions)

def get_gcls(positions, l, s):
    g = ''.join(map(str, positions[: len(positions) // 2]))
    c = ''.join(map(str, positions[len(positions) // 2:]))
    # if c == '10' and l == 0 and s == 6:
        # print(g, positions)
    # print('gcls:', (g, c, l, s))
    return g, c, l, s

def calculate_steps(gens, chips, lift, steps):
    seen = set()
    que = deque([(gens, chips, lift, steps)])
    k = 0
    while que:
        # print(que)
        *state, steps = que.popleft()
        hash_ = make_hash(*state)
        # print(state)
        # if k > 3:
            # return 0
        k += 1
        # print(hash_)
        if hash_ in seen or is_invalid(*state):
            continue

        seen.add(hash_)

        positions = list(map(int, ''.join(state[:-1])))
        # print(positions)
        lift = state[-1]

        if is_solved(positions):
            return steps
        
        # print(positions, lift)

        for i, first in enumerate(positions):
            if first == lift:
                # print('i', i, first)
                if lift < 3:
                    positions[i] += 1
                    que.append(get_gcls(positions, lift + 1, steps + 1))
                    positions[i] -= 1
                if lift > 0:
                    positions[i] -= 1
                    que.append(get_gcls(positions, lift - 1, steps + 1))
                    positions[i] += 1
                for j, second in enumerate(positions[i+1:], i+1):
                    if second == lift:
                        # print('j', i, first, j, second)
                        if lift < 3:
                            positions[i] += 1
                            positions[j] += 1
                            que.append(get_gcls(positions, lift + 1, steps + 1))
                            positions[i] -= 1
                            positions[j] -= 1
                        if lift > 0:
                            positions[i] -= 1
                            positions[j] -= 1
                            que.append(get_gcls(positions, lift - 1, steps + 1))
                            positions[i] += 1
                            positions[j] += 1

# first_solution = calculate_steps(gens='12', chips='00', lift=0, steps=0)
first_solution = calculate_steps(gens='00111', chips='00211', lift=0, steps=0)
second_solution = calculate_steps(gens='0011100', chips='0021100', lift=0, steps=0)

print(first_solution)
print(second_solution)