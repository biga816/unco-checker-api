import { RouteParamtypes } from "../enums/mod.ts";
export type ParamData = object | string | number;

export interface RouteArgsMetadata {
  paramtype: RouteParamtypes;
  index: number;
  data?: ParamData;
}
