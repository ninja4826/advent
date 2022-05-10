export function part1(input: string[]): any {
    let cardPub = parseInt(input[0]);
    let doorPub = parseInt(input[1]);

    let cardLoop = 1;

    while (true) {
        if (Math.pow(7, cardLoop) % 20201227 == cardPub) {
            break;
        }
        cardLoop++;
    }

    let doorLoop = 1;

    while (true) {
        if (Math.pow(7, doorLoop) % 20201227 == doorPub) {
            break;
        }
        doorLoop++;
    }

    return Math.pow(cardPub, doorLoop), 20201227;
}

export function part2(input: string[]): any {
    
}

function mod(a: number, b: number): number {
    return ((a%b)+b) % b;
}