const _ = require('underscore');
const assert = require('assert');

export function part1(input: string[]): any {
    let data = parseData(input);
    let res = calculateGameResultForPart1(data);
    return res;
}

export function part2(input: string[]): any {
    let data = parseData(input);
    let res = calculateGameResultForPart2(data);
    return res;
}

function parseData(data: string[]): IPlayer[] {
    let players: IPlayer[] = [];
    data.forEach((line) => {
        let _player = /Player (?<player_id>\d+) starting position: (?<starting_position>\d+)/.exec(line);
        if (!_player || !_player.groups) {
            return;
        }
        const player = _player.groups;
        players.push({
            player_id: parseInt(player.player_id, 10),
            position: parseInt(player.starting_position, 10),
            score: 0
        });
    });
    return players;
}

function calculateGameResultForPart1(data: IPlayer[]): number {
    let d = 1;
    let result = 0;
    while (true) {
        for (let player of data) {
            let d1 = d++;
            let d2 = d++;
            let d3 = d++;

            player.position = (player.position - 1 + d1 + d2 + d3) % 10 + 1;
            player.score += player.position;
            if (player.score >= 1000) {
                d--;
                break;
            }
        }

        const bestPlayer: IPlayer = _.max(data, (p: IPlayer) => p.score) as IPlayer;
        if (bestPlayer.score >= 1000) {
            const otherPlayer = _.filter(data, (p: IPlayer) => {
                return p.player_id !== bestPlayer.player_id;
            });
            result = otherPlayer[0].score * d;
            break;
        }
    }
    return result;
}

let dice3_product: number[][] = [];
for (let i = 1; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
        for (let k = 1; k < 4; k++) {
            dice3_product.push([i, j, k]);
        }
    }
}

function calculateNumberOfTurnsPart2(position1: number, position2: number, score1: number, score2: number, cache: { [key: string]: number[] }): number[] {
    let stack: IStack[] = [];

    stack.push({
        p1: position1,
        p2: position2,
        s1: score1,
        s2: score2,
        wins1: 0,
        wins2: 0,
        k: 0
    });

    while (stack.length !== 0) {
        let g = stack.pop();
        if (!g) {
            // // console.log('uh oh');
            break;
        }
        if (g.next_turn) {
            let nt = cache[g.next_turn];
            // // // console.log(g);
            // // // console.log(JSON.stringify(cache, null, 2));
            g.wins1 += nt[1];
            g.wins2 += nt[0];
        }

        let descent = false;
        for (; g.k < dice3_product.length; ++g.k) {
            let n = dice3_product[g.k];
            let new_pos1 = (g.p1 - 1 + (n[0] + n[1] + n[2])) % 10 + 1;
            let news_core1 = g.s1 + new_pos1;
            if (news_core1 >= 21) {
                g.wins1++;
            } else {
                let ck: string = `${g.p2}_${new_pos1}_${g.s2}_${news_core1}`;
                if (ck in cache) {
                    g.wins1 += cache[ck][1];
                    g.wins2 += cache[ck][0];
                } else {
                    let next_turn = {
                        p1: g.p2,
                        p2: new_pos1,
                        s1: g.s2,
                        s2: news_core1,
                        wins1: 0,
                        wins2: 0,
                        k: 0
                    };
                    g.next_turn = ck;
                    g.k++;
                    stack.push(g);
                    stack.push(next_turn);
                    descent = true;
                    break;
                }
            }
        }

        if (descent) continue;
        let ck = `${g.p1}_${g.p2}_${g.s1}_${g.s2}`;
        assert(!(ck in cache));
        // // // console.log(JSON.stringify(cache, null, 2));
        cache[ck] = [g.wins1, g.wins2];
    }
    return cache[`${position1}_${position2}_${score1}_${score2}`];
}

function calculateGameResultForPart2(data: IPlayer[]): number {
    let results = calculateNumberOfTurnsPart2(data[0].position, data[1].position, 0, 0, {});
    return Math.max(results[0], results[1]);
}

interface IStack {
    p1: number;
    p2: number;
    s1: number;
    s2: number;
    wins1: number;
    wins2: number;
    k: number;
    next_turn?: string;
}

interface IPlayer {
    player_id: number;
    position: number;
    score: number;
}