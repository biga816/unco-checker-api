// deno-lint-ignore-file no-explicit-any
import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";
import { Router, RouterContext, helpers } from "oak";
import { bootstrap } from "inject";

import {
  ActionMetadata,
  CreateRouterOption,
  RouteArgsMetadata,
} from "./interfaces/mod.ts";
import { RouteParamtypes } from "./enums/route-paramtypes.enum.ts";
import { ACTION_KEY, ROUTE_ARGS_METADATA, HTTPMethods } from "./const.ts";

export function Controller<T extends { new (...instance: any[]): Object }>(
  path: string
) {
  return (fn: T): any =>
    class extends fn {
      private _path?: string;
      private _route?: Router;

      init(routePrefix?: string) {
        const prefix = routePrefix ? `/${routePrefix}` : "";
        this._path = `${prefix}/${path}`;
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
          console.log(
            `Mapped: [${meta.method.toUpperCase()}]${this.path}/${meta.path}`
          );
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

export const Get = mappingMethod("get");
export const Post = mappingMethod("post");
export const Put = mappingMethod("put");
export const Patch = mappingMethod("patch");
export const Delete = mappingMethod("delete");

function mappingMethod(method: HTTPMethods) {
  return (path = "") =>
    (target: any, functionName: string, _: PropertyDescriptor) => {
      const meta: ActionMetadata = { path, method, functionName };
      addMetadata(meta, target, ACTION_KEY);
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

export const createRouter = ({
  controllers,
  providers,
  routePrefix,
}: CreateRouterOption) => {
  const router = new Router();
  controllers.forEach((Controller) => {
    Reflect.defineMetadata("design:paramtypes", providers, Controller);
    const controller = bootstrap<any>(Controller);
    controller.init(routePrefix);
    const path = controller.path;
    const route = controller.route;
    router.use(path, route.routes(), route.allowedMethods());
  });
  return router;
};
