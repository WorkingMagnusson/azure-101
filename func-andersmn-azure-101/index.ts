import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("andersmn HTTP trigger function processed a request.");

  const msg = { text: "this is not a joke!" };

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: msg,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export default httpTrigger;
