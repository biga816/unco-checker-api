import { createRouter } from "core";

import { SampleController } from "./api/sample/sample.controller.ts ";

export const router = createRouter({
  controllers: [SampleController],
  routePrefix: "v1",
});
