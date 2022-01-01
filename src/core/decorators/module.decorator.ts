import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";
import { CreateRouterOption } from "../interfaces/mod.ts";
import { MODULE_METADATA } from "../const.ts";

export function Module<T extends { new (...instance: any[]): Object }>(
  data: CreateRouterOption
) {
  return (fn: T): any => {
    Reflect.defineMetadata(MODULE_METADATA, data, fn.prototype);
  };
}
