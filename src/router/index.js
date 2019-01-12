// index.js
import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/Goodslist'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import orderConfirm from '@/views/orderConfirm'
import orderSuccess from '@/views/orderSuccess'

Vue.use(Router)

export default new Router({
    mode: 'history',

    routes: [{
            path: '/',
            name: 'GoodsList',
            component: GoodsList,
        },
        {
            path: '/cart',
            name: 'Cart',
            component: Cart
        }, {
            path: '/address',
            name: 'Address',
            component: Address
        }, {
            path: '/orderConfirm',
            name: 'orderConfirm',
            component: orderConfirm
        }, , {
            path: '/orderSuccess',
            name: 'orderSuccess',
            component: orderSuccess
        },
    ]
});