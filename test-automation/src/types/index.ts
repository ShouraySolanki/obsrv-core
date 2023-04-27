export interface ITask {
    index: number,
    name: string;
    handler: (config?: Record<string, any>) => Function;
    [key: string]: any;
}