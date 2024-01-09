import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("http://localhost:3002/test", () => {
    return HttpResponse.json({ message: "Get data" });
  }),
  http.post("http://localhost:3002/test", () => {
    return HttpResponse.json({ message: "Post data" });
  }),
];
