#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const prettier = require('./prettier');
const child_process = require('child_process');
const downloadTemplate = require('./downloadTemplate');

module.exports = function(projectName) {
  const questions = [
    {
      type: 'input',
      message: 'input project version: ',
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
      message: '请选择项目创建模版',
      choices: [ 'react-ts' ],
      default: 0,
      name: 'template'
    },
    {
      type: 'rawlist',
      message: '请选则打包构建方式',
      name: 'buildType',
      choices: [ 'webpack', 'vite' ],
      default: 'webpack',
    },
    {
      type: 'confirm',
      message: '是否在项目中使用 redux',
      name: 'redux',
      default: true,
    },
  ];

  inquirer.prompt(questions)
    .then(handleResponse(projectName))
    .catch(catchError);
}

function handleResponse(projectName) {
  const output = path.resolve(projectName);
  return async function(response) {
    const { version, template, buildType, redux } = response;
    const repository = 'cannon' + '-' + template + '-' + buildType;
    const branchName = redux ? 'with-redux' : 'master';

    try { 
      process.stdout.write(chalk.bold.green(`\ncreating ${projectName} project ...\n\n`));

      await downloadTemplate(repository, branchName, output);

      const packagePath = path.resolve(output, 'package.json');
      const package = require(packagePath);
      package.version = version;
      package.name = projectName;
      
      // package 文件进行格式化并写入
      await prettier(package, packagePath);

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