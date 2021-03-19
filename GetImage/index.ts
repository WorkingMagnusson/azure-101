import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const doc = context.bindings.inputDocument;
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      id: doc.id,
      uri: doc.uri,
      comments: doc.comments,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export default httpTrigger;
