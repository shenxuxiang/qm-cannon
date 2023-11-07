#!/usr/bin/env node

import download from 'download-git-repo';
import chalk from 'chalk';

export default function (repository, branch, destination) {
  return new Promise((resolve, reject) => {
    const url = `github:shenxuxiang/${repository}#${branch}`;
    let interval = null;

    function printProgressBar(percent) {
      let progressBar = '';
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
