const AWS = require('aws-sdk')

const middy = require('@middy/core')
const jsonBodyParser = require('@middy/http-json-body-parser')

const updateTask = async (event) => {
  try {
    const { id } = event.pathParameters
    const { done } = event.body

    const dynamoDB = new AWS.DynamoDB.DocumentClient()

    const getResult = await dynamoDB
      .get({
        TableName: 'TaskTable',
        Key: {
          id,
        },
      })
      .promise()

    const task = getResult.Item

    if (!task)
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Task with id '${id}' not found`,
        }),
      }

    //Actualiza o setea la propiedad done de la tabla
    //si no encuentra un elemento en base al id
    //crea uno nuevo
    const updateResult = await dynamoDB
      .update({
        TableName: 'TaskTable',
        Key: { id },
        UpdateExpression: 'set done = :done',
        ExpressionAttributeValues: {
          ':done': done,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise()

    return {
      statusCode: 200,
      body: JSON.stringify(updateResult.Attributes),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    }
  }
}

module.exports = {
  updateTask: middy(updateTask).use(jsonBodyParser()),
}
