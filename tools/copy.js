import path from 'path';
import gaze from 'gaze';
import replace from 'replace';
import Promise from 'bluebird';
import del from 'del';

async function copy({ watch } = {}) {
  const ncp = Promise.promisify(require('ncp'));

  await Promise.all([
    ncp('src/public', 'build/public'),
    ncp('package.json', 'build/package.json'),
  ]);

  await del(['build/public/js/*','build/public/css/*','!build/public/js/libs'],{dot: true})
  replace({
    regex: '"start".*',
    replacement: '"start": "node server.js"',
    paths: ['build/package.json'],
    recursive: false,
    silent: false,
  });
}

export default copy;
