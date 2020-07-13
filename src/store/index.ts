import Vue from 'vue'
import Vuex from 'vuex'
import {appRouter} from '@/router'
import createVuexAlong from "vuex-along";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        password: ''
    },
    mutations: {
        lock() {
            sessionStorage.setItem('locking', '1')
        },
        unlock() {
            sessionStorage.setItem('locking', '0')
        },
    },
    plugins: [
        createVuexAlong({
            name: "yearning",
            justSession: true,
            session: {
                list: ["init_args.order_item"],
            }
        })
    ]
});
