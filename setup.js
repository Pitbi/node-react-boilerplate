const util = require('util')
const exec = util.promisify(require('child_process').exec)
require('colour')

/*
  Arguments:
  --clear-dep: remove node_mpdules folder before the install
*/

const setup = async () => {
  console.info('Installing all process'.cyan.inverse)
  margin()

  /*Yarn link common*/
  await repoLinkRegistration('./common', 'common')

  margin()
  
  /*Start API & link common repo*/
  await installDependencies('./api', 'API')
  await link('API', './api', 'node-react-boilerplate-common')

  margin()
  console.info('Processes installed.'.green.inverse)
}

const repoLinkRegistration = async(path, repo) => {
  console.info(`Yarn link registration for ${repo} repository`.cyan)
  const { stderr, stdout } = await exec(`cd ${path} && yarn link`)
  if (stderr && stderr.match(/warning There's already a package called (.*) registered./))
    return console.info('Repo already linked'.green)
  throwStderr(stderr)
  console.info(`${repo} link registered`.green)
}

const link = async(app, path, repo) => {
  const { stderr, stdout } = await exec(`cd ${path} && yarn link ${repo}`)
  throwStderr(stderr)
  displayStdout(stdout,`${repo} linked to ${app}`)
}

const installDependencies = async (path, app) => {
  if (process.argv.includes('--clear-dep'))
    await removeDependencies(path, app)
  console.info(`Installing ${app} dependecies`.cyan)
  const { stderr, stdout } = await exec(`cd ${path} && yarn install`)
  throwStderr(stderr)
  displayStdout(stdout,`${app} dependecies installed`)
}

const removeDependencies = async (path, app) => {
  const { stderr, stdout } = await exec(`cd ${path} && rm -rf node_modules`)
  throwStderr(stderr)
  displayStdout(stdout,`${app} dependecies removed`)
}

const displayStdout = (stdout, successMessage) => {
  console.info(stdout)
  console.info(successMessage.green)
}

const throwStderr = (stderr) => {
  if (stderr && stderr.match('DeprecationWarning'))
    console.warn(`Warning: ${stderr}`.yellow)
  else if (stderr) 
    throw stderr
}

const margin = () => {
  console.info('')
  console.info('')
}

try {
  setup()
} catch (err) {
  throw err
}