import { Dimensions } from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

/**
 * 获取静态import进来的资源的实际路径
 *
 * @author Raykid
 * @date 2019-10-23
 * @export
 * @param {number} assetsId import进来的资源id
 * @returns {string}
 */
export function getImportedAssetsPath(assetsId:number):string
{
    const assets = resolveAssetSource(assetsId);
    return assets && assets.uri;
}

// 获取屏幕大小
const { width, height } = Dimensions.get("window");
const screenWidth:number = Math.min(width, height, 540); // 判断是否是 iphone Plus

// db数值转化
export function getPixel(num:number, designWidth:number = 750)
{
    return num * screenWidth / designWidth;
}