import { Injectable } from "@angular/core";
import { Repo } from "./repo";
import { Test } from "../types/test";

@Injectable({ providedIn: 'root' })
export class TestRepo extends Repo<Test[]> {
  override readonly STORAGE_KEY: string = 'TESTS';
}
