import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';
import { v4 as uuid } from 'uuid';

export function part1(input: string[]): number | string {
    BattleGroup.parse(input);

    while (!BattleGroup.winner) {
        let attacks = BattleGroup.findTargets();
        // console.log(attacks);
        BattleGroup.attack(attacks);
    }
    return BattleGroup.battleGroups.reduce((p, c) => p + c.units, 0);
}

export function part2(input: string[]): number | string {
    BattleGroup.parse(input);
    // console.log(BattleGroup.battleGroups);
    let orig = BattleGroup.battleGroups.slice(0);
    let i = 0;
    while (true) {
        BattleGroup.battleGroups = orig.slice(0);
        for (let j = 0; j < BattleGroup.battleGroups.length; j++) {
            if (BattleGroup.battleGroups[j].team === Team.Immune) {
                BattleGroup.battleGroups[j].attack += i;
            }
        }
        if (i === 2) console.log(BattleGroup.battleGroups);
        while (!BattleGroup.winner) {
            let attacks = BattleGroup.findTargets();
            // console.log(attacks);
            BattleGroup.attack(attacks);
        }
        console.log(i);
        // if (i === 2) console.log(BattleGroup.battleGroups);
        if (BattleGroup.battleGroups[0].team === Team.Immune) break;
        i++;
    }
    // console.log(BattleGroup.battleGroups);
    
    return BattleGroup.battleGroups.reduce((p, c) => p + c.units, 0);
}

interface PBattleGroup {
    team: Team;
    units: number;
    hp: number;
    immunities: string[];
    weaknesses: string[];
    attack: number;
    damageType: string;
    initiative: number;
}

interface IBattleGroup extends PBattleGroup {
    id: string;
}

enum Team {
    Immune,
    Infection
}

class BattleGroup implements IBattleGroup {
    static battleGroups: BattleGroup[];

    static parse(data: string[]): void {
        const weaknessParser = (str: string): [string[], string[]] => {
            let immunities: string[] = [];
            let weaknesses: string[] = [];

            if (str.length === 0) return [immunities, weaknesses];

            let strArr = str.split('; ');

            for (let s of strArr) {
                let type = s.split(' ')[0];
                let entStr = s.split(' ').slice(2).join(' ');
                let ents = entStr.split(', ');

                for (let e of ents) {
                    if (type === 'weak') {
                        weaknesses.push(e);
                    } else {
                        immunities.push(e);
                    }
                }
            }

            return [immunities, weaknesses];
        };

        let reg = /(?<units>\d+) units each with (?<hp>\d+) hit points \(?(?<weakStr>[\w\s;,]*)\)?\s?with an attack that does (?<attack>\d+) (?<damageType>\w+) damage at initiative (?<init>\d+)/;
        let team: Team = Team.Immune;
        let bgs: BattleGroup[] = [];
        for (let line of data) {
            if (line.length === 0) continue;
            
            if (line[0] === 'I') {
                if (line[1] === 'm') {
                    team = Team.Immune;
                } else {
                    team = Team.Infection;
                }
            } else {
                let match = matcher(line, reg);
                if (match.index === -1) continue;
                let m = match.groups;
                let units = parseInt(m.units);
                let hp = parseInt(m.hp);
                let [ immunities, weaknesses ] = weaknessParser(m.weakStr);
                let attack = parseInt(m.attack);
                let damageType = m.damageType;
                let initiative = parseInt(m.init);

                let bg = {
                    team,
                    units,
                    hp,
                    immunities,
                    weaknesses,
                    attack,
                    damageType,
                    initiative
                };

                bgs.push(new BattleGroup(bg));
            }
        }

        this.battleGroups = bgs;
    }

