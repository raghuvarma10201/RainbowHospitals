import { useState, useCallback } from 'react';

type UsePaginatedListProps<T> = {
  fetchFn: (page: number) => Promise<{ List: T[]; TotalRows: number }>;
  pageSize?: number;
};

export function usePaginatedList<T>({ fetchFn, pageSize = 10 }: UsePaginatedListProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPage = useCallback(
    async (pageToLoad: number, isRefresh = false) => {
      if (loading || refreshing) return;

      try {
        isRefresh ? setRefreshing(true) : setLoading(true);

        const res = await fetchFn(pageToLoad);
        const newList = res.List || [];

        setTotal(res.TotalRows || 0);
        setPage(pageToLoad);
        setData(prev =>
          isRefresh || pageToLoad === 1 ? newList : [...prev, ...newList]
        );
      } catch (error) {
        console.error('Pagination fetch error:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchFn, loading, refreshing]
  );

  const loadNextPage = () => {
    if (data.length < total) {
      loadPage(page + 1);
    }
  };

  const refresh = () => loadPage(1, true);

  return {
    data,
    total,
    page,
    loading,
    refreshing,
    loadNextPage,
    refresh,
    reload: () => loadPage(1),
  };
}
