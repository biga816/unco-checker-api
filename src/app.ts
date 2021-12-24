import { Application as OakApplication } from "oak";
import { Bootstrapped } from "inject";

@Bootstrapped()
export class Application extends OakApplication {}
