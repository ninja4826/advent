import * as fs from 'fs';
import * as util from 'util';
import { execSync } from 'child_process';
import { Command, InvalidOptionArgumentError, Option } from 'commander';
import { AocClient, transforms } from 'advent-of-code-client';
const emojic = require('emojic');
const config = require('config');
import { logger, range } from './util';
import path from 'path';
import { load as $load } from 'cheerio';
import axios from 'axios';
const c = require('ansi-colors');

const TurndownService = require('turndown');

const stat = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);

type Result = number | string;
type PartFn = (input: any) => Result;

let year = '';
if (config.has('year')) {
    year = config.get('year');
} else {
    year = new Date().getFullYear().toString();
}

function intParse(val: string, dummy: any): number {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
        throw new InvalidOptionArgumentError('Not a number.');
    }
    return parsed;
}

async function main() {
    const program = new Command();

    program
        .name('advent'+year)
        .description('Scripts for Advent of Code '+year)
        .version('0.0.1');

    program.command('run')
        .description(`Run a day's script`)
        .argument('<day>', 'day to run')
        // .addOption(new Option('-p, --part [num]', 'which part to run')
        //     .choices(['0', '1', '2'])
        //     .default('0')
        //     .preset('1')
        //     .argParser(parseInt))
        .option('-p, --part <number>', 'which part to run', intParse)
        .option('-r, --remote', 'use remote input')
        // .option('-b, --no-build', 'disable build at start')
        .action(async (day: any, opts: any) => {

            if ('build' in opts && opts.build) {
                // let srcFile = `./src/${year}/${day}.ts`;
                // let outFile = `./dist/${year}/${day}.js`;

                // let srcStat = await stat(srcFile);
                // let outStat = await stat(outFile);

                // if (srcStat.mtimeMs > outStat.mtimeMs) {
                //     execSync('npm run build');
                // }
                // gulp.series(gulpScripts.tsFiles);
                // gulpScripts.tsFiles();
            }
            const client = new AocClient({
                year: Number(year),
                day: Number(day),
                token: config.get('session')
            });
            client.setInputTransform((d: any) => d);
            // const script = require('./days/'+day);
            const script = require(`./${year}/${day}`);

            let runner = async (func: PartFn, pNum: number, remote = false, data: any[] = []): Promise<string | number> => {
                if (data.length === 0) {
                    if ('testData' in script && !remote) {
                        if (!Array.isArray(script.testData.part1)) {
                            script.testData.part1 = [script.testData.part1];
                        }
                        if (!Array.isArray(script.testData.part2)) {
                            script.testData.part2 = [script.testData.part2];
                        }
                        if (script.testData.part2.toString() == [''].toString()) {
                            script.testData.part2 = script.testData.part1;
                        }

                        if (!Array.isArray(script.testAnswers.part1)) {
                            script.testAnswers.part1 = [script.testAnswers.part1];
                        }
                        if (!Array.isArray(script.testAnswers.part2)) {
                            script.testAnswers.part2 = [script.testAnswers.part2];
                        }

                        if (script.testAnswers.part2.toString() === [0].toString()) {
                            script.testAnswers.part2 = script.testAnswers.part1;
                        }
                        data = script.testData['part'+pNum];
                    } else {
                        data = [await client.getInput()];
                    }
                }
                if ('transform' in script) {
                    data = data.map(d => script.transform(d));
                } else {
                    data = data.map(d => transforms.lines(d));
                }

                var answer: string | number = 0;

                if (func.constructor.name === 'AsyncFunction') {
                    // for (let d of data) {
                    for (let i = 0; i < data.length; i++) {
                        const d = data[i];
                        if (remote) {
                            logger.disable();
                        }
                        answer = await func(d);
                        logger.enable();
                        if (!remote && 'testAnswers' in script && 
                                'part'+pNum in script.testAnswers &&
                                i < script.testAnswers['part'+pNum].length) {
                            if (answer == script.testAnswers['part'+pNum][i]) {
                                logger.success('Answer:', c.green(answer));
                            } else {
                                logger.fail('Answer:', c.red(answer));
                            }
                        } else {
                            logger.log('Answer:', c.yellow(answer));
                        }
                        // logger.success('Answer:', answer);
                    }

                    return answer;
                } else {
                    // for (let d of data) {
                    for (let i = 0; i < data.length; i++) {
                        const d = data[i];
                        if (remote) {
                            logger.disable();
                        }
                        answer = func(d);
                        logger.enable();
                        if (!remote && 'testAnswers' in script && 
                                'part'+pNum in script.testAnswers &&
                                i < script.testAnswers['part'+pNum].length) {
                            if (answer == script.testAnswers['part'+pNum][i]) {
                                logger.success('Answer:', c.green(answer));
                            } else {
                                logger.fail('Answer:', c.red(answer));
                            }
                        } else {
                            logger.log('Answer:', c.yellow(answer));
                        }
                        // logger.success('Answer:', answer);
                    }
                    return answer;
                }
                
            };

            if ('remote' in opts && opts.remote) {
                

                if ('part' in opts && opts.part !== undefined) {
                    let doPart1 = opts.part == 1;
                    let doPart2 = opts.part == 2;

                    if (opts.part == 0) {
                        doPart1 = true;
                        doPart2 = true;
                    }
                    // let input = await client.getInput();
                    // logger.log('should get input');
                    let answers: any[] = [];
                    if (doPart1) {
                        // await client.run([script.part1], false);
                        let answer = await runner(script.part1, 1, true);
                        answers.push({
                            day: Number(day),
                            part: 1,
                            answer
                        })
                    }
                    if (doPart2) {
                        // await client.run([script.part2], false);
                        let answer = await runner(script.part2, 2, true);
                        answers.push({
                            day: Number(day),
                            part: 2,
                            answer
                        });
                    }

                    fs.writeFileSync('./.ans.json', JSON.stringify(answers));
                }
            } else {

                if ('part' in opts && opts.part !== undefined) {
                    let doPart1 = opts.part == 1;
                    let doPart2 = opts.part == 2;
                    if (opts.part == 0) {
                        doPart1 = true;
                        doPart2 = true;
                    }

                    if (doPart1) {
                        await runner(script.part1, 1);
                    }

                    if (doPart2) {
                        await runner(script.part2, 2);
                    }
                }
            }
            process.exit();
        });

    program.command('new')
        .description('Creates a new day source file in ./src/days')
        .argument('<day>', 'day to create')
        .action(async (day: string) => {
            let str = fs.readFileSync('./day.ts.template', { encoding: 'utf-8' });
            if (!fs.existsSync(`./src/${year}`)) {
                fs.mkdirSync(`./src/${year}`);
            }
            fs.writeFileSync(`./src/${year}/${day}.ts`, str);
            execSync('npm run build');
            process.exit();
        });

    program.command('cookie')
        .description('Set browser cookie')
        .argument('<session>', 'session cookie from https://adventofcode.com/')
        .action(async (session: string) => {
            let json = require('../config/default.json');
            json.session = session;
            fs.writeFileSync('./config/default.json', JSON.stringify(json, null, 2));
            process.exit();
        });

    program.command('year')
        .description('Set the current working year')
        .argument('<year>', 'year to be set to')
        .action(async (year: string) => {
            let target = path.basename(<string>config.util.getConfigSources().filter((s: any) => path.basename(s.name) !== 'default.json')[0].name);
            // let json = require('../config/default.json');
            let json = require(`../config/${target}`);
            json.year = Number(year);
            fs.writeFileSync(`./config/${target}`, JSON.stringify(json, null, 2));
            process.exit();
        });

    program.command('dl')
        .description('Download inputs for specified year')
        .action(async () => {
            fs.mkdirSync(`./src/${year}/inputs`, { recursive: true });
            let session = config.get('session');
            for (let i = 1; i <= 25; i++) {
                let client = new AocClient({
                    year: Number(year),
                    day: i,
                    token: session
                });
                client.setInputTransform((d: any) => d);
                fs.writeFileSync(`./src/${year}/inputs/${i}.txt`, <string>(await client.getInput()));
            }
            // fs.mkdirSync(`./desc/${year}`);
            // execSync(`npx advent-cli --year ${year} --session ${session} ./desc/${year}`);
            process.exit(0);
        });

    // program.command('ans')
    //     .description('Submit an answer for a specified day')
    //     // .argument('<day>', 'day to submit')
    //     // .argument('<part>', 'part to submit')
    //     // .argument('<answer>', 'answer to submit')
    //     .requiredOption('-d, --day <number>', 'day to submit')
    //     .requiredOption('-p, --part <number>', 'part to submit')
    //     .requiredOption('-a, --answer <string | number>', 'answer to submit')
    //     .action(async (opts: any) => {
    //         // const client = new AocClient({
    //         //     year: Number(year),
    //         //     day: Number(opts.day),
    //         //     token: config.get('session')
    //         // });

    //         // let res = await client.submit(+opts.part, opts.answer);

    //         // if (res) {
    //         //     logger.success(`Part ${opts.part} completed!`);
    //         //     if (opts.part == '1') {
    //         //         // execSync('gulp desc');
    //         //         await downloadDesc(opts.day);
    //         //     }
    //         // } else {
    //         //     logger.fail(`Part ${opts.part} failed :(`);
    //         // }
    //         // process.exit(0);
    //         return submitAnswer(+opts.day, +opts.part, opts.answer);
    //     });
    
    program.command('ans')
        .description('Submit an answer for a specified day')
        .option('-d, --day <number>', 'day to submit', intParse)
        .option('-p, --part <number>', 'part to submit', intParse)
        .option('-a, --answer <string | number>', 'answer to submit')
        .action(async (opts: any): Promise<void> => {
            const fileCheck = fs.existsSync('./.ans.json') && require('../.ans.json').length > 0;
            if (!fileCheck || 'day' in opts || 'part' in opts || 'answer' in opts) {
                for (let o of ['day', 'part', 'answer']) {
                    if (!(o in opts)) {
                        throw new InvalidOptionArgumentError(`--${o} option required.`);
                    }
                }
                return Promise.all([submitAnswer(opts.day, opts.part, opts.answer)]).then(() => {});
            } else {
                const ansData = require('../.ans.json');
                let proms: Promise<boolean>[] = [];
                for (let d of ansData) {
                    proms.push(submitAnswer(d.day, d.part, d.answer));
                }
                return Promise.all(proms).then(() => {
                    fs.writeFileSync('./.ans.json', JSON.stringify([]));
                });
            }
        });

    program.command('desc')
        .description('Download description for specified day')
        .option('-d, --day <number>', 'day to download')
        .action(async (opts: any) => {
            if (!fs.existsSync(path.resolve(__dirname, '..', 'desc'))) {
                fs.mkdirSync(path.resolve(__dirname, '..', 'desc'));
            }
            if (!fs.existsSync(path.resolve(__dirname, '..', 'desc', ''+year))) {
                fs.mkdirSync(path.resolve(__dirname, '..', 'desc', ''+year));
            }

            let days: number[] = [...range([1, 26])];
            if ('day' in opts) {
                days = [+opts.day];
            }
            let proms: Promise<void>[] = [];
            for (let d of days) {
                proms.push(downloadDesc(d));
            }
            await Promise.all(proms);
            process.exit(0);
        });

    program.command('prog')
        .description('blah')
        .action(async (opts: any) => {
            const BASE_URL = 'https://adventofcode.com';
            const YEAR = config.get('year');
            
            const url = `${BASE_URL}/${YEAR}`;

            const headerObj = { headers: { cookie: `session=${config.get('session')}`}};

            const { data: daysPageHTML } = await axios.get(url, headerObj);

            const $ = $load(daysPageHTML);

            const $days = $('main > pre.calendar > a');
            const starArr: [number, number][] = [];
            $days.map((i, el) => {
                // return el.attribs['aria-label'];
                const day = +(<RegExpExecArray>/calendar-day(\d+)/.exec(el.attribs.class))[1];
                const comp = /calendar-(\w+)omplete/.exec(el.attribs.class);

                let stars = 0;
                if (comp !== null) {
                    stars += 1;
                    if (comp[1] == 'veryc') {
                        stars += 1;
                    }
                }

                starArr.push([day, stars]);
            });
            starArr.sort((a, b) => a[0] - b[0]);

            for (let i of range(25, 5)) {
                let str = starArr.slice(i, i + 5).map(s => {
                    let str1 = s[0].toString().padStart(2, ' ');

                    if (s[1] == 0) return c.white(str1);
                    if (s[1] == 1) return c.italic.yellow(str1);
                    if (s[1] == 2) return c.bold.green(str1);
                }).join(' ');
                console.log(str);
            }

            // console.log(starArr);
            // process.exit(0);
        });

    program.command('py')
        .description('Run Python script for day')
        .requiredOption('-d, --day <number>', 'day to run')
        .action(async (opts: any) => {
            let fName = path.resolve('src', ''+year, opts.day+'.py');
            if (!fs.existsSync(fName)) {
                logger.log(c.red(`${fName} does not exist.`));
                process.exit(0);
            }

            execSync('python '+path.relative(path.resolve('.'), fName), { stdio: 'inherit' });
            process.exit(0);
        });

    program.command('ghdl')
        .description('Download GitHub file')
        .requiredOption('-u, --user <string>', 'user')
        .requiredOption('-r, --repo <string>', 'repo')
        .requiredOption('-p, --path <string>', 'path')
        .action(async (opts: any) => {
            let url = `https://raw.githubusercontent.com/${opts.user}/${opts.repo}/master/${opts.path}`;
            
            // npm start -- ghdl -u narimiran -r advent_of_code_2016 -p python/day_22.py
            
            const ghContent = require('github-content');

            const gc = new ghContent({
                owner: opts.user,
                repo: opts.repo,
                branch: 'master'
            });

            gc.file(opts.path, (err: any, file: any) => {
                if (err) throw err;
                console.log(file.contents);
            })
        });
    
    program.command('test')
        .description('test')
        .option('-p, --part <number>', 'part')
        .option('-d, --day <number>', 'day', intParse)
        .action(async (opts: any, command: any) => {
            // console.log(command);
            console.log('blah');
        })


    await program.parseAsync();
    return;
}
// process.exit();

