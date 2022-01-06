import { Module } from "oak_decorators";
import { SampleController } from "./sample.controller.ts";

@Module({
  controllers: [SampleController],
})
export class SamplesModule {}
