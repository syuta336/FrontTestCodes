import { useApi } from "./useApi";
import { act, renderHook, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { handlers } from "../../mock/handler";

const server = setupServer(...handlers);
const url = "http://localhost:3002/test";

describe("useApi", () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe("GET", () => {
    it("データを取得できる", async () => {
      const { result } = renderHook(() => useApi(url));

      await waitFor(() => expect(result.current.data).not.toBeNull());
      expect(result.current.data).toEqual({ message: "Get data" });
      expect(result.current.error).toBeNull();
    });

    it("GETリクエストでエラーが発生する", async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      const { result } = renderHook(() => useApi(url));
      await waitFor(() =>
        expect(result.current.error).toBe("エラーが発生しました")
      );
    });
  });

  describe("POST", () => {
    it("POST処理が実行される", async () => {
      const { result } = renderHook(() => useApi(url));

      let response;
      await act(async () => {
        response = await result.current.postData({});
      });

      expect(response!.data).toEqual({ message: "Post data" });
    });

    it("POSTリクエストでエラーが発生する", async () => {
      server.use(
        rest.post(url, (_, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      const { result } = renderHook(() => useApi(url));
      await act(async () => {
        await result.current.postData({});
      });

      await waitFor(() =>
        expect(result.current.error).toBe("エラーが発生しました")
      );
    });
  });
});
