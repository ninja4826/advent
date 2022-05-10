export function part1(input: string[]): any {
    let reg = /(\w)(\d+)/;
    let posNS = 0;
    let posEW = 0;
    let dir: Direction = Direction.E;
    for (let s of input) {
        let match = matcher(reg, s);

        let cmd = match[1];
        let num = parseInt(match[2], 10);

        switch (cmd) {
            case 'L':
                dir = getDirectionP1(num, dir, false);
                break;
            case 'R':
                dir = getDirectionP1(num, dir, true);
                break;
            case 'F':
                switch (dir) {
                    case Direction.E:
                        posEW += num;
                        break;
                    case Direction.S:
                        posNS -= num;
                        break;
                    case Direction.W:
                        posEW -= num;
                        break;
                    case Direction.N:
                        posNS += num;
                        break;
                }
                break;
            case 'N':
                posNS += num;
                break;
            case 'W':
                posEW -= num;
                break;
            case 'S':
                posNS -= num;
                break;
            case 'E':
                posEW += num;
                break;
        }
    }

    return Math.abs(posNS) + Math.abs(posEW);
}

export function part2(input: string[]): any {
    let reg = /(\w)(\d+)/;
    let waypoint: Point = {
        x: 10,
        y: 1
    };

    let rotateWaypoint = (deg: number, rightTurn: boolean) => {
        let turns = deg / 90;
        turns = turns % 4;

        if (!rightTurn) {
            turns = 4 - turns;
        }

        for (let i = 0; i < turns; i++) {
            let x = waypoint.x;
            let y = waypoint.y;
            waypoint.x = y;
            waypoint.y = x * -1;
        }
    };

    let pos: Point = {
        x: 0,
        y: 0
    };

    for (let s of input) {
        let match = matcher(reg, s);

        let cmd = match[1];
        let num = parseInt(match[2], 10);

        switch (cmd) {
            case 'L':
                rotateWaypoint(num, false);
                break;
            case 'R':
                rotateWaypoint(num, true);
                break;
            case 'F':
                for (let i = 0; i < num; i++) {
                    pos.x += waypoint.x;
                    pos.y += waypoint.y;
                }
                break;
            case 'N':
                waypoint.y += num;
                break;
            case 'W':
                waypoint.x -= num;
                break;
            case 'S':
                waypoint.y -= num;
                break;
            case 'E':
                waypoint.x += num;
                break;
        }

        // console.log('waypoint:', waypoint);
        // console.log('pos:', pos);
    }

    return Math.abs(pos.x) + Math.abs(pos.y);
}

interface Point {
    x: number;
    y: number;
}

enum Direction {
    N = 'N',
    W = 'W',
    E = 'E',
    S = 'S'
};

function getDirectionP1(deg: number, currDir: Direction, rightTurn: boolean): Direction {
    let turns = deg / 90;
    turns = turns % 4;
    if (!rightTurn) {
        turns = 4 - turns;
    }
    let currRot: Direction[] = [Direction.E, Direction.S, Direction.W, Direction.N];

    let rotate = () => {
        let first = currRot.shift();
        if (!first) return;
        currRot.push(first);
    }

    while (currRot[0] !== currDir) {
        rotate();
    }

    for (let i = 0; i < turns; i++) {
        rotate();
    }
    return currRot[0];
}

function matcher(reg: RegExp, str: string): RegExpMatchArray {
    let match = reg.exec(str);
    if (!match) throw new Error('invalid regex match');
    return match;
}