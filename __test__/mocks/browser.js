import { testJson } from "./testData";
import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";

// Describe network behavior with request handlers
const worker = setupWorker(
    http.get("example.com/api*", (request, response, context) => {
        return HttpResponse.json(
            {
                data: testJson,
            },
            {
                status: 202,
                statusText: "Mocked status",
            }
        );
    }),
    http.get("https://cdn.com/image/v2/*", (request) => {
        return new HttpResponse(new Blob(["testing"], { type: "image/png" }));
    }),
    http.get("*", (request) => {
        return null;
    })
);

export { worker };
