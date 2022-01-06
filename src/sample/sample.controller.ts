import { Controller, Get, Headers } from "oak_decorators";

@Controller("sample")
export class SampleController {
  @Get()
  get(@Headers("user-agent") userAgent: string) {
    return userAgent;
  }

  @Get("test")
  test() {
    return "test";
  }
}
