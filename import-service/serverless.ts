import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "eu-west-1",
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      BUCKET: "aws-pet-shop-import-service",
      REGION: '${self:provider.region}',
    },
    iam: {
      role: {
        name: 'access-to-imported-bucket-${self:provider.stage}-role',
        statements: [
          {
            Effect: "Allow",
            Action: "s3:ListBucket",
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
            Resource: ["arn:aws:s3:::${self:provider.environment.BUCKET}/*"]
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    importProductFile: {
      handler: "handler.importProductsFile",
      events: [
        {
          http: {
            method: "get",
            path: "/import",
            request: {
              parameters: {
                querystrings: {
                  name: true,
                },
              },
            },
          },
        },
      ],
    },
    importFileParser: {
            handler: "handler.importFileParser",
      events: [
    {
      s3: {
        bucket: '${self:provider.environment.BUCKET}',
        event: "s3:ObjectCreated:*",
        existing: true,
        rules: [
          { prefix: "uploaded/"},
        ]
      }
    }
  ]
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    autoswagger: {
      title: "Product service",
      apiType: "http",
      schemes: ["https", "http"],
      basePath: '/${self:provider.stage}',
      generateSwaggerOnDeploy: false,
    },
    stages: ["dev", "prod"],
  },
  resources: {
    Resources: {
      ShopNodejsImportServiceBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: '${self:provider.environment.BUCKET}',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ["GET", "HEAD", "PUT", "POST"],
                AllowedOrigins: ["*"],
                AllowedHeaders: ["*"],
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
