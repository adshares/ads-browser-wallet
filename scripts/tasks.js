const shell = require('shelljs');
const cspBuilder = require('content-security-policy-builder');

exports.replaceWebpack = () => {
  const replaceTasks = [{
    from: 'webpack/replace/JsonpMainTemplate.runtime.js',
    to: 'node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: 'webpack/replace/process-update.js',
    to: 'node_modules/webpack-hot-middleware/process-update.js'
  }];

  replaceTasks.forEach(task => shell.cp(task.from, task.to));
};

const getContentSecurityPolicy = (isProd) => {
  const directives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    connectSrc: ["'self'", 'https://rpc.adshares.net', 'https://rpc.e11.click', 'data:'],
    styleSrc: ['*', "'unsafe-inline'"],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:'],
  };

  if (!isProd) {
    directives.scriptSrc.push('http://localhost:3000', 'https://localhost:3000', "'unsafe-eval'");
    directives.connectSrc.push('http://localhost:3000', 'https://localhost:3000', 'http://127.0.0.12:5000');
    directives.styleSrc.push('blob:');
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
    host: isProd ? '' : 'http://localhost:3000',
    csp: cspBuilder(getContentSecurityPolicy(isProd))
  });

  shell.rm('-rf', type);
  shell.mkdir(type);
  console.log(`- created ${type} directory`);

  shell.cp('-R', 'chrome/assets/*', type);
  console.log(`- copied chrome/assets into ${type}`);

  shell.exec(`echo ${view} | mustache - chrome/manifest.mustache ${type}/manifest.json`);
  console.log(`- rendered ${type}/manifest.json`);

  shell.ls('chrome/views/*.mustache').forEach((file) => {
    const output = `${type}/${file.replace(/^.*[\\/]/, '').replace(/[^.]+$/, 'html')}`;
    shell.exec(`echo ${view} | mustache - ${file} ${output}`);
    console.log(`- rendered ${output}`);
  });
};
