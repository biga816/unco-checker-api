import { Controller, Get } from "core";
import {
  Query,
  Param,
} from "../../modules/decorators/route-params.decorator.ts";
import { RouterContext, helpers } from "oak";
import { AnalysisService } from "./analysis.service.ts";

@Controller("analysis")
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  get() {
    return this.analysisService.test();
  }

  @Get("test/:id")
  test(@Param("id") id: string, @Query() test: any) {
    console.log("id:", id);
    console.log("test:", test);
    return "test!!";
  }
}
