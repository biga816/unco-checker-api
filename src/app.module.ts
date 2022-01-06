import { Module } from "oak_decorators";
import { AppController } from "./app.controller.ts";
import { AnalysisModule } from "./api/analysis/analysis.module.ts";
import { SamplesModule } from "./api/sample/sample.module.ts";

@Module({
  modules: [AnalysisModule, SamplesModule],
  controllers: [AppController],
  routePrefix: "v1",
})
export class AppModule {}