    static findTargets(): [BattleGroup, BattleGroup][] {
        let attackers = this.battleGroups.slice(0).sort((a, b) => {
            let effPower = b.power - a.power;
            if (effPower !== 0) return effPower;
            return b.initiative - a.initiative;
        });

        let immune = this.battleGroups.slice(0).filter(b => b.team === Team.Immune);
        let infect = this.battleGroups.slice(0).filter(b => b.team === Team.Infection);

        let immuneDefenders = immune.slice(0);
        let infectDefenders = infect.slice(0);
         
        let attacks: string[] = [];

        let canAttack = (str: string): boolean => attacks.map(s => s.split(':')).every(a => a[1] !== str);
        for (let bg of attackers) {
            if (bg.team === Team.Immune) {
                if (infectDefenders.length === 0) continue;
                infectDefenders.sort((a, b) => {
                    let damage = bg.damageAgainst(b) - bg.damageAgainst(a);
                    if (damage !== 0) return damage;
                    let effPower = b.power - a.power;
                    if (effPower !== 0) return effPower;
                    return b.initiative - a.initiative;
                });
                let defender = <BattleGroup>infectDefenders.shift();
                if (!canAttack(defender.id)) {
                    throw `This defender shouldn't be in the list: ${defender.id}`;
                }

                attacks.push(`${bg.id}:${defender.id}`);
            } else {
                if (immuneDefenders.length === 0) continue;
                immuneDefenders.sort((a, b) => {
                    let damage = bg.damageAgainst(b) - bg.damageAgainst(a);
                    if (damage !== 0) return damage;
                    let effPower = b.power - a.power;
                    if (effPower !== 0) return effPower;
                    return b.initiative - a.initiative;
                });
                let defender = <BattleGroup>immuneDefenders.shift();
                if (!canAttack(defender.id)) {
                    throw `This defender shouldn't be in the list: ${defender.id}`;
                }

                attacks.push(`${bg.id}:${defender.id}`);
            }
        }

        let bgAttacks: [BattleGroup, BattleGroup][] = [];

        for (let a of attacks) {
            let [ aID, dID ] = a.split(':');
            let attacker = <BattleGroup>this.battleGroups.find(bg => bg.id === aID);
            let defender = <BattleGroup>this.battleGroups.find(bg => bg.id === dID);
            bgAttacks.push([attacker, defender]);
        }
        bgAttacks.sort((a, b) => b[0].initiative - a[0].initiative);
        return bgAttacks;
    }

    static attack(attacks: [BattleGroup, BattleGroup][]): void {
        for (let [a, _d] of attacks) {
            let dID = this.battleGroups.findIndex(b => b.id === _d.id);
            let d = this.battleGroups[dID];
            let killed = 0;
            [ d, killed ]= a.fight(d);
            // console.log(killed);
            this.battleGroups[dID] = d;
        }

        for (let i = 0; i < this.battleGroups.length; i++) {
            if (this.battleGroups[i].units <= 0) {
                this.battleGroups.splice(i, 1);
            }
        }
    }

    static get winner(): boolean {
        return this.battleGroups.every(b => b.team === Team.Immune) || 
            this.battleGroups.every(b => b.team === Team.Infection);
    }

    id: string;
    team: Team;
    units: number;
    hp: number;
    immunities: string[];
    weaknesses: string[];
    attack: number;
    damageType: string;
    initiative: number;

    constructor(bg: PBattleGroup) {
        this.id = uuid();
        this.team = bg.team;
        this.units = bg.units;
        this.hp = bg.hp;
        this.weaknesses = bg.weaknesses;
        this.immunities = bg.immunities;
        this.attack = bg.attack;
        this.damageType = bg.damageType;
        this.initiative = bg.initiative;
    }

    get power(): number {
        return this.units * this.attack;
    }

    damageAgainst(bg: BattleGroup): number {
        if (bg.immunities.includes(this.damageType)) return 0;

        let damage = this.power;
        if (bg.weaknesses.includes(this.damageType)) {
            damage *= 2;
        }
        return damage;
    }

    fight(bg: BattleGroup): [BattleGroup, number] {
        let damage = this.damageAgainst(bg);
        // let killedUnits = Math.floor(damage / bg.hp);
        // let killedUnits = ~~(damage / bg.hp);
        let killedUnits = (damage - (damage % bg.hp)) / bg.hp;
        bg.units -= killedUnits
        return [bg, killedUnits];
    }
}

const transform = transforms.lines;

const testData = {
    part1: [`Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };