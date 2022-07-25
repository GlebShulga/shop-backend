import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import Product from "../src/services/product";

export const createProduct: APIGatewayProxyHandler = async (event) => {
  const { title, description, price, count } = event.body;
  try {
    console.log("request to create product", event.body);
    await Product.create(title, description, price, count);
    return "Product created"
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } finally {
    Product.end();
  }
};
