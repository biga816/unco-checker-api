import { createRouter } from "core";

import { SampleController } from "./api/sample/sample.controller.ts ";
import { AnalysisController } from "./api/analysis/analysis.controller.ts";

import { AnalysisService } from "./api/analysis/analysis.service.ts";

export const router = createRouter({
  controllers: [SampleController, AnalysisController],
  providers: [AnalysisService],
  routePrefix: "v1",
});
