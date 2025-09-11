import type { Answer } from "../types/qna";

export default function AnswerList({ answers }: { answers: Answer[] }) {
  if (!answers?.length) return <p className="text-gray-500">아직 답변이 없습니다.</p>;
  return (
    <ul className="space-y-3">
      {answers.map(a => (
        <li key={a.id} className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">{a.author} · {new Date(a.createdAt).toLocaleString()}</div>
          <p className="mt-2 whitespace-pre-wrap">{a.content}</p>
        </li>
      ))}
    </ul>
  );
}
