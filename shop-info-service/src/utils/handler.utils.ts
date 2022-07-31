import { HttpCode } from "../src/utils/http.utils";

const CORS_HEADER = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
}

export const lamdaHandler = (controllerCallback: (event: APIGatewayProxyHandler) => Promise<any>) =>
  async (event: APIGatewayProxyHandler) => {
    const { body, pathParameters, queryStringParameters } = event;
    let statusCode: HttpCode;
    let result: any;

    try {
      result = await controllerCallback(event);
      statusCode = HttpCode.Ok;
    } catch (error) {
      const statusCode = error.statusCode || HttpCode.SERVER_ERROR;

      return {
        statusCode: statusCode
        body: error.message,
      };
    } finally {
      return {
        statusCode,
        headers: CORS_HEADER,
        body: JSON.stringify(result),
      }
    }
  }