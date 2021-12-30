import { HTTPMethods } from "../const.ts";

export interface ActionMetadata {
  path: string;
  method: HTTPMethods;
  functionName: string;
}
