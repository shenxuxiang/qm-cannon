#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import prettier from './prettier.js';
import downloadTemplate from './downloadTemplate.js';

export default function(projectName) {
  const questions = [
    {
      type: 'input',
      message: 'Please Input Your Project Version: ',
      name: 'version',
      default: '1.0.0',
      validate: (input) => {
        if (/^\d+\.\d+\.\d+$/.test(input)) {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      type: 'rawlist',
      message: 'Please Select Template',
      choices: [ 'react', 'vue' ],
      default: 0,
      name: 'template'
    },
  ];

  inquirer.prompt(questions)
    .then(handleResponse(projectName))
    .catch(catchError);
}

async function getConstructionMethod() {
  try {
    const questions = [
      {
        type: 'rawlist',
        message: 'Please Select The Construction Method',
        name: 'method',
        choices: [ 'webpack', 'vite' ],
        default: 'vite',
      },
    ];

    const response = await inquirer.prompt(questions);
    return response.method;
  } catch (error) {
    throw error;
  }
}

async function getReactRedux() {
  try {
    const questions = [
      {
        type: 'confirm',
        default: false,
        message: 'Whether To Use Redux',
        name: 'redux',
      },
    ];

    const response = await inquirer.prompt(questions);
    return response.redux;
  } catch (error) {
    throw error;
  }
}

function handleResponse(projectName) {
  const output = path.resolve(projectName);
  return async function(response) {
    const { version, template } = response;
    let redux = false;
    let method = 'vite';

    if (template === 'react') {
      redux = await getReactRedux();
      method = await getConstructionMethod();
    }

    // 一共三个仓库，分别是：cannon-react-ts-webpack、cannon-react-ts-vite、cannon-vue-ts-vite
    const repository = 'cannon' + '-' + template + '-ts-' + method;
    const branch = redux ? 'with-redux' : 'master';

    try {
      process.stdout.write(chalk.bold.green(`\nCreating 【${projectName}】 Project ... Please Wait\n\n`));

      await downloadTemplate(repository, branch, output);

      const packagePath = path.resolve(output, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      pkg.version = version;
      pkg.name = projectName;

      // package 文件进行格式化并写入
      await prettier(pkg, packagePath);

      process.stdout.write(chalk.bold.green(`The ${projectName} project creation completed\n\n`));
    } catch (error) {
      catchError(error);
    }
  }
}

function catchError(error) {
  let msg = error.stack;
  msg = msg.replace(/^\b/mg, '   ');
  process.stdout.write(chalk.bold.red(msg));
  process.stdout.write('\n\n');
  process.exit();
}
