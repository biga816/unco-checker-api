import { Controller, Get } from "../../modules/core.ts";

@Controller("sample")
export class SampleController {
  @Get()
  get() {
    return "ok";
  }

  @Get("test")
  test() {
    return "test";
  }
}
