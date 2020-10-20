import Vue from 'vue'
import Vuex from 'vuex'
import createVuexAlong from "vuex-along";
import module_init_args from "@/store/modules/init_args";

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
    }
});
