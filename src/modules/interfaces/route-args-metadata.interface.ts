import { RouteParamtypes } from "../enums/route-paramtypes.enum.ts";
export type ParamData = object | string | number;

export interface RouteArgsMetadata {
  paramtype: RouteParamtypes;
  index: number;
  data?: ParamData;
}
