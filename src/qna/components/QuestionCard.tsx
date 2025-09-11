import { Link } from "react-router-dom";
import type { QuestionSummary } from "../types/qna";

export default function QuestionCard({ q }: { q: QuestionSummary }) {
  return (
    <li className="border rounded-xl p-4 hover:bg-gray-50 transition">
      <Link to={`/qna/${q.id}`} className="font-semibold text-lg">{q.title}</Link>
      <div className="text-sm text-gray-500 mt-1">
        {q.author} · {new Date(q.createdAt).toLocaleString()} · 답변 {q.answerCount}
      </div>
    </li>
  );
}
