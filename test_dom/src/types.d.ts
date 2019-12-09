// 允许绕过在import时对html和css扩展名的检查
declare module '*.htm'
{
    const str: string;
    export default str;
}

declare module '*.html'
{
    const str: string;
    export default str;
}

declare module '*.css'
{
    const str: string;
    export default str;
}

declare module '*.scss'
{
    const str: string;
    export default str;
}

declare module '*.less'
{
    const str: string;
    export default str;
}

declare module '*.json'
{
    const dict: {[key:string]:any};
    export default dict;
}

declare module '*.jpg'
{
    const str: string;
    export default str;
}

declare module '*.jpeg'
{
    const str: string;
    export default str;
}

declare module '*.png'
{
    const str: string;
    export default str;
}

declare module '*.gif'
{
    const str: string;
    export default str;
}

declare module '*.mp3'
{
    const str: string;
    export default str;
}

declare module '*.aac'
{
    const str: string;
    export default str;
}