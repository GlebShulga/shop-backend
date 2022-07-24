import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import Product from "../src/services/product";
import { ERROR } from "./constants";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;
  try {
    console.log('request product by id -', id)
    const { rows: product } = await Product.findOneBy(id);
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(ERROR),
    };
  }
};
