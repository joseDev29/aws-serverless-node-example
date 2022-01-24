const AWS = require('aws-sdk')

const deleteTask = async (event) => {
  try {
    const { id } = event.pathParameters

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
    const deleteResult = await dynamoDB
      .delete({
        TableName: 'TaskTable',
        Key: {
          id,
        },
        ReturnValues: 'ALL_OLD',
      })
      .promise()

    return {
      statusCode: 200,
      body: JSON.stringify(deleteResult.Attributes),
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
  deleteTask,
}
