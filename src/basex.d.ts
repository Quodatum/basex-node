
declare module 'basex' {

    type CallbackType = (err: any, reply: any) => void;
    export class Session {
        constructor(host: string, port: number, username: string, password: string);
        public execute(cmd: string, callback: CallbackType): void;
        public create(dbname: string, input: any, callback: CallableFunction): void;
        public replace(path: string, input: any, callback: CallableFunction): void;
        public store(path: string, input: any, callback: CallableFunction): void;
        public add(path: string, input: any, callback: CallableFunction): void;
        public query(code: string): Query;
        public close(): void;
        public reset(): void;
        // eslint-disable-next-line @typescript-eslint/ban-types
        public on(event: string, handler: Function): this;
    }

    export class Query { 
        public bind(name: string, value: string, callback: CallbackType): void;
        public close(): void;
        public options(callback: CallbackType): void;
        public results(callback: CallbackType): void;
    }
}