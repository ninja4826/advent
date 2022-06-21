import { transforms } from 'advent-of-code-client';
import { breadth, HashFunc, NextFunc, TestFunc } from '../util/path_find';

export function part1(input: string[]): number | string {
    return battle(input);
}

export function part2(input: string[]): number | string {
    return battle(input, true);
}

function battle(input: string[], hardMode: boolean = false): number {
    const BOSS_DMG = +input[1].split(': ')[1];
    const spells: Spell[] = [
        { name: 'missile', cost: 53, damage: 4, heal: 0, armor: 0, mana: 0, duration: 0 },
        { name: 'drain', cost: 73, damage: 2, heal: 2, armor: 0, mana: 0, duration: 0 },
        { name: 'shield', cost: 113, damage: 0, heal: 0, armor: 7, mana: 0, duration: 6 },
        { name: 'poison', cost: 173, damage: 3, heal: 0, armor: 0, mana: 0, duration: 6 },
        { name: 'recharge', cost: 229, damage: 0, heal: 0, armor: 0, mana: 101, duration: 5 }
    ];

    const applyEffects = (s: State, bossTurn: boolean = false): void => {
        // let newSpells: Spell[] = [];
        let newSpells: { [key: string]: Spell } = {};
        for (let spellN in s.activeSpells) {
            let spell = s.activeSpells[spellN];
            s.bossHp -= spell.damage;
            s.mana += spell.mana;
            s.hp += spell.heal;

            if (spell.armor > 0 && bossTurn) {
                s.hp += 7;
            }
            if (spell.duration > 1) {
                spell.duration -= 1;
                newSpells[spell.name] = spell;
                // newSpells.push(spell);
            }
        }
        s.activeSpells = newSpells;
    };

    let states: State[] = [{ mana: 500, hp: 50, bossHp: +input[0].split(': ')[1], activeSpells: {}, spentMana: 0 }];
    let result = Number.MAX_SAFE_INTEGER;

    while (states.length > 0) {
        let s = <State>states.pop();
        if (hardMode) {
            s.hp -= 1;
        }
        if (s.hp <= 0) continue;

        applyEffects(s);
        if (s.bossHp <= 0) {
            result = Math.min(result, s.spentMana);
            continue;
        }

        for (let spell of spells) {
            if (spell.cost <= s.mana &&
                    s.spentMana + spell.cost < result &&
                    !(spell.name in s.activeSpells)) {
                let newS: State = {
                    mana: s.mana,
                    hp: s.hp,
                    bossHp: s.bossHp,
                    activeSpells: {},
                    spentMana: s.spentMana
                };
                for (let sp in s.activeSpells) {
                    newS.activeSpells[sp] = s.activeSpells[sp];
                }

                newS.mana -= spell.cost;
                newS.spentMana += spell.cost;
                newS.activeSpells[spell.name] = spell;
                applyEffects(newS, true);
                if (newS.bossHp <= 0) {
                    result = Math.min(result, newS.spentMana);
                    continue;
                }
                newS.hp -= BOSS_DMG;
                if (newS.hp > 0) {
                    states.push(newS);
                }
            }
        }
    }


    // return 0;
    return result;
}

// function battle2(input: string[]): number {
//     const BOSS_DMG: number = +input[1].split(': ')[1];
//     const spells: Spell[] = [
//         { name: 'missile', cost: 53, damage: 4, heal: 0, armor: 0, mana: 0, duration: 0 },
//         { name: 'drain', cost: 73, damage: 2, heal: 2, armor: 0, mana: 0, duration: 0 },
//         { name: 'shield', cost: 113, damage: 0, heal: 0, armor: 7, mana: 0, duration: 6 },
//         { name: 'poison', cost: 173, damage: 3, heal: 0, armor: 0, mana: 0, duration: 6 },
//         { name: 'recharge', cost: 229, damage: 0, heal: 0, armor: 0, mana: 101, duration: 5 }
//     ];

//     const applyEffects = (s: State2, bossTurn: boolean = false): State2 => {
//         for (let spell of s.activeSpells) {
//             s.bossHp -= spell.damage;
//             s.mana += spell.mana;
//             s.hp += spell.heal;
//             if (spell.armor > 0 && bossTurn) s.hp += 7;
//         }
//         s.activeSpells = s.activeSpells
//             .filter(spell => spell.duration > 1)
//             .map(spell => {
//                 spell.duration -= 1;
//                 return spell;
//             });
//         return s;
//     }

//     let start: State2 = {
//         mana: 500,
//         hp: 50,
//         bossHp: +input[0].split(': ')[1],
//         activeSpells: [],
//         spentMana: 0
//     };

//     let result = Number.MAX_SAFE_INTEGER;

//     let hashFunc: HashFunc<State2> = (s: State2): string => `${s.mana}:${s.hp}:${s.bossHp}:${s.activeSpells.map(s => s.name).join(',')}:${s.spentMana}`;
//     let testFunc: TestFunc<State2> = (s: State2): boolean => false;

//     let nextFunc: NextFunc<State2> = (s: State2): State2[] => {
//         if (s.hp <= 0) return [];

//         s = applyEffects(s);
//         if (s.bossHp <= 0) {
//             result = Math.min(result, s.spentMana);
//             return [];
//         }
//         let activeNames = s.activeSpells.map(spell => spell.name);

//         let states: State2[] = [];

//         for (let spell of spells) {
//             if (spell.cost <= s.mana &&
//                     s.spentMana + spell.cost < result &&
//                     !activeNames.includes(spell.name)) {
//                 console.log('trying '+spell.name);
//                 let newS: State2 = JSON.parse(JSON.stringify(s));
//                 newS.mana -= spell.cost;
//                 newS.spentMana += spell.cost;
//                 newS.activeSpells.push(spell);

//                 newS = applyEffects(newS, true);

//                 if (newS.bossHp <= 0) {
//                     result = Math.min(result, newS.spentMana);
//                     continue;
//                 }

//                 newS.hp -= BOSS_DMG;
//                 if (newS.hp > 0) {
//                     states.push(newS);
//                 }
//             }
//         }

//         return states;
//     };

//     let ret = breadth([ start ], hashFunc, testFunc, nextFunc);

//     if (ret.constructor.name === 'Set') {
//         return -1;
//     }
//     ret = <State2>ret;
    
//     return result;
// }

interface Spell {
    name: string;
    cost: number;
    damage: number;
    heal: number;
    armor: number;
    mana: number;
    duration: number;
}

interface State {
    mana: number;
    hp: number;
    bossHp: number;
    activeSpells: { [key: string]: Spell };
    spentMana: number;
}

interface State2 {
    mana: number;
    hp: number;
    bossHp: number;
    activeSpells: Spell[];
    spentMana: number;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`Hit Points: 13
Damage: 8`, `Hit Points: 14
Damage: 8`],
    part2: [``]
};

const testAnswers = {
    part1: [226, 641],
    part2: [0]
};

export { transform, testData, testAnswers };