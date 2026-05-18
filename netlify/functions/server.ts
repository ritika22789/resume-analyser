import { createRequestHandler } from "@react-router/node";
// @ts-ignore — built output
import * as build from "../../build/server/index.js";

const handler = createRequestHandler(build);

export default async (req: Request) => {
    return handler(req);
};

export const config = { path: "/server" };
