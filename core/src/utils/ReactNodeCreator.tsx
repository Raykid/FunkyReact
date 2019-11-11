import React, { Ref } from 'react';

/**
 * 创建ReactNode的方法
 *
 * @author Raykid
 * @date 2019-10-10
 * @export
 * @template P
 * @param {{new (props?:P):React.Component}} cls
 * @param {P} [props]
 * @param {React.ReactNode} [children]
 * @param {(ref:React.ReactNode)=>void} [refHandler]
 * @returns {React.ReactNode}
 */
export function createReactNode<P = any, T extends React.Component = React.Component>(cls:{new (props?:P):T}, props?:P, children?:React.ReactNode, refHandler?:Ref<T>):React.ReactNode
{
    const wrapper = {cls};
    return <wrapper.cls ref={refHandler} {...props}>
        { children }
    </wrapper.cls>;
}