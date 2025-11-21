import { signalStoreFeature, withState } from "@ngrx/signals";

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
