import { Controller, Get } from "core";

@Controller()
export class AppController {
  @Get()
  get() {
    return { status: "ok" };
  }
}
