export declare const isDef: (value: any) => boolean;
export declare const isString: (value: any) => value is string;
export declare const prevent: (ev?: Event) => void | undefined;
export declare const stop: (ev?: Event) => void | undefined;
export declare const loadStyle: (href: string) => Promise<void>;
type ScriptToLoad = {
    id: string;
    src: string;
};
export declare const loadScript: (src: string | ScriptToLoad) => Promise<string>;
export declare const loadScripts: (scripts: {
    id: string;
    src: string;
}[]) => Promise<PromiseSettledResult<string>[]>;
export {};
