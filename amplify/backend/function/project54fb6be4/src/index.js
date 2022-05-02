const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
//함수가 호출되었을 때 실행되는 코드.
exports.handler = (event, context) => { 
  console.log(`EVENT: ${JSON.stringify(event)}`);
  //이벤트, 콘텍스트 및 경로가 app.js에서 실행 중에 익스프레스 서버로 전달되는 위치.
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise; 
};
