const { v4: uuid } = require('uuid')
const AWS = require('aws-sdk')

const middy = require('@middy/core')
const jsonBodyParser = require('@middy/http-json-body-parser')

const addTask = async (event) => {
  //Se conecta a traves de las credenciales configuradas en la maquina
  const dynamoDB = new AWS.DynamoDB.DocumentClient()

  const { title, description } = event.body
  const createdAt = new Date().toString()
  const id = uuid()

  const newTask = {
    id,
    title,
    description,
    createdAt,
    done: false,
  }

  //Guarda un registro
  await dynamoDB
    .put({
      TableName: 'TaskTable',

      Item: newTask,
    })
    .promise()

  return {
    statusCode: 201,
    body: JSON.stringify(newTask),
  }
}

//Se agrega middleware para parsear el body
module.exports = { addTask: middy(addTask).use(jsonBodyParser()) }
