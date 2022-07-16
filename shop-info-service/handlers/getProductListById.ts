import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import productList from "../src/data/productList.json";

export const getProductListById: APIGatewayProxyHandler = async (productId: string) => {
  const product = await productList.find(item => item.id === productId)
  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};
