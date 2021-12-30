// deno-lint-ignore-file no-explicit-any
import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";
import { Router, RouterContext, helpers } from "oak";

import { ActionMetadata, RouteArgsMetadata } from "../interfaces/mod.ts";
import { RouteParamtypes } from "../enums/mod.ts";
import { ACTION_KEY, ROUTE_ARGS_METADATA } from "../const.ts";

export function Controller<T extends { new (...instance: any[]): Object }>(
  path?: string
) {
  return (fn: T): any =>
    class extends fn {
      private _path?: string;
      private _route?: Router;

      init(routePrefix?: string) {
        const prefix = routePrefix ? `/${routePrefix}` : "";
        this._path = prefix + (path ? `/${path}` : "");
        const route = new Router();
        const list: ActionMetadata[] = Reflect.getMetadata(
          ACTION_KEY,
          fn.prototype
        );

        list.forEach((meta) => {
          const argsMetadataList: RouteArgsMetadata[] =
            Reflect.getMetadata(
              ROUTE_ARGS_METADATA,
              fn.prototype,
              meta.functionName
            ) || [];

          (route as any)[meta.method](
            `/${meta.path}`,
            async (context: RouterContext<string>) => {
              const inputs = await Promise.all(
                argsMetadataList
                  .sort((a, b) => a.index - b.index)
                  .map(async (data) => getContextData(data, context))
              );
              context.response.body = (this as any)[meta.functionName](
                ...inputs
              );
            }
          );

          const fullPath = this.path + (meta.path ? `/${meta.path}` : "");
          console.log(`Mapped: [${meta.method.toUpperCase()}]${fullPath}`);
        });

        this._route = route;
      }

      get path(): string | undefined {
        return this._path;
      }

      get route(): Router | undefined {
        return this._route;
      }
    };
}

function getContextData(args: RouteArgsMetadata, ctx: RouterContext<string>) {
  const { paramtype, data } = args;

  switch (paramtype) {
    case RouteParamtypes.QUERY:
      const query = helpers.getQuery(ctx);
      return data ? query[data.toString()] : query;
    case RouteParamtypes.PARAM:
      const params = ctx.params;
      return data ? params[data.toString()] : params;
    case RouteParamtypes.BODY:
      const body = ctx.request.body();
      return body.value;
    default:
      return;
  }
}
