import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import Product from "../src/services/product";
import { HttpCode, HttpError } from "../src/utils/http.utils";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;
  try {
    console.log("request product by id -", id);
    const { rows: product } = await Product.findOneBy(id);

    if (!product) {
      throw new HttpError(
        HttpCode.NOT_FOUND,
        `Product with id: ${id} was not found`
      )
    }

    return {
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: 200,
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
