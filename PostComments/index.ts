import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const doc = context.bindings.inputDocument;
  const text = req.body.text;

  if (!doc.comments && doc.comment.length === 0) {
    doc.comments = [];
  }

  const comment = {
    text: text,
    datetime: new Date().toISOString(),
  };
  doc.comments.push(comment);

  context.res = {
    status: 201 /* Defaults to 200 */,
    body: comment,
    headers: {
      "Content-Type": "application/json",
    },
  };

  context.bindings.outputDocument = doc;
};

export default httpTrigger;
