import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";
import { ActionMetadata, HTTPMethods } from "../interfaces/mod.ts";
import { METHOD_METADATA } from "../const.ts";

export const Get = mappingMethod("get");
export const Post = mappingMethod("post");
export const Put = mappingMethod("put");
export const Patch = mappingMethod("patch");
export const Delete = mappingMethod("delete");

function mappingMethod(method: HTTPMethods) {
  return (path = "") =>
    (target: any, functionName: string, _: PropertyDescriptor) => {
      const meta: ActionMetadata = { path, method, functionName };
      addMetadata(meta, target, METHOD_METADATA);
    };
}

function addMetadata<T>(value: T, target: any, key: symbol) {
  const list = Reflect.getMetadata(key, target);
  if (list) {
    list.push(value);
    return;
  }
  Reflect.defineMetadata(key, [value], target);
}
