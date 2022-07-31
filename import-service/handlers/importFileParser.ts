import AWS from "aws-sdk";
import csv from "csv-parser";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { BUCKET_NAME, FOLDER } from "./constants";

const { REGION } = process.env;

const createBucketReadStream = (s3, record) => {
  return s3
    .getObject({
      Bucket: BUCKET_NAME,
      Key: record.s3.object.key,
    })
    .createReadStream();
};

const deleteCopiedFile = async (s3, record) => {
  const { key } = record.s3.object;
  const params = { Bucket: BUCKET_NAME, Key: key };

  await s3
    .deleteObject(params, (err) => {
      if (err) {
        console.error(err);
      }
    })
    .promise();

  console.log(`Deleted file ${BUCKET_NAME}/${key}`);
};

const parseCsvFile = (s3, s3Stream, record) => {
  return new Promise((resolve, reject) => {
    s3Stream
      .pipe(csv())
      .on("data", (data) => {
        console.log('data:', data);
      })
      .on("end", async () => {
        console.log(
          `Copy from ${BUCKET_NAME}/${record.s3.object.key}`
        );

        const filePath = record.s3.object.key.replace(
          FOLDER.UPLOADED_FILES,
          FOLDER.PARSED_FILES
        );

        await s3
          .copyObject({
            Bucket: BUCKET_NAME,
            CopySource: `${BUCKET_NAME}/${record.s3.object.key}`,
            Key: filePath,
          })
          .promise();

        console.log(`Copied into ${BUCKET_NAME}/${filePath}`);
        await deleteCopiedFile(s3, record);
        resolve();
      })
      .on("error", (e) => {
        reject(e);
      });
  });
};

export const importFileParser = async (event) => {
  console.log(event);
  const s3 = new AWS.S3({ region: REGION });
  const records = event.Records.filter((record) => record.s3.object.size);

  try {
    for (const record of records) {
      console.log("importFileParser record", JSON.stringify(record));
      const s3Stream = createBucketReadStream(s3, record);
      await parseCsvFile(s3, s3Stream, record);
    }
  } catch (err) {
    console.error(err);
  }
};
