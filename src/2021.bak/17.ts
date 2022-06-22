export function part1(input: string[]): any {
    let data = parseData(input[0]);
    let val = calculateHighestYTrajectory(data);
    return val.max_h;
}

export function part2(input: string[]): any {
    let data = parseData(input[0]);
    let val = calculateHighestYTrajectory(data);
    return val.vel_count;
}

function parseData(data: string): IData {
    let ret = /target area: x=(?<x0>[-\w]+)..(?<x1>[-\w]+), y=(?<y0>[-\w]+)..(?<y1>[-\w]+)/.exec(data);
    if (ret && ret.groups) {
        let data = {
            x0: parseInt(ret.groups.x0),
            x1: parseInt(ret.groups.x1),
            y0: parseInt(ret.groups.y0),
            y1: parseInt(ret.groups.y1)
        };
        return data;
    }
    throw new Error('ugh');
}

function calculateHighestYTrajectory2(data: IData, vx: number, vy: number): number {
    let maxY = -Number.MAX_SAFE_INTEGER ;

    let x = 0;
    let y = 0;

    while (true) {
        x += vx;
        if (vx < 0) {
            vx++;
        } else if (vx > 0) {
            vx--;
        }

        y += vy;

        vy--;

        if (y > maxY) {
            maxY = y;
        }

        if (x >= data.x0 && x <= data.x1 && y >= data.y0 && y <= data.y1) {
            return maxY;
        }

        if (x > data.x1 || y < data.y0) {
            return -Number.MAX_SAFE_INTEGER;
        }
    }
}

function calculateHighestYTrajectory(data: IData): RetTraj {
    let maxY = -Number.MAX_SAFE_INTEGER;
    let vel_count = 0;
    let x_range = Math.abs(data.x1);
    let y_range = Math.abs(data.y0);

    for (let vx = -x_range; vx <= x_range; ++vx) {
        for (let vy = -y_range; vy <= y_range; ++vy) {
            let y = calculateHighestYTrajectory2(data, vx, vy);
            if (y > maxY) {
                maxY = y;
            }

            if (y !== -Number.MAX_SAFE_INTEGER) {
                vel_count++;
            }
        }
    }

    return { max_h: maxY, vel_count: vel_count };
}

interface RetTraj {
    max_h: number;
    vel_count: number;
}

interface IData {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
}