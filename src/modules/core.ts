// deno-lint-ignore-file no-explicit-any
import "https://esm.sh/reflect-metadata";
import { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";

export abstract class MyRouter {
  route!: Router;
  path!: string;
}

export interface CreateRouterOption {
  controllers: any[];
  routePrefix?: string;
}

type HTTPMethods =
  | "head"
  | "options"
  | "get"
  | "put"
  | "patch"
  | "post"
  | "delete";
interface ActionMetadata {
  path: string;
  method: HTTPMethods;
  functionName: string;
}

const ACTION_KEY = Symbol("action");

export function Controller(path: string) {
  return (fn: new (routePrefix?: string) => any): any =>
    class extends fn {
      constructor(routePrefix?: string) {
        super(routePrefix);
        const prefix = routePrefix ? `/${routePrefix}` : "";
        this.path = `${prefix}/${path}`;
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
        });

        this.route = route;
      }
    };
}

export const Get = mappingFactory("get");
export const Post = mappingFactory("post");

function mappingFactory(method: ActionMetadata["method"]) {
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
  routePrefix,
}: CreateRouterOption) => {
  const router = new Router();
  controllers.forEach((Controller: new (routePrefix?: string) => MyRouter) => {
    const { route, path } = new Controller(routePrefix);
    router.use(path, route.routes(), route.allowedMethods());
  });
  return router;
};
