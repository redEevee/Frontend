import { useMemo, useState } from "react";
import { useQnaList } from "../hooks/useQna";
import { Link } from "react-router-dom";

export default function QnaList() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<string | null>("createdAt,desc");

  const { data, loading, error, refetch } = useQnaList({ page, size: 10, category, sort });

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.size));
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
      {/* 헤더 */}
      <header className="flex flex-wrap items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold mr-auto">Q&amp;A</h1>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={category ?? ""}
          onChange={(e) => {
            const v = e.target.value || null;
            setCategory(v);
            setPage(1);
            refetch(1);
          }}
        >
          <option value="">전체 카테고리</option>
          <option value="general">일반</option>
          <option value="react">React</option>
          <option value="spring">Spring</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={sort ?? ""}
          onChange={(e) => {
            const v = e.target.value || null;
            setSort(v);
            setPage(1);
            refetch(1);
          }}
        >
          <option value="">기본 정렬</option>
          <option value="createdAt,desc">최신순</option>
          <option value="createdAt,asc">오래된순</option>
          <option value="id,desc">ID 내림차순</option>
          <option value="id,asc">ID 오름차순</option>
        </select>

        {/* 글쓰기 버튼 */}
        <Link
          to="/qna/new"
          className="ml-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
        >
          글쓰기
        </Link>
      </header>

      {/* 로딩 / 에러 */}
      {loading && <div>불러오는 중…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {/* 목록 */}
      <ul className="space-y-3">
        {data?.items.map((q) => (
          <li key={q.id} className="bg-white border rounded-xl p-4 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between gap-4">
              {/* 제목을 상세 링크로 */}
              <Link to={`/qna/${q.id}`} className="font-semibold text-lg hover:underline">
                {q.title}
              </Link>
              {q.category && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {q.category}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              사용자 #{q.userId} · {new Date(q.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 */}
      {data && (
        <div className="flex items-center gap-2 justify-center mt-6">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1 || loading}
            onClick={() => {
              const n = Math.max(1, page - 1);
              setPage(n);
              refetch(n);
            }}
          >
            이전
          </button>
          <span className="text-sm">
            {data.page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page >= totalPages || loading}
            onClick={() => {
              const n = Math.min(totalPages, page + 1);
              setPage(n);
              refetch(n);
            }}
          >
            다음
          </button>
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && data && data.items.length === 0 && (
        <div className="text-gray-500 py-10 text-center">결과가 없습니다.</div>
      )}
    </div>
  );
}
