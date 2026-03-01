export interface TaskDto {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  eventId?: string | null;
  createdAt: string;
  updatedAt: string;
}