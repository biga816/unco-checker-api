import { Module } from "core";
import { SampleController } from "./sample.controller.ts";

@Module({
  controllers: [SampleController],
})
export class SamplesModule {}
