/**
 * 去除字符串首尾空格
 *
 * @author Raykid
 * @date 2019-10-30
 * @export
 * @param {string} str
 * @returns {string}
 */
export function trimString(str:string):string
{
    return str.replace(/^\s*([\s\S]*?)\s*$/, "$1");
}