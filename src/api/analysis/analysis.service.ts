import { Injectable } from "inject";

@Injectable()
export class AnalysisService {
  test() {
    return { value: 123, status: "ok" };
  }
}
