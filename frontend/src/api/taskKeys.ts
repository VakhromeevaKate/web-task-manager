export const taskKeys = {
    all: ['tasks'] as const,
    list: () => [...taskKeys.all, 'list'] as const,
    detail: (id: number) => [...taskKeys.all, 'deatail', id] as const,
}