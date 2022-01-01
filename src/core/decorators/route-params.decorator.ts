import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";
import {
  isNotEmpty,
  isString,
} from "https://deno.land/x/deno_class_validator@v1.0.0/mod.ts";
import { RouteParamtypes } from "../enums/mod.ts";
import { ROUTE_ARGS_METADATA } from "../const.ts";
import { RouteArgsMetadata, ParamData } from "../interfaces/mod.ts";

function createPipesRouteParamDecorator(paramtype: RouteParamtypes) {
  return (data?: ParamData): ParameterDecorator =>
    (target, key, index) => {
      const args: RouteArgsMetadata[] =
        Reflect.getMetadata(ROUTE_ARGS_METADATA, target, key) || [];
      const hasParamData = isNotEmpty(data) || isString(data);
      const paramData = hasParamData ? data : undefined;

      args.push({
        paramtype,
        index,
        data: paramData,
      });

      Reflect.defineMetadata(ROUTE_ARGS_METADATA, args, target, key);
    };
}

export function Request(property?: string): ParameterDecorator {
  return createPipesRouteParamDecorator(RouteParamtypes.REQUEST)(property);
}

export function Response(property?: string): ParameterDecorator {
  return createPipesRouteParamDecorator(RouteParamtypes.RESPONSE)(property);
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

export function Headers(property?: string): ParameterDecorator {
  return createPipesRouteParamDecorator(RouteParamtypes.HEADERS)(property);
}
