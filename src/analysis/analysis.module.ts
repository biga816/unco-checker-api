import { Module } from "oak_decorators";
import { AnalysisController } from "./analysis.controller.ts";
import { AnalysisService } from "./analysis.service.ts";

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisService],
  routePrefix: "analysis",
})
export class AnalysisModule {}
