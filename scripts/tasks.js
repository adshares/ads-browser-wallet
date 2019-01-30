const sh = require('shelljs');
const cspBuilder = require('content-security-policy-builder');
const fs = require('fs');
const JSZip = require('jszip');

exports.replaceWebpack = () => {
  const replaceTasks = [{
    from: 'webpack/replace/JsonpMainTemplate.runtime.js',
    to: 'node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: 'webpack/replace/process-update.js',
    to: 'node_modules/webpack-hot-middleware/process-update.js'
  }];

  replaceTasks.forEach(task => sh.cp(task.from, task.to));
};

const getContentSecurityPolicy = (isProd) => {
  const directives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    connectSrc: ["'self'", 'https://rpc.adshares.net', 'https://rpc.e11.click', 'data:'],
    styleSrc: ['*', 'blob:', "'unsafe-inline'"],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:'],
  };

  if (!isProd) {
    directives.scriptSrc.push('https://localhost:3000', "'unsafe-eval'");
    directives.connectSrc.push('https://localhost:3000', 'https://127.0.0.12:5000');
  }

  return { directives };
};

exports.copyAssets = (type) => {
  const isProd = type === 'build';
  const view = JSON.stringify({
    env: isProd ? 'prod' : type,
    name: process.env.npm_package_display_name,
    version: process.env.npm_package_version,
    description: process.env.npm_package_description,
    author: `${process.env.npm_package_author_name} <${process.env.npm_package_author_email}>`,
    host: isProd ? '' : 'https://localhost:3000',
    csp: cspBuilder(getContentSecurityPolicy(isProd)),
    geckoId: `${process.env.npm_package_name}@adshares.net`,
  });

  sh.rm('-rf', type);
  sh.mkdir(type);
  console.log(`- created ${type} directory`);

  sh.cp('-R', 'chrome/assets/*', type);
  console.log(`- copied chrome/assets into ${type}`);

  sh.exec(`echo ${view} | mustache - chrome/manifest.mustache ${type}/manifest.json`);
  console.log(`- rendered ${type}/manifest.json`);

  sh.ls('chrome/views/*.mustache').forEach((file) => {
    const output = `${type}/${file.replace(/^.*[\\/]/, '').replace(/[^.]+$/, 'html')}`;
    sh.exec(`echo ${view} | mustache - ${file} ${output}`);
    console.log(`- rendered ${output}`);
  });
};

const zipFolder = (jszip, folder, output) => {
  sh.ls(folder).forEach((file) => {
    const path = `${folder}/${file}`;
    if (path === output) {
      return;
    }
    if (sh.test('-d', path)) {
      zipFolder(jszip.folder(file), path, output);
    } else {
      jszip.file(file, fs.readFileSync(path));
    }
  });
};

exports.compress = (folder) => {
  const name = process.env.npm_package_name.replace(/[^a-zA-Z0-9]+/g, '_');
  const version = process.env.npm_package_version.replace(/[^a-zA-Z0-9]/g, '_');
  const output = `${folder}/${name}_${version}.zip`;
  const jszip = new JSZip();
  zipFolder(jszip, folder, output);
  jszip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE' })
    .pipe(fs.createWriteStream(output))
    .on('finish', () => {
      console.log(`- compressed file ${output}`);
    });
};