async function downloadDesc(day: number): Promise<void> {
    const BASE_URL = 'https://adventofcode.com';
    const YEAR = config.get('year');
    const DAYS_DIR = path.resolve(__dirname, '..', 'desc', ''+YEAR);
    const turndownService = new TurndownService();
    
    const url = `${BASE_URL}/${YEAR}/day/${day}`;

    const headerObj = { headers: { cookie: `session=${config.get('session')}`}};
    
    const { data: descriptionPageHTML } = await axios.get(url, headerObj);

    const $ = $load(descriptionPageHTML);
    const html = $('main > article').map((index, el) => {
        return $(el).html();
    }).toArray().join('\n');
    let mdConverted = turndownService.turndown(html);

    mdConverted += `\n\n----------------------
*[Read on adventofcode.com](${url})*\n`;

    const filePath = path.join(DAYS_DIR, `${day}.md`);
    // console.log(opts);
    await writeFile(filePath, mdConverted);
    return;
}

async function submitAnswer(day: number, part: number, answer: string): Promise<boolean> {
    const client = new AocClient({
        year: Number(year),
        day,
        token: config.get('session')
    });

    let res = await client.submit(part, answer);

    if (res) {
        logger.success(`Part ${part} completed!`);
        if (part == 1) {
            await downloadDesc(day);
        }
        return true;
    } else {
        logger.fail(`Part ${part} failed :(`);
        return false;
    }
}

main().then(() => {
    process.exit();
}).catch(e => {
    console.error(e);
    process.exit();
});
// (async () => {
//     await main();
//     // process.exit();
// })().catch(e => {
//     console.error(e);
// });