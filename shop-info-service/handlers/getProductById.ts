import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import productList from "../src/data/productList.json";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { id } = event?.pathParameters;
  const product = await productList.find(item => item.id === id)
  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};
