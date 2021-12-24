import { Controller, Get } from "core";
import { AnalysisService } from "./analysis.service.ts";

@Controller("analysis")
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  get() {
    return this.analysisService.test();
  }

  @Get("test")
  test() {
    return "test!!";
  }
}
