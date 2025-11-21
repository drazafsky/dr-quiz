import { signalStoreFeature, withState } from "@ngrx/signals";

export const withSaveStatusFeature = () => {
  return signalStoreFeature(
    withState<{ save: { success: boolean | undefined, error: boolean | undefined} }>({
      save: {
        success: undefined,
        error: undefined
      }
    }),
  );
};

export function setSuccess() {
  return {
    save: {
        success: true,
        error: undefined
        }
    };
}

export function stopError() {
  return {
    save: {
        success: undefined,
        error: true
        }
    };
}

export function clearSaveStatus() {
  return {
    save: {
        success: undefined,
        error: undefined
        }
    };
}
