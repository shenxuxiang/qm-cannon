

import path from 'path';
import chalk from 'chalk';
import download from 'download-git-repo';

const rootDir = process.cwd();

/**
 * 下载仓库
 * @param repository 仓库地址
 * @param branch 分支名称
 * @param destination 下载到那个目录中
 * @returns
*/
export default function downloadRepository(repository, branch, destination) {
  const repositoryURL = `github:shenxuxiang/${repository}#${branch}`;

  if (!path.isAbsolute(destination)) destination = path.resolve(rootDir, destination);

  return new Promise(function (resolve, reject) {
    let timer = null;
    let progress = 0;
    let hasDone = false;
    const iterator = taskIterator(0, 100, 2, printProgressBar);

    /**
     * 模拟进度条
     * @param max 进度条的最大值
     * @param callback 进度条达到最大值时触发的回调函数
    */
    function imitateProgressBar(max, callback) {
      ({ done: hasDone, value: progress } = iterator.next());
      if (hasDone) return callback?.();
      if (progress >= max) return callback?.();
      timer = setTimeout(() => imitateProgressBar(max, callback), 100);
    }

    imitateProgressBar(80);

    download(repositoryURL, destination, function(error) {
      clearTimeout(timer);
      if (error) {
        process.stdout.write('\n\n');
        reject(error);
      } else {
        iterator.step(4);
        imitateProgressBar(100, () => {
          process.stdout.write('\n\n');
          resolve();
        });
      }
    });
  });
}

/**
 * 任务迭代器
 * @param start 开始数值
 * @param end   结束数值
 * @param step  迭代数值（默认值： 1）
 * @param task  执行任务
 * @returns
*/
function taskIterator(start, end, step = 1, task) {
  let done = false;
  let value = start;
  const direction = step > 0 ? 'asc' : 'desc';
  function isDone() {
    if (direction === 'asc') {
      return (done = value >= end);
    } else {
      return (done = value <= end);
    }
  }

  return {
    next: function(newValue) {
      if (typeof newValue === 'number') value = newValue;

      value += step;
      value = isDone() ? end : value;

      task && task(value);
      return { value, done };
    },
    step: function(newStep) {
      step = newStep;
    }
  };
}

/**
 * 打印进度条
 * @param progress 进度（0-100）
 * @returns
*/
function printProgressBar (progress) {
  let progressBar = '';
  progressBar = chalk.bold.green('   download ');
  progressBar += chalk.gray('[');
  progressBar += chalk.bold.white('='.repeat(Math.floor(progress / 5)).padEnd(20, ' '));
  progressBar += chalk.gray(']');
  progressBar += ' ';
  progressBar += chalk.bold.green(progress + '%');
  progressBar += '\r';

  process.stdout.write(progressBar);
}
