import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import Product from '../src/services/product'

export const getProductList: APIGatewayProxyHandler = async () => {
  try {
    const { rows: product } = await Product.find()
    console.log("request product list:", product);
    return {
      headers: {'Access-Control-Allow-Origin': '*'},
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    console.log(error, "error");
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } finally {
    Product.end();
  }
};
