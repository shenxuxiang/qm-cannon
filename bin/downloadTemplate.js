#!/usr/bin/env node

const download = require('download-git-repo');
const chalk = require('chalk');
const path = require('path');

module.exports = function (repository, branch, destination) {
  return new Promise((resolve, reject) => {
    const url = `github:shenxuxiang/${repository}#${branch}`;
    let interval = null;

    function printProgressBar(percent) {
      progressBar = chalk.bold.cyan('   download ');
      progressBar += chalk.bold.white('[');
      progressBar += chalk.gray('='.repeat(Math.floor(percent / 5)).padEnd(20, ' '));
      progressBar += chalk.bold.white(']');
      progressBar += ' ';
      progressBar += chalk.bold.green(percent + '%');
      progressBar += '\r';
      process.stdout.write(progressBar);
      
      if (percent >= 98) {
        clearTimeout(interval);
        interval = null;
      } else {
        interval = setTimeout(() => printProgressBar(percent + 2), 200);
      }
    }

    printProgressBar(0);

    download(url, destination, function(error) {
      clearTimeout(interval);
      interval = null;
      printProgressBar(100);
      process.stdout.write('\n\n');
      if (error) {
        return reject(error);
      } else {
        return resolve(true);
      }
    });
  });
}