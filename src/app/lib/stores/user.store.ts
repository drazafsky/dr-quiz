import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { User, UserRepo } from "../repos/user-repo";
import { computed, inject } from "@angular/core";

type UserState = {
  users: User[];
  loggedInUser: User | undefined;
};

const initialState: UserState = {
  users: [],
  loggedInUser: undefined
};

export const UserStore = signalStore(
  withState(initialState),
  withMethods((state) => {
    return {
        login: (userName: string | undefined) => {
            const loggedInUser = state.users().find(user => user.username === userName);
            if (loggedInUser && loggedInUser?.id) {
                console.log(`Logging in user: `, loggedInUser);
                patchState(state, { loggedInUser: { ...loggedInUser } });
            }
        }
    }
  }),
  withHooks((state, userRepo = inject(UserRepo)) => {
    return {
      onInit() {
        const users = userRepo.getItem();
        if (users !== null) {
          patchState(state, { users });
        } else {
          patchState(state, { users: [] });
        }
      },

      onDestroy() {
        const users = userRepo.getItem();
        if (users !== null) {
          userRepo.setItem(users);
        } else {
          userRepo.removeItem();
        }
      },
    };
  })
);