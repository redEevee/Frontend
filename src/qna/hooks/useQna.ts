import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import type { SpringPage } from "../types/spring";
import type { Paginated, QuestionListItem, QuestionResponse } from "../types/qna";
import { mapQuestionPage } from "../utils/pageMapper";

export function useQnaList(params: {
  page?: number;       // 1-base
  size?: number;
  category?: string | null;
  sort?: string | null; // e.g. "createdAt,desc"
}) {
  const { page = 1, size = 10, category, sort } = params;

  const [data, setData] = useState<Paginated<QuestionListItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const fetchList = useCallback(async (nextPage = page) => {
    try {
      setLoading(true);
      const res = await api.get<SpringPage<QuestionResponse>>("/qna/questions", {
        params: {
          page: Math.max(0, nextPage - 1),
          size,
          category: category || undefined,
          sort:     sort || undefined,
        },
      });
      setData(mapQuestionPage(res.data));
      setError(null);
    } catch (e: any) {
      console.error("[QNA LIST ERROR]", {
        status: e?.response?.status,
        data: e?.response?.data,
        url: e?.config?.url,
        params: e?.config?.params,
        message: e?.message,
      });
      const msg = e?.response?.data?.message || `${e?.response?.status || ""} ${e?.message || "요청 실패"}`;
      setError(`목록을 불러오지 못했습니다: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [page, size, category, sort]);

  useEffect(() => { fetchList(page); }, [fetchList, page, category, sort]);

  return { data, loading, error, refetch: fetchList };
}
