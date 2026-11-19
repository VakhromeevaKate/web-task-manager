import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "./tasks";
import { taskKeys } from "./taskKeys";

export function useTasks() {
    return useQuery({
        queryKey: taskKeys.list(),
        queryFn: tasksApi.list,
    });
}