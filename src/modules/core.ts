// deno-lint-ignore-file no-explicit-any
import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";
import { Router, RouterContext } from "oak";
import { bootstrap } from "inject";

export abstract class MyRouter {
  route!: Router;
  path!: string;
}

export interface CreateRouterOption {
  controllers: any[];
  providers: any[];
  routePrefix?: string;
}

type HTTPMethods = "get" | "put" | "patch" | "post" | "delete";

interface ActionMetadata {
  path: string;
  method: HTTPMethods;
  functionName: string;
}

const ACTION_KEY = Symbol("action");

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
          (route as any)[meta.method](
            `/${meta.path}`,
            (context: RouterContext<string>) => {
              context.response.body = (this as any)[meta.functionName](context);
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

export const Get = mappingFactory("get");
export const Post = mappingFactory("post");
export const Put = mappingFactory("put");
export const Patch = mappingFactory("patch");
export const Delete = mappingFactory("delete");

function mappingFactory(method: HTTPMethods) {
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

export const createRouter = ({
  controllers,
  providers,
  routePrefix,
}: CreateRouterOption) => {
  const router = new Router();
  controllers.forEach((Controller, i) => {
    const map = new Map();
    Reflect.defineMetadata("design:paramtypes", providers, Controller);
    const controller = bootstrap<any>(Controller);
    controller.init(routePrefix);
    const path = controller.path;
    const route = controller.route;
    router.use(path, route.routes(), route.allowedMethods());
  });
  return router;
};
