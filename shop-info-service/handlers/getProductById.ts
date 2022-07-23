import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import productList from "../src/data/productList.json";
import { ERROR } from "./constants";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { id } = event?.pathParameters;
  const product = await productList.find((item) => item.id === id);
  const response = product ?? ERROR;
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: error,
    };
  }
};
