
/**
 * 将数据转换为form形式
 * 
 * @export
 * @param {*} data 要转换的数据
 * @returns {string} 转换结果字符串
 */
export function toFormParams(data:any):string
{
    if(!data) return "";
    var keys:string[] = Object.keys(data);
    var params:string[] = keys.map((key:string)=>{
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    });
    return params.join("&");
}