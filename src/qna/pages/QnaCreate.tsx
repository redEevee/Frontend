import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function QnaCreate() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = title.trim() && content.trim();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    try {
      setLoading(true);
      setError(null);
      const { data: id } = await api.post<number>("/qna/questions", {
        title: title.trim(),
        content: content.trim(),
        category: category.trim() || null,
      });
      // 등록 후 상세로 이동 (원하면 /qna로)
      nav(`/qna/${id}`, { replace: true });
    } catch (e: any) {
      const msg = e?.response?.data?.message || `${e?.response?.status || ""} ${e?.message || "요청 실패"}`;
      setError(`등록에 실패했습니다: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-12">
      <h1 className="text-2xl font-bold mb-6">질문 작성</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input className="w-full border rounded-lg px-3 py-2" maxLength={200}
                 value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">카테고리 (선택)</label>
          <input className="w-full border rounded-lg px-3 py-2" maxLength={50}
                 value={category} onChange={e => setCategory(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea className="w-full border rounded-lg px-3 py-2" rows={12} maxLength={10000}
                    value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex gap-2">
          <button type="button" className="px-4 py-2 border rounded-lg" onClick={() => nav(-1)}>취소</button>
          <button type="submit" disabled={!canSubmit || loading}
                  className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 disabled:opacity-50">
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
