import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import Product from "../src/services/product";

export const createProduct: APIGatewayProxyHandler = async (event) => {
  const { title, description, price, count } = event.body;
  try {
    console.log("request to create product", event.body);
    const productId = await Product.create(title, description, price, count);
    return `Product ${productId} created`;
  } catch (error) {
    const statusCode = error.statusCode || HttpCode.SERVER_ERROR;
    return {
      statusCode: statusCode,
      body: JSON.stringify(error.message),
    };
  } finally {
    Product.end();
  }
};
