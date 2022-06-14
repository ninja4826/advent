export class Assembunny {
    registers: Map<string, number> = new Map();
    instructions: string[];

    constructor(inst: string[]) {
        this.instructions = inst.slice(0);

        for (let inp of inst) {
            let split = inp.split(' ').slice(1);
            for (let s of split) {
                if (isNaN(Number(s))) {
                    this.registers.set(s, 0);
                }
            }
        }
    }

    run(): void {
        console.log(this.instructions.length);
runner: for (let i = 0; i < this.instructions.length; i++) {
            const inp = this.instructions[i];
            // console.log(`${i}: ${inp}`);
            let split: (string | number)[] = inp.split(' ').map(j => isNaN(Number(j)) ? j : Number(j));

            switch (split[0]) {
                case 'cpy':
                    if (typeof split[2] != 'string') {
                        continue runner;
                    }
                    if (typeof split[1] == 'string') {
                        this.registers.set(<string>split[2], <number>this.registers.get(split[1]));
                    } else {
                        this.registers.set(<string>split[2], split[1]);
                    }
                    break;
                case 'inc':
                    if (typeof split[1] != 'string') {
                        continue runner;
                    }
                    this.registers.set(<string>split[1], <number>this.registers.get(<string>split[1]) + 1);
                    break;
                case 'dec':
                    if (typeof split[1] != 'string') {
                        continue runner;
                    }
                    this.registers.set(<string>split[1], <number>this.registers.get(<string>split[1]) - 1);
                    break;
                case 'jnz':
                    if (<number>this.registers.get(<string>split[1]) !== 0) {
                        i += (<number>split[2]) - 1;
                    }
                    break;
                case 'tgl':
                    // let oldSplit: string[];
                    let offset = 0;
                    if (typeof split[1] == 'string') {
                        offset = i + <number>this.registers.get(<string>split[1]);
                    } else {
                        offset = i + <number>split[1];
                    }
                    if (offset < 0 || offset >= this.instructions.length) {
                        continue runner;
                    }

                    // console.log(offset);
                    // console.log(this.instructions.length);

                    let oldSplit = this.instructions[offset].split(' ');
                    
                    if (oldSplit.length === 2) {
                        if (oldSplit[0] == 'inc') {
                            oldSplit[0] = 'dec';
                        } else {
                            oldSplit[0] = 'inc';
                        }
                    }
                    if (oldSplit.length === 3) {
                        if (oldSplit[0] == 'jnz') {
                            oldSplit[0] = 'cpy';
                        } else {
                            oldSplit[0] = 'jnz';
                        }
                    }

                    this.instructions[offset] = oldSplit.join(' ');
            }

            // console.log(this.instructions.join('\n'));
        }
        // console.log(this.instructions.join('\n'));
    }
}