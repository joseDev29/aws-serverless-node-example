const AWS = require('aws-sdk')

const getTaskByID = async (event) => {
  try {
    const { id } = event.pathParameters

    const dynamoDB = new AWS.DynamoDB.DocumentClient()

    //Obtiene un datos de la tabla segun la query de la propiedad key
    const result = await dynamoDB
      .get({
        TableName: 'TaskTable',
        Key: {
          id,
        },
      })
      .promise()

    const task = result.Item

    if (!task)
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Task with id '${id}' not found`,
        }),
      }

    return {
      statusCode: 200,
      body: JSON.stringify(task),
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
  getTaskByID,
}
