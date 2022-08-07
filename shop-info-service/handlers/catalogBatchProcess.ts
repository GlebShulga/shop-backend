import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import Product from "../src/services/product";

export const catalogBatchProcess: APIGatewayProxyHandler = async (event) => {
  const { title, description, price, count } = event.body;
  try {
    console.log("Records", event.body);
    const productId = await Product.create(title, description, price, count);
    if (productId) {
      const input = {
        Subject: "Product was added to the DB",
        Message: JSON.stringify(event.body),
        TopicArn: SNS_ARN,
      };

      const command = new PublishCommand(input);
      const snsClient = new SNSClient({ region: "eu-west-1" });
      await snsClient.send(command);
    }
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
