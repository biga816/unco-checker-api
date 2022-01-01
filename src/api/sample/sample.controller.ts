import { Controller, Get, Headers, Request } from "core";

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
