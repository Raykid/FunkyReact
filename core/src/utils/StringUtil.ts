/**
 * 去除字符串首尾空格
 *
 * @author Raykid
 * @export
 * @param {string} str
 * @returns {string}
 */
export function trimString(str:string):string
{
    return str.replace(/^\s*([\s\S]*?)\s*$/, "$1");
}