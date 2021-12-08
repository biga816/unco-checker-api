import { Controller, Get } from "core";

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
