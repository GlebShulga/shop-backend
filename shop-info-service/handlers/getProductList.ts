import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import Product from '../src/services/product'
import { HttpCode } from "../src/utils/http.utils";

export const getProductList: APIGatewayProxyHandler = async () => {
  try {
    const { rows: product } = await Product.find()
    console.log("request product list:", product);
    return {
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: HttpCode.OK,
      body: JSON.stringify(product),
    };
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
