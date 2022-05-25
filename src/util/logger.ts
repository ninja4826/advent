const emojic = require('emojic');
const config = require('config');

const prefix = '[advent-'+config.get('year')+']';

export class logger {
    private static en: boolean = true;

    static log(...args: any[]): void {
        if (this.en) console.log(prefix, ...args);
    }
    
    static debug(...args: any[]): void {
        if (this.en) console.debug(prefix, ...args);
    }

    static error(...args: any[]): void {
        if (this.en) console.debug(prefix, ...args);
    }

    static success(...args: any[]): void {
        if (this.en) this.log(...args, emojic.whiteCheckMark);
    }

    static fail(...args: any[]): void {
        if (this.en) this.log(...args, emojic.x);
    }

    static enable(): void {
        this.en = true;
    }

    static disable(): void {
        this.en = false;
    }
}

// const logger = {
//     log: (...args: any[]) => console.log(prefix, ...args),
//     debug: (...args: any[]) => {
//         console.debug(prefix, ...args);
//     },
//     error: (...args: any[]) => console.error(prefix, ...args),
//     success: (...args: any[]) => logger.log(...args, emojic.whiteCheckMark),
//     fail: (...args: any[]) => logger.log(...args, emojic.x)
// };

// export default logger;

// export { logger };