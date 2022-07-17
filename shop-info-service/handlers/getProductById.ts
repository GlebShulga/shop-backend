import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import productList from "../src/data/productList.json";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const error = 'Product not found'
  const { id } = event?.pathParameters;
  const product = await productList.find((item) => item.id === id);
  const response = product ?? error
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (e) {
    return {
      statusCode: 404,
      body: error,
    };
  }
};
