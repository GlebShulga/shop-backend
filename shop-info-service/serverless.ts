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
      PG_HOST: DATABASE_HOST,
      PG_PORT: DATABASE_PORT,
      PG_USER: DATABASE_USERNAME,
      PG_PASSWORD: DATABASE_PASSWORD,
      PG_DATABASE: DATABASE_NAME,
    },
    region: "eu-west-1",
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
};

module.exports = serverlessConfiguration;
