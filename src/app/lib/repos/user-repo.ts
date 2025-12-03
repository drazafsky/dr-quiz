import { Injectable } from "@angular/core";
import { Repo } from "./repo";

export interface User {
    id: string;
    username: string;
}

@Injectable({ providedIn: 'root'})
export class UserRepo extends Repo<User[]> {
    override readonly STORAGE_KEY: string = 'USERS';
}