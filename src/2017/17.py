from collections import deque

def spin(insertions):
    spinlock = deque([0])

    for i in range(1, insertions+1):
        spinlock.rotate(-puzzle)
        spinlock.append(i)
    return spinlock

puzzle = 343
first_spin = spin(2017)
second_spin = spin(50_000_000)

print(first_spin[0])
print(second_spin[second_spin.index(0) + 1])