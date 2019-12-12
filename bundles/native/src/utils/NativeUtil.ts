import { Dimensions } from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

/**
 * 获取静态import进来的资源的实际路径
 *
 * @author Raykid
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
// 设置设计尺寸
let designWidth:number = 750;
let designHeight:number = 1334;
let ratioFromDesignToReal:number;
handleSize();

function handleSize():void
{
    // 如果设计长宽的方向和屏幕不同，则对调一下
    if(width > height !== designWidth > designHeight)
    {
        const temp:number = designWidth;
        designWidth = designHeight;
        designHeight = temp;
    }
    // 计算设计宽高比和实际宽高比
    const ratioDesign:number = designWidth / designHeight;
    const ratioReal:number = width / height;
    // 计算比例系数
    if(ratioDesign < ratioReal)
    {
        ratioFromDesignToReal = height / designHeight;
    }
    else
    {
        ratioFromDesignToReal = width / designWidth;
    }
}

/**
 * 设置屏幕设计尺寸，横竖屏无关。
 * 如果不设置，则默认为“1334 * 750”或“750 * 1334”。
 *
 * @author Raykid
 * @export
 * @param {number} width
 * @param {number} height
 */
export function initDesignSize(width:number, height:number):void
{
    if(width > 0 && height > 0)
    {
        designWidth = width;
        designHeight = height;
        handleSize();
    }
}

/**
 * 将设计图的像素尺寸转换为实际像素尺寸。这种方式是根据屏幕尺寸进行等比拉伸，
 * 因此在任意dpi屏幕下布局都一致，不需要考虑2x或3x的问题，
 * 只需要在一开始提供设计图上屏幕的宽高像素值即可。
 * 例如：在iPad上使用PixelRatio.roundToNearestPixel，则元素占屏幕比例明显小于手机，
 * 这是因为iPad的dpi更大，于是为了适配iPad，需要提供2x图片，并生成HD版本APP。
 * 但使用这个方法，则在手机和iPad上的布局适配表现完全一致，无需额外适配和资源。
 * 
 * 如果就是需要在不同设备上保持实际尺寸一致，则应使用PixelRatio.roundToNearestPixel，而不是该方法。
 *
 * @author Raykid
 * @export
 * @param {number} num 设计图像素值
 * @returns {number} 实际像素值
 */
export function getPixel(num:number):number
{
    return num * ratioFromDesignToReal;
}