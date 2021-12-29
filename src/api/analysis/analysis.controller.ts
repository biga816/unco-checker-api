import { Controller, Get, Post } from "core";
import {
  Query,
  Param,
  Body,
} from "../../modules/decorators/route-params.decorator.ts";
import { AnalysisService } from "./analysis.service.ts";

@Controller("analysis")
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
