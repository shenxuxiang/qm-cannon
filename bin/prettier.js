#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Stream = require('stream');
const prettier = require('prettier');

async function format(chunk, dest) {
  if (!chunk) return;

  let content = '';
  if (chunk instanceof Stream) {
    content = await readdata(chunk);
  } else if (Buffer.isBuffer(chunk)) {
    content = chunk.toString();
  } else if (typeof chunk === 'string') {
    content = chunk;
  } else {
    content = JSON.stringify(chunk);
  }
  const data = await prettier.format(content, { parser: 'json' });
  fs.writeFileSync(path.isAbsolute(dest) ? dest : path.resolve(dest), data);
}


function readdata(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', function(chunk) {
      chunks.push(chunk);
    });

    stream.on('end', function() {
      const content = Buffer.concat(chunks);
      return resolve(content.toString());
    });
    stream.on('error', function() {
      return reject(new Error('输出读取失败'));
    });
  });
}

module.exports = format;