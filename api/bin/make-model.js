const fs = require('fs-posix')
const path = require('path')
const prompt = require('prompt-async')
const changeCase = require('change-case')
const _ = require('lodash')

const run = async () => {
  prompt.start()
  const promptResult = await prompt.get('model')
  const model = promptResult.model
  if (!model)
    throw 'missing_model_name'

  const modelPath = path.join(process.env.PWD, 'src', 'models', model)
  const templatesAttributes = makeIndexAttributes(model)

  /*index.js*/
  const indexPath = path.join(modelPath, 'index.js')
  const indexCompiled = _.template(indexTemplate)
  const indexContent = indexCompiled(templatesAttributes)
  await fs.outputFile(indexPath, indexContent)
  console.info(indexPath, 'is created')

  /*Class.js*/
  const ClassPath = path.join(modelPath, `${_.upperFirst(model)}.js`)
  const classCompiled = _.template(classTemplate)
  const classContent = classCompiled(templatesAttributes)
  await fs.outputFile(ClassPath, classContent)
  console.info(ClassPath, 'is created')

  /*schema.js*/
  const schemaPath = path.join(modelPath, 'schemas', `${model}.js`)
  const schemaCompiled = _.template(schemaTemplate)
  const schemaContent = schemaCompiled(templatesAttributes)
  await fs.outputFile(schemaPath, schemaContent)
  console.info(schemaPath, 'is created')

  /*OK*/
  console.info(`${model} model is created`)
}

try {
  run()
} catch (error) {
  console.error(error)
}

const makeIndexAttributes = (model) => ({
  schema: `${changeCase.camel(model)}Schema`,
  schemaFile: changeCase.param(model),
  className: `${changeCase.pascalCase(model)}Class`,
  classFile: changeCase.pascalCase(model),
  model: changeCase.pascalCase(model)
})

const indexTemplate = [
  'const mongoose = require(\'mongoose\')\n',
  'const <%= schema %> = require(\'./schemas/<%= schemaFile %>\')\n',
  'const <%= className %> = require(\'./<%= classFile %>\')\n\n',
  '<%= schema %>.loadClass(<%= className %>)\n\n',
  'const <%= model %> = mongoose.model(\'<%= model %>\', <%= schema %>)\n\n',
  'module.exports = <%= model %>'
].join('')

const classTemplate = [
  'class <%= className %> {\n\n',
  '}\n\n',
  'module.exports = <%= className %>'
].join('')

const schemaTemplate = [
  'const mongoose = require(\'mongoose\')\n\n',
  'const <%= schema %> = new mongoose.Schema({\n\n',
  '})\n\n',
  'module.exports = <%= schema %>'
].join('')