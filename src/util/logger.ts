const emojic = require('emojic');
const config = require('config');

const prefix = '[advent-'+config.get('year')+']';

const logger = {
    log: (...args: any[]) => console.log(prefix, ...args),
    debug: (...args: any[]) => {
        console.debug(prefix, ...args);
    },
    error: (...args: any[]) => console.error(prefix, ...args),
    success: (...args: any[]) => logger.log(...args, emojic.whiteCheckMark),
    fail: (...args: any[]) => logger.log(...args, emojic.x)
};

// export default logger;

export { logger };