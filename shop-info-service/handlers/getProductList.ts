import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import productList from '../src/data/productList.json'

export const getProductList: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(productList),
  };
};
