import { Controller, Get, Post, Query, Param, Body } from "oak_decorators";
import { AnalysisService } from "./analysis.service.ts";

@Controller()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  get() {
    return this.analysisService.test();
  }

  @Post()
  post(@Body() body: any) {
    return body;
  }

  @Get("test/:id")
  test(@Param("id") id: string, @Query() test: any) {
    return { id, ...test };
  }
}
