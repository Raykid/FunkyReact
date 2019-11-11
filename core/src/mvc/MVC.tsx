import { Store } from 'redux';
import '../libs/Reflect';

export interface MVC
{
    store:Store;
}

export const mvc:MVC = {
    store: null,
};