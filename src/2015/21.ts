import { transforms } from 'advent-of-code-client';
import { permutator, range } from '../util';

export function part1(input: string[]): number | string {
    return solve2(input)[0];
}

type Item = [number, number, number];

export function part2(input: string[]): number | string {
    return solve2(input)[1];
}

function solve2(input: string[]): [number, number] {
    const opp: Player = new Player( +input[0].split(': ')[1],
                                   +input[1].split(': ')[1],
                                   +input[2].split(': ')[1]);

    const weapons: Item[] = [
        [0, 0, 0],
        [8, 4, 0],
        [10, 5, 0],
        [25, 6, 0],
        [40, 7, 0],
        [74, 8, 0]
    ];

    const armor: Item[] = [
        [0, 0, 0],
        [13, 0, 1],
        [31, 0, 2],
        [53, 0, 3],
        [75, 0, 4],
        [102, 0, 5]
    ];

    const rings: Item[] = [
        [0, 0, 0],
        [25, 1, 0],
        [50, 2, 0],
        [100, 3, 0],
        [20, 0, 1],
        [40, 0, 2],
        [80, 0, 3]
    ];

    const calcScore = (w: Item, a: Item, r1: Item, r2: Item): [number, number, number] => {
        let cost = w[0] + a[0] + r1[0] + r2[0];
        let attack = w[1] + a[1] + r1[1] + r2[1];
        let defense = w[2] + a[2] + r1[2] + r2[2];
        return [cost, attack, defense];
    };

    const weaponFilter = (perm: number[]): boolean => perm[0] !== 0;

    const ringFilter = (perm: number[]): boolean => 
        perm[0] !== perm[1] || (perm[0] === 0 && perm[1] === 0);

    const perms = [...permutator([...range(6)], { maxLen: 2, repeat: true, filter: weaponFilter })];
    const ringPerms = [...permutator([...range(7)], { maxLen: 2, repeat: true, filter: ringFilter })];
    
    const player = new Player(100);

    let minCost = Number.MAX_SAFE_INTEGER;
    let maxCost = 0;

    for (let [wIdx, aIdx] of perms) {
        let [w, a] = [weapons[wIdx], armor[aIdx]];
        for (let [r1Idx, r2Idx] of ringPerms) {
            let [r1, r2] = [rings[r1Idx], rings[r2Idx]];

            let [cost, att, deff] = calcScore(w, a, r1, r2);
            player.att = att;
            player.deff = deff;

            if (player.fight(opp)) {
                minCost = Math.min(cost, minCost);
            } else {
                maxCost = Math.max(cost, maxCost);
            }
        }
    }

    return [minCost, maxCost];
}

class Player {
    hp: number;
    att: number;
    deff: number;

    constructor(hp: number, att: number = 0, deff: number = 0) {
        this.hp = hp;
        this.att = att;
        this.deff = deff;
    }

    clone(): Player {
        return new Player(this.hp, this.att, this.deff);
    }

    fight(_p: Player, debug: boolean = false): boolean {
        let p = _p.clone();
        let that = this.clone();
        while (true) {
            // if (p.deff < that.att) {
            //     p.hp -= that.att - p.deff;
            // } else {
            //     p.hp -= 1;
            // }
            p.hp -= Math.max(that.att - p.deff, 1);
            if (debug) {
                console.log(`The player deals ${that.att}-${p.deff} = ${that.att - p.deff} damage; the boss goes down to ${p.hp} hit points.`);
            }

            if (p.hp <= 0) return true;

            // if (that.deff < p.att) {
            //     that.hp -= p.att - that.deff;
            // } else {
            //     that.hp -= 1;
            // }
            that.hp -= Math.max(p.att - that.deff);

            if (debug) {
                console.log(`The boss deals ${p.att}-${that.deff} = ${p.att - that.deff} damage; the player goes down to ${that.hp} hit points.`);
            }

            if (that.hp <= 0) return false;
        }
    }
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`Hit Points: 12
Damage: 7
Armor: 2`],
    part2: [``]
};

const testAnswers = {
    part1: [0],
    part2: [0]
};

export { transform, testData, testAnswers };