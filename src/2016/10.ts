import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar, range, zip } from '../util';

export function part1(input: string[]): number | string {
    const bots: Map<number, IBot> = new Map();
    //    inputs: [bot id, value ][]
    const inputs: [number, number][] = [];

    for (let inp of input) {
        if (inp.slice(0, 1) == 'b') {
            let reg = /bot (\d+) gives low to (\w+) (\d+) and high to (\w+) (\d+)/;
            let match = matcher(inp, reg);

            let bot: IBot = {
                id: +match[1],
                low: {
                    target: {
                        type: match[2] == 'bot' ? Recv.Bot : Recv.Bin,
                        id: +match[3]
                    }
                },
                high: {
                    target: {
                        type: match[4] == 'bot' ? Recv.Bot : Recv.Bin,
                        id: +match[5]
                    }
                }
            };
            if (bots.has(+match[1])) throw 'ughhhhhh';
            Bot.bots.set(+match[1], new Bot(bot));
        } else {
            let reg = /value (\d+) goes to bot (\d+)/;
            let match = matcher(inp, reg);

            inputs.push([+match[2], +match[1]]);
        }
    }

    for (let inp of inputs) {
        let bot = <Bot>Bot.bots.get(inp[0]);
        bot.giveValue(inp[1]);
        Bot.bots.set(inp[0], bot);
    }

    const lowVal = 17;
    const highVal = 61;

    for (let [id, bot] of Bot.bots) {
        if (bot.low.value == lowVal && bot.high.value == highVal) return bot.id; 
    }
    return -1;
}

export function part2(input: string[]): number | string {
    const bots: Map<number, IBot> = new Map();
    //    inputs: [bot id, value ][]
    const inputs: [number, number][] = [];

    for (let inp of input) {
        if (inp.slice(0, 1) == 'b') {
            let reg = /bot (\d+) gives low to (\w+) (\d+) and high to (\w+) (\d+)/;
            let match = matcher(inp, reg);

            let bot: IBot = {
                id: +match[1],
                low: {
                    target: {
                        type: match[2] == 'bot' ? Recv.Bot : Recv.Bin,
                        id: +match[3]
                    }
                },
                high: {
                    target: {
                        type: match[4] == 'bot' ? Recv.Bot : Recv.Bin,
                        id: +match[5]
                    }
                }
            };
            if (bots.has(+match[1])) throw 'ughhhhhh';
            Bot.bots.set(+match[1], new Bot(bot));
        } else {
            let reg = /value (\d+) goes to bot (\d+)/;
            let match = matcher(inp, reg);

            inputs.push([+match[2], +match[1]]);
        }
    }

    for (let inp of inputs) {
        let bot = <Bot>Bot.bots.get(inp[0]);
        bot.giveValue(inp[1]);
        Bot.bots.set(inp[0], bot);
    }

    let out = 1;
    for (let r of range([0, 3])) {
        out *= (<number[]>Bot.outputs.get(r))[0];
    }
    // console.log([...Bot.outputs.entries()].map(e => e[1][0]).reduce((p, c) => p*c, 1));
    return out;
}

enum Recv {
    Bot,
    Bin
}

interface OutputTarget {
    type: Recv;
    id: number;
}

interface Output {
    target: OutputTarget;
    value?: number;
}

interface IBot {
    id: number;
    high: Output;
    low: Output;
}

class Bot implements IBot {
    static bots: Map<number, Bot> = new Map();
    static outputs: Map<number, number[]> = new Map();

    id: number;
    high: Output;
    low: Output;

    values: number[] = [];

    constructor(bot: IBot) {
        this.id = bot.id;
        this.high = bot.high;
        this.low = bot.low;
    }

    giveValue(val: number): void {
        this.values.push(val);

        if (this.values.length === 2) {
            this.values.sort((a, b) => a - b);
            this.low.value = this.values[0];
            this.high.value = this.values[1];

            if (this.low.target.type == Recv.Bot) {
                let lowBot = <Bot>Bot.bots.get(this.low.target.id);
                lowBot.giveValue(this.low.value);
                Bot.bots.set(this.low.target.id, lowBot);
            } else {
                let outputs = Bot.outputs.get(this.low.target.id);
                if (outputs === undefined) {
                    outputs = [];
                }
                outputs.push(this.low.value);
                Bot.outputs.set(this.low.target.id, outputs);
            }

            if (this.high.target.type == Recv.Bot) {
                let highBot = <Bot>Bot.bots.get(this.high.target.id);
                highBot.giveValue(this.high.value);
                Bot.bots.set(this.high.target.id, highBot);
            } else {
                let outputs = Bot.outputs.get(this.high.target.id);
                if (outputs === undefined) {
                    outputs = [];
                }
                outputs.push(this.high.value);
                Bot.outputs.set(this.high.target.id, outputs);
            }
        }
    }
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };