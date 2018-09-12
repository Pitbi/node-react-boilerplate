const fs = require('fs-posix')
const path = require('path')
const prompt = require('prompt-async')
const changeCase = require('change-case')
const _ = require('lodash')

const run = async () => {
  prompt.start()
  const promptResult = await prompt.get(['controller', 'controllerPath'])
  const { controller, controllerPath } = promptResult
  if (!controller)
    throw 'missing_controller_name'
  const fullControllerPath = path.join(process.env.PWD, 'src', 'features', controllerPath, controller)

  const templatesAttributes = {
    Controller: changeCase.pascalCase(`${controller} controller`)
  }

  /*Controller.js*/
  const ControllerPath = path.join(fullControllerPath, 'Controller.js')
  const ControllerCompiled = _.template(ControllerTemplate)
  const ControllerContent = ControllerCompiled(templatesAttributes)
  await fs.outputFile(ControllerPath, ControllerContent)


  /*ERRORS.js*/
  const ERRORSPath = path.join(fullControllerPath, 'ERRORS.js')
  const ERRORSCompiled = _.template(ERRORSTemplate)
  const ERRORSContent = ERRORSCompiled(templatesAttributes)
  await fs.outputFile(ERRORSPath, ERRORSContent)

  /*Validator.js*/
  const ValidatorPath = path.join(fullControllerPath, 'Validator.js')
  const ValidatorCompiled = _.template(ValidatorTemplate)
  const ValidatorContent = ValidatorCompiled(templatesAttributes)
  await fs.outputFile(ValidatorPath, ValidatorContent)
}

try {
  run()
} catch (error) {
  console.error(error)
}

const ControllerTemplate = [
  'const Controller = \n',
  'const Validator = require(\'./Validator\')\n\n',
  'class <%= Controller %> extends Controller {\n',
  '  constructor(req, res, next, options) {\n',
  '    super(...arguments)\n',
  '    this.Validator = Validator\n',
  '  }\n\n',
  '  async work() {\n',
  '    \n',
  '  }\n',
  '}\n\n',
  'module.exports = <%= Controller %>'
].join('')

const ERRORSTemplate = [
  'const { makeTypeError, makeError, makeWarning } = require(\'../../../core/errors\')\n\n',
  'const controller = \'\'\n\n',
  'const ERRORS = {\n\n',
  '}\n\n',
  'module.exports = ERRORS'
].join('')

const ValidatorTemplate = [
  'const Validator = require(\'api-request-validator\')\n\n',
  'const ERRORS = require(\'./ERRORS\')\n',
  'const validations = {\n\n',
  '}\n\n',
  'class <%= Controller %>Validator extends Validator {\n',
  '  constructor(req, options = {}) {\n',
  '    super(validations, PAYLOAD, { \n',
  '      mainError: ERRORS.MAIN,\n',
  '      filter: true\n',
  '    })\n',
  '  }\n',
  '}\n\n',
  'module.exports = <%= Controller %>Validator'
].join('')