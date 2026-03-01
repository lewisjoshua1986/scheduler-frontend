import { TaskDto } from "./task.dto";

// task.model.ts
export class Task {

    constructor(
        public readonly id: string,
        public title: string,
        public description: string | null,
        public completed: boolean,
        public eventId: string | null,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    toggle(): void {
        this.completed = !this.completed;
        this.touch();
    }

    assignToEvent(eventId: string): void {
        this.eventId = eventId;
        this.touch();
    }

    unschedule(): void {
        this.eventId = null;
        this.touch();
    }

    markComplete(): void {
        if (!this.completed) {
            this.completed = true;
            this.touch();
        }
    }

    rename(newTitle: string): void {
        if (!newTitle.trim()) {
            throw new Error('Task title cannot be empty');
        }

        this.title = newTitle.trim();
        this.touch();
    }

    private touch(): void {
        this.updatedAt = new Date();
    }
}