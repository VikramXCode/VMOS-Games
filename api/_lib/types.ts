import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";

export type ApiRequest = IncomingMessage & {
  method?: string;
  headers: IncomingHttpHeaders;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

export type ApiResponse = ServerResponse<IncomingMessage> & {
  status: (code: number) => ApiResponse;
  json: (payload: unknown) => void;
};
