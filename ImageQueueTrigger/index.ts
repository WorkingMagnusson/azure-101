import { AzureFunction, Context } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import resizeImg from "resize-img";

const connStr = process.env.IMAGE_CONNECTION_STRING;
const blobClient = BlobServiceClient.fromConnectionString(connStr);
const containerName = "images";
const account = "andersmnimages";
const containerClient = blobClient.getContainerClient(containerName);

const thumbnailContainerName = "thumbnails";
const thumbnailContainerClient = blobClient.getContainerClient(
  thumbnailContainerName
);

const serviceBusQueueTrigger: AzureFunction = async function (
  context: Context,
  mySbMsg: any
): Promise<void> {
  context.log("ServiceBus queue trigger function processed message", mySbMsg);

  const imageBlobName = mySbMsg.id;
  const blockBlobClient = containerClient.getBlockBlobClient(imageBlobName);
  const blob = await blockBlobClient.download();
  const buffer = await streamToBuffer(blob.readableStreamBody);
  // resize image
  const resizedImage = await resizeImg(buffer, {
    width: 128,
    height: 128,
  });

  const thumbnailBlobName = `thumbnail_${imageBlobName}`;
  const thumbnailClient = thumbnailContainerClient.getBlockBlobClient(
    thumbnailBlobName
  );

  await thumbnailClient.upload(resizedImage, resizedImage.length);

  let doc = context.bindings.inputDocument;
  const thumnailURI = `${account}.blob.core.windows.net/${thumbnailContainerName}/${thumbnailBlobName}`;
  const imageHttpsURI = `https://${thumnailURI}`;

  doc.thumbnail = imageHttpsURI;
  context.bindings.outputDocument = doc;
};

export default serviceBusQueueTrigger;

// A helper method used to read a Node.js readable stream into a Buffer
const streamToBuffer = async (
  readableStream: NodeJS.ReadableStream
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
};
