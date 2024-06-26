#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { program } from "commander";
import createProject from './create.js';

const __dirname = fileURLToPath(new URL('./', import.meta.url));

const rootDir = process.cwd();

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));

program
  .version(pkg.version, '-V, --version', 'output the version number')
  .name('qm-cannon')
  .command('create')
  .argument('<project-name>')
  .action(function(projectName) {
    if (!validateProjectName(projectName)) {
      process.stdout.write(chalk.bold.red(`   The Project Name Format Is Incorrect!\n`));
      process.exit('1');
    }

    if (isExisting(path.resolve(rootDir, projectName))) {
      process.stdout.write(chalk.bold.red(`   The Project Already Exists!\n`));
      process.exit('1');
    }

    process.stdout.write(chalk.cyanBright(`   Project Creation In Progress, Please Wait ...\n\n`));

    setTimeout(() => createProject(projectName), 1000);
  });

program.parse();

function validateProjectName(name) {
  return /^[a-zA-Z_][\w\-]+$/.test(name);
}

function isExisting(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}
