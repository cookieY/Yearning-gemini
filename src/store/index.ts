import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    mutations: {
        lock() {
            sessionStorage.setItem('locking', '1')
        },
        unlock() {
            sessionStorage.setItem('locking', '0')
        },
    }
});
