const path = require('node:path');

const mobileRoot = path.join(process.cwd(), 'apps/mobile');

function toMobilePath(filename) {
  return `"${path.relative(mobileRoot, path.resolve(filename))}"`;
}

function eslintMobileFiles(filenames) {
  return `corepack pnpm --dir apps/mobile exec eslint --fix ${filenames
    .map(toMobilePath)
    .join(' ')}`;
}

module.exports = {
  'apps/mobile/**/*.{js,jsx,ts,tsx}': filenames => [
    eslintMobileFiles(filenames),
  ],
  'apps/mobile/**/*.json': filenames => [
    eslintMobileFiles(filenames),
  ],
};
