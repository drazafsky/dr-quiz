import { computed } from "@angular/core";
import { signalStoreFeature, withComputed, withState } from "@ngrx/signals";

export const withLoadingFeature = () => {
  return signalStoreFeature(
    withState<{ loading: boolean }>({
      loading: false,
    }),
  );
};

export function setLoading() {
  return { loading: true };
}

export function stopLoading() {
  return { loading: false };
}
