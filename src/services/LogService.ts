let _log = console.log;

export const off = () => {
    _log = () => undefined;
    return undefined;
};

export const on = () => {
    _log = console.log;
    return undefined;
};

export const log = (...args:any) => {
    _log(...args);
};

export const error = (...args:any) => {
    console.error(...args);
};

export const dump = (msg:string, obj:any) => {
    _log('--------------------------------');
    _log(msg);
    _log(JSON.stringify(obj, undefined, 4));
    _log('--------------------------------');
};
