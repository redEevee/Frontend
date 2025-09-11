import { useParams } from "react-router-dom";
import { useQnaDetail } from "../hooks/useQna";
import AnswerList from "../components/AnswerList";
import AnswerForm from "../components/AnswerForm";

export default function QnaDetail() {
  const { id } = useParams();
  const { data, loading, error, createAnswer } = useQnaDetail(id);

  if (loading) return <div className="max-w-3xl mx-auto p-6">불러오는 중…</div>;
  if (error) return <div className="max-w-3xl mx-auto p-6 text-red-600">{error}</div>;
  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <div className="text-sm text-gray-500 mt-1">
          {data.author} · {new Date(data.createdAt).toLocaleString()}
        </div>
        <div className="mt-4 whitespace-pre-wrap">{data.content}</div>
        {!!data.tags?.length && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {data.tags.map(t => <span key={t} className="px-2 py-0.5 text-sm bg-gray-100 rounded-md">#{t}</span>)}
          </div>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">답변 ({data.answers.length})</h2>
        <AnswerList answers={data.answers} />
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold">답변 작성</h3>
        <AnswerForm onSubmit={createAnswer} />
      </section>
    </div>
  );
}
