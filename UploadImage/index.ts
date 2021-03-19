import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";

const connStr = process.env.IMAGE_CONNECTION_STRING;
const blobClient = BlobServiceClient.fromConnectionString(connStr);
const containerName = "images";
const account = "andersmnimages";
const containerClient = blobClient.getContainerClient(containerName);

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const blobName = "image_" + new Date().getTime();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.upload(
    req.body,
    req.body.length
  );

  const imageURI = `${account}.blob.core.windows.net/${containerName}/${blobName}`;
  const imageHttpsURI = `https://${imageURI}`;

  context.res = {
    status: 201 /* Defaults to 200 */,
    body: {
      id: blobName,
      uri: imageHttpsURI,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
  context.bindings.outputDocument = {
    id: blobName,
    uri: imageHttpsURI,
    comments: [],
  };
  context.bindings.outputSbMsg = {
    id: blobName,
    uri: imageURI,
  };
};

export default httpTrigger;
