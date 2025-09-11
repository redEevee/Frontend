import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../hooks/useQna";

export default function QnaAsk() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      setSubmitting(true);
      const res = await createQuestion({
        title, content,
        tags: tags.split(",").map(s => s.trim()).filter(Boolean),
      });
      nav(`/qna/${res.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">질문 등록</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded-lg p-2" placeholder="제목"
               value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea className="w-full border rounded-lg p-3 min-h-[200px]" placeholder="내용"
                  value={content} onChange={(e)=>setContent(e.target.value)} />
        <input className="w-full border rounded-lg p-2" placeholder="태그(쉼표로 구분, 예: 강아지,고양이)"
               value={tags} onChange={(e)=>setTags(e.target.value)} />
        <button disabled={submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">
          {submitting ? "등록 중…" : "등록"}
        </button>
      </form>
    </div>
  );
}
