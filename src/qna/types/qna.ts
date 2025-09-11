export interface QuestionResponse {
  id: number;
  userId: number;
  title: string;
  content: string;
  category: string | null;
  status: string;       // 서버 enum 문자열
  createdAt: string;
  updatedAt: string;
}

export interface QuestionListItem {
  id: number;
  title: string;
  userId: number;
  category?: string | null;
  status?: string;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  page: number; // 1-base (UI용)
  size: number;
  total: number;
}
