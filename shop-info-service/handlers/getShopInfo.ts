import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

export const getShopInfo: APIGatewayProxyHandler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      shopName: "Happy tails",
      workingHours: "24/7",
    }),
  };
};
