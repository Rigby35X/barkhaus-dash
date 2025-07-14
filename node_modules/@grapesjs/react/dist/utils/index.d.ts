type ClassNameInput = string | number | boolean | null | undefined;
type ClassNameInputs = ClassNameInput | Array<ClassNameInput>;
export declare function cx(...inputs: ClassNameInputs[]): string;
export declare function isFunction(value: any): value is Function;
export declare function noop(): void;
export declare function useTraceUpdate(props: Record<string, any>): void;
export {};
