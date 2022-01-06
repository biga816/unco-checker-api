import { Controller, Get } from "oak_decorators";

@Controller()
export class AppController {
  @Get()
  get() {
    return { status: "ok" };
  }
}
