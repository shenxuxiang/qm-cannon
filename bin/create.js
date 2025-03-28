#!/usr/bin/env node

import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as prettier from "prettier";
import * as fs from 'node:fs/promises';
import downloadRepository from './downloadRepository.js';

const rootDir = process.cwd();

const questions = [
  {
    type: 'rawlist',
    name: 'framework',
    message: 'Please Select Front End Framework: ',
    choices: [ 'react', new inquirer.Separator(), 'vue' ],
    default: 0,
  },
  // {
  //   type: 'rawlist',
  //   name: 'tool',
  //   message: 'Please Select A Code Building Tool: ',
  //   choices: [ 'webpack', new inquirer.Separator(), 'vite' ],
  //   default: 1,
  // },
  // {
  //   type: 'confirm',
  //   name: 'model',
  //   message: function(answers) {
  //     if (answers.framework === 'react') {
  //       return 'Do You Want To Import Redux: ';
  //     } else {
  //       return 'Do You Want To Import Pinia: ';
  //     }
  //   }
  // },
  {
    type: 'input',
    name: 'version',
    default: '1.0.0',
    message: 'Please Input Project Version(format: xx.xx.xx): ',
    validate: function(input) {
      if (/^[1-9][0-9]*\.([1-9][0-9]*|0)\.([1-9][0-9]*|0)$/.test(input)) {
        return true;
      } else {
        return 'Please Input The Version Number In The Format';
      }
    }
  }
];

export default async function create(projectName) {
  try {
    const resp = await inquirer.prompt(questions);
    const { framework, version } = resp;
    const repository = `cannon-${framework}-ts-vite`;

    await downloadRepository(repository, 'master', projectName);
    // 新创建的项目目录
    const projectPath = path.resolve(rootDir, projectName);

    const packagePath = path.resolve(projectPath, 'package.json');
    const optionsPath = path.resolve(projectPath, '.prettierrc.cjs');

    // 加载 prettier 的配置文件
    const options = await prettier.resolveConfig(optionsPath);
    // 加载项目的包管理器
    const pkg = JSON.parse(await fs.readFile(packagePath, 'utf8'));
    // 更新包管理器文件的 version、name
    pkg.version = version;
    pkg.name = projectName;

    // 内容修改完成后，对包管理器文件进行格式化，并重新写入到文件。
    const formatted = await prettier.format(JSON.stringify(pkg), { ...options, filepath: packagePath });
    await fs.writeFile(packagePath, formatted);
  } catch (error) {
    const msg = '\n' + error.stack.toString().replace(/^\b/mg, '   ') + '\n';
    process.stdout.write(chalk.red(msg));
  }
}


