import { useState } from "react";

export default function AnswerForm({ onSubmit }: { onSubmit: (content: string) => Promise<void> | void }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      setSubmitting(true);
      await onSubmit(content);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handle} className="space-y-2">
      <textarea
        className="w-full border rounded-xl p-3 min-h-[120px]"
        placeholder="답변을 입력하세요…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button disabled={submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">
        {submitting ? "작성 중…" : "답변 등록"}
      </button>
    </form>
  );
}
