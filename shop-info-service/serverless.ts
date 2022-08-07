import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: "shop-info-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PG_HOST: "${env:DATABASE_HOST}",
      PG_PORT: "${env:DATABASE_PORT}",
      PG_USER: "${env:DATABASE_USER}",
      PG_PASSWORD: "${env:DATABASE_PASSWORD}",
      PG_DATABASE: "${env:DATABASE_NAME}",
      SNS_ARN: {
        Ref: "createProductTopic",
      },
    },
    region: "eu-west-1",
    stage: "dev",
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "sqs:*",
            Resource: { "Fn::GetAtt": ["catalogItemsQueue", "Arn"] },
          },
          {
            Effect: "Allow",
            Action: "sns:*",
            Resource: {
              Ref: "createProductTopic",
            },
          },
        ],
      },
    },
  },

  functions: {
    getProductList: {
      handler: "handler.getProductList",
      events: [
        {
          http: {
            method: "get",
            path: "/products",
            cors: true,
          },
        },
      ],
    },
    getProductById: {
      handler: "handler.getProductById",
      events: [
        {
          http: {
            method: "get",
            path: "/products/{id}",
            cors: true,
          },
        },
      ],
    },
    createProduct: {
      handler: "handler.createProduct",
      events: [
        {
          http: {
            method: "post",
            path: "/products",
            cors: true,
          },
        },
      ],
    },
    catalogBatchProcess: {
      handler: "handler.catalogBatchProcess",
      events: [
        {
          sqs: {
            arn: {
              "Fn::GetAtt": ["catalogItemsQueue", "Arn"],
            },
            batchSize: 5,
            maximumBatchingWindow: 60,
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk", "pg-native"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "sqs-sns-service-catalogItemsQueue",
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "shop-sns-topic",
        },
      },
      createProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "kromeshnik05@gmail.com",
          Protocol: "email",
          TopicArn: {
            Ref: "createProductTopic",
          },
        },
      },
    },
    Outputs: {
      catalogItemsQueueUrl: {
        Description: "SQS URL",
        Value: { Ref: "catalogItemsQueue" },
        Export: {
          Name: "catalogItemsQueueUrl-dev",
        },
      },
      catalogItemsQueueArn: {
        Description: "SQS Arn value",
        Value: { "Fn::GetAtt": ["catalogItemsQueue", "Arn"] },
        Export: {
          Name: "catalogItemsQueueArn-dev",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
