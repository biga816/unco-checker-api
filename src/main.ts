import { Application } from "oak";
import { router } from "./router.ts";

const app = new Application();
app.use(router.routes());

await app.listen({ port: 8000 });
