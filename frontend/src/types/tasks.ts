export interface Task {
    id: number;
    title: string;
    done: boolean;
    priority: number;
    created_at: string;
    updated_at: string;
}
  
export interface TaskCreate {
    title: string;
    done?: boolean;
    priority?: number;
}
  
export interface TaskUpdate {
    title?: string;
    done?: boolean;
    priority?: number;
}