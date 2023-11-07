#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import process from 'process';
import { program } from 'commander';
import { fileURLToPath } from 'url';
import init from './cannon-create.js';

const __dirname = fileURLToPath(new URL('./', import.meta.url));
const { version } = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));

program.version(version, '-V, --version', 'output the current version')
	.name('qm-cannon')
	.usage('create <project-name>')
	.command('create')
	.argument('<project-name>', 'create the name of the project')
	.action(function (projectName) {
		if (projectName.includes('/')) {
			process.stdout.write(chalk.bold.red("\n   project name cannot contain '/'"));
			process.stdout.write('\n\n');
			return;
		}
		const dir = process.cwd();
		const files = fs.readdirSync(dir);
		let alreadyExists = false;
		for (let i = 0; i < files.length; i++) {
			const filename = files[i];
			if (filename === projectName) alreadyExists = true;
		}
		if (alreadyExists) {
			process.stdout.write('\n');
			process.stdout.write(chalk.red('   The project name you inputed already exists in the current directory.\n\n'));
		} else {
			process.stdout.write(chalk.bold.green('Please input the correct content according to the prompt information\n'));
			init(projectName);
		}
	});

program.parse(process.argv);
