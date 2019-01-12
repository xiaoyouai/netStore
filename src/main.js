import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import Vuex from "vuex";
import infiniteScroll from 'vue-infinite-scroll'
import { currency } from './util/currency'

import './assets/css/base.css'
import './assets/css/product.css'
import './assets/css/checkout.css'

Vue.config.productionTip = false
Vue.use(VueLazyLoad, {
    loading: '../static/loading-svg/loading-bars.svg'
})
Vue.use(infiniteScroll)
Vue.filter("mycurrency", currency);


Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        nickName: "",
        cartCount: 0
    },
    mutations: {
        updateUserInfo(state, nickName) {
            state.nickName = nickName;
        },
        updateCartCount(state, cartCount) {
            state.cartCount += cartCount;
        },
        initCartCount(state, cartCount) {
            state.cartCount = cartCount;
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})