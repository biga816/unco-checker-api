import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";
import {
  isNotEmpty,
  isString,
} from "https://deno.land/x/deno_class_validator@v1.0.0/mod.ts";
import { RouteParamtypes } from "../enums/mod.ts";
import { ROUTE_ARGS_METADATA } from "../const.ts";
import { RouteArgsMetadata, ParamData } from "../interfaces/mod.ts";

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export interface RouteParamMetadata {
  index: number;
  data?: ParamData;
}

export function assignMetadata(
  args: RouteArgsMetadata[],
  paramtype: RouteParamtypes,
  index: number,
  data?: ParamData
) {
  args.push({
    paramtype,
    index,
    data,
  });
  return args;
}

export function Query(property?: string): ParameterDecorator {
  return createPipesRouteParamDecorator(RouteParamtypes.QUERY)(property);
}

export function Param(property?: string): ParameterDecorator {
  return createPipesRouteParamDecorator(RouteParamtypes.PARAM)(property);
}

export function Body(property?: string): ParameterDecorator {
  return createPipesRouteParamDecorator(RouteParamtypes.BODY)(property);
}

const createPipesRouteParamDecorator =
  (paramtype: RouteParamtypes) =>
  (data?: any): ParameterDecorator =>
  (target, key, index) => {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, key) || [];
    const hasParamData = isNotEmpty(data) || isString(data);
    const paramData = hasParamData ? data : undefined;

    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      assignMetadata(args, paramtype, index, paramData),
      target,
      key
    );
  };
