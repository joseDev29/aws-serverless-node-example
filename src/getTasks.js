const AWS = require('aws-sdk')

const getTasks = async (event) => {
  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient()

    //Obtiene todos los datos de la tabla
    const result = await dynamoDB
      .scan({
        TableName: 'TaskTable',
      })
      .promise()

    const tasks = result.Items

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: tasks,
      }),
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
  getTasks,
}
