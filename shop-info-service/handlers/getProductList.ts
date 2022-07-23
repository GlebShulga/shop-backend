import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import Product from '../src/services/product'

export const getProductList: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("request product list");
    const { rows: product } = await Product.find()
    Product.end();
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } finally {
    Product.end();
  }
};
