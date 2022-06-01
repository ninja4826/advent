import * as fs from 'fs';
import * as util from 'util';
import { execSync } from 'child_process';
import { Command, Option } from 'commander';
import { AocClient, transforms } from 'advent-of-code-client';
const emojic = require('emojic');
const config = require('config');
import { logger } from './util';
import path from 'path';
const gulp = require('gulp');
const gulpScripts = require('../gulpfile');

const stat = util.promisify(fs.stat);

type Result = number | string;
type PartFn = (input: any) => Result;

let year = '';
if (config.has('year')) {
    year = config.get('year');
} else {
    year = new Date().getFullYear().toString();
}

const program = new Command();

program
    .name('advent'+year)
    .description('Scripts for Advent of Code '+year)
    .version('0.0.1');

program.command('run')
    .description(`Run a day's script`)
    .argument('<day>', 'day to run')
    .addOption(new Option('-p, --part [num]', 'which part to run')
        .choices(['0', '1', '2'])
        .default('0')
        .preset('1')
        .argParser(parseInt))
    .option('-r, --remote', 'use remote input')
    .option('-b, --no-build', 'disable build at start')
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

        let runner = async (func: PartFn, pNum: number, remote = false, data: any[] = []) => {
            if (data.length === 0) {
                if ('testData' in script && !remote) {
                    if (!Array.isArray(script.testData.part1)) {
                        script.testData.part1 = [script.testData.part1];
                    }
                    if (script.testData.part2 == '') {
                        script.testData.part2 = script.testData.part1;
                    }
                    if (!Array.isArray(script.testData.part2)) {
                        script.testData.part2 = [script.testData.part2];
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

            var answer: any;

            if (func.constructor.name === 'AsyncFunction') {
                for (let d of data) {
                    if (remote) {
                        logger.disable();
                    }
                    answer = await func(d);
                    logger.enable();
                    logger.success('Answer:', answer);
                }
            } else {
                for (let d of data) {
                    if (remote) {
                        logger.disable();
                    }
                    answer = func(d);
                    logger.enable();
                    logger.success('Answer:', answer);
                }
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
                if (doPart1) {
                    // await client.run([script.part1], false);
                    await runner(script.part1, 1, true);
                }
                if (doPart2) {
                    // await client.run([script.part2], false);
                    await runner(script.part2, 2, true);
                }
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
    .action((day: string) => {
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
    .action((session: string) => {
        let json = require('../config/default.json');
        json.session = session;
        fs.writeFileSync('./config/default.json', JSON.stringify(json, null, 2));
        process.exit();
    });

program.command('year')
    .description('Set the current working year')
    .argument('<year>', 'year to be set to')
    .action((year: string) => {
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

program.command('ans')
    .description('Submit an answer for a specified day')
    // .argument('<day>', 'day to submit')
    // .argument('<part>', 'part to submit')
    // .argument('<answer>', 'answer to submit')
    .requiredOption('-d, --day <number>', 'day to submit')
    .requiredOption('-p, --part <number>', 'part to submit')
    .requiredOption('-a, --answer <string | number>', 'answer to submit')
    .action(async (opts: any) => {
        const client = new AocClient({
            year: Number(year),
            day: Number(opts.day),
            token: config.get('session')
        });

        let res = await client.submit(+opts.part, opts.answer);

        if (res) {
            logger.success(`Part ${opts.part} completed!`);
        } else {
            logger.fail(`Part ${opts.part} failed :(`);
        }
        process.exit(0);
    });

program.parse();
// process.exit();