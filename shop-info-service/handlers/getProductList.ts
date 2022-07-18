import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import productList from "../src/data/productList.json";
import { error } from "./constants";

export const getProductList: APIGatewayProxyHandler = async (event) => {
  const response = productList ?? error;
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(productList),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: error,
    };
  }
};
