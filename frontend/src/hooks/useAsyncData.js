import { useEffect, useState } from 'react';

export function useAsyncData(fetcher, dependencies = []) {
  const [state, setState] = useState({ data: undefined, loading: true, error: null });

  useEffect(() => {
    let active = true;

    setState((current) => ({ ...current, loading: true, error: null }));

    Promise.resolve()
      .then(() => fetcher())
      .then((data) => {
        if (active) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (active) {
          setState({ data: null, loading: false, error });
        }
      });

    return () => {
      active = false;
    };
  }, dependencies);

  return state;
}