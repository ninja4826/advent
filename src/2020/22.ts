export function part1(input: string[]): any {
    let isP2 = false;
    let p1: number[] = [];
    let p2: number[] = [];
    for (let i of input) {
        if (i == 'Player 1:') {
            isP2 = false;
            continue;
        }
        if (i == 'Player 2:') {
            isP2 = true;
            continue;
        }

        if (i == '') {
            continue;
        }

        if (isP2) {
            p2.push(parseInt(i));
        } else {
            p1.push(parseInt(i));
        }
    }

    let winDeck = findWinner(p1, p2);

    return winDeck.reverse().map((w, i) => w*(i+1)).reduce((p,c) => p+c, 0);
}

export function part2(input: string[]): any {
    let isP2 = false;
    let p1: number[] = [];
    let p2: number[] = [];
    for (let i of input) {
        if (i == 'Player 1:') {
            isP2 = false;
            continue;
        }
        if (i == 'Player 2:') {
            isP2 = true;
            continue;
        }

        if (i == '') {
            continue;
        }

        if (isP2) {
            p2.push(parseInt(i));
        } else {
            p1.push(parseInt(i));
        }
    }

    let [,winDeck] = findWinnerP2(p1, p2);

    return winDeck.reverse().map((w, i) => w*(i+1)).reduce((p,c) => p+c, 0);
}

function findWinner(p1: number[], p2: number[]): number[] {
    let players: { [key:string]: number[] } = {
        p1,
        p2
    };
    let i = 1;
    while (p1.length > 0 && p2.length > 0) {
        // console.log('Round '+i);
        // i++;
        // console.log(players);
        let card1 = players.p1.shift();
        let card2 = players.p2.shift();

        if (card1 == undefined || card2 == undefined) break;
        let winner = '';
        let stack: number[] = [];
        if (card1 > card2) {
            winner = 'p1';
            stack = [card1, card2];
        } else {
            winner = 'p2';
            stack = [card2, card1];
        }

        players[winner].push(...stack);
    }

    // console.log(players);
    if (players.p1.length > 0) return players.p1;
    if (players.p2.length > 0) return players.p2;
    return [];
}

function findWinnerP2(p1: number[], p2: number[], d = 0): [string, number[]] {
    let players: { [key: string]: number[] } = {
        p1: p1.slice(0),
        p2: p2.slice(0)
    };

    let prevRounds: string[] = [];

    let i = 1;
    while (players.p1.length > 0 && players.p2.length > 0) {
        console.log(`Round ${i} (Game ${d+1})`);
        i++;
        console.log(players);
        let roundStr = JSON.stringify(players);
        if (prevRounds.includes(roundStr)) {
            return ['p1', players.p1];
        }
        prevRounds.push(roundStr);

        let card1 = players.p1.shift();
        let card2 = players.p2.shift();

        if (card1 == undefined || card2 == undefined) break;

        let winner = '';
        let stack: number[] = [];
        if (players.p1.length >= card1 && players.p1.length >= card2) {
            [winner,] = findWinnerP2(players.p1, players.p2, d+1);
        } else {
            if (card1 > card2) {
                winner = 'p1';
            } else {
                winner = 'p2';
            }
        }

        if (winner == 'p1') {
            stack = [card1, card2];
        } else {
            stack = [card2, card1];
        }

        players[winner].push(...stack);
    }

    if (players.p1.length > 0) return ['p1', players.p1];
    if (players.p2.length > 0) return ['p2', players.p2];
    return ['', []];
}