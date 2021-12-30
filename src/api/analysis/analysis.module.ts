import { Module } from "core";
import { AnalysisController } from "./analysis.controller.ts";
import { AnalysisService } from "./analysis.service.ts";

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisService],
  routePrefix: "analysis",
})
export class AnalysisModule {}
