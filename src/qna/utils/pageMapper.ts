import type { SpringPage } from "../types/spring";
import type { Paginated, QuestionListItem, QuestionResponse } from "../types/qna";

export function mapQuestionPage(p: SpringPage<QuestionResponse>): Paginated<QuestionListItem> {
  return {
    items: p.content.map((q) => ({
      id: q.id,
      title: q.title,
      userId: q.userId,
      category: q.category,
      status: q.status,
      createdAt: q.createdAt,
    })),
    page: p.number + 1,
    size: p.size,
    total: p.totalElements,
  };
}
