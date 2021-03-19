import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const doc = context.bindings.inputDocument;
  const thumbnails = [];

  for (const image of doc) {
    if (image.thumbnail) {
      thumbnails.push({
        id: image.id,
        uri: image.thumbnail,
      });
    }
  }
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: thumbnails,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export default httpTrigger;
