const core = require('@actions/core')
const github = require('@actions/github')
const licenseChecker = require('license-checker')

const checkLicenses = (path) => {
  return new Promise((resolve) => {
    const allowedLicenses = core.getInput('allow-only')
    try {
      licenseChecker.init({
        start: path,
        onlyAllow: allowedLicenses,
        excludePackages: excludePackages.join(';')
      }, err => {
        resolve(err);
      })
    } catch (error) {
      resolve(error);
    }
  });
}

try {
  const paths = (core.getInput('paths') || './').split(';');

  Promise.all(paths.map(checkLicenses)).then((errors) => {
    if (errors.filter(Boolean).length) {
      errors.forEach((error, index) => {
        if (error) {
          console.log(`Found errors while check path "${paths[index]}"`);
          console.log(error);
        }
      })
      core.setFailed('Licenses check has been failed')
    }
  })
} catch (error) {
  core.setFailed(error.message)
}
