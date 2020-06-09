import Vue from 'vue'
import Vuex from 'vuex'
import {appRouter} from './router'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        hideMenuText: false,
        is_open: false,
        stmt: false,
        password: '',
        openReLogin: false,
        menuList: [],
        currentPageName: 'home_index',
        currentPath: [{
            title: '首页',
            path: '/',
            name: 'home_index'
        }],
        pageOpenedList: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        snippet: [] as any[],
        group_props: [],
        order_item: {
            WorkId: '',
            IDC: '',
            Source: '',
            Delay: '',
            DataBase: '',
            Text: '',
            Table: '',
            Type: 0
        },
        order_sql: [],
        osc_id: ''
    },
    mutations: {
        fetch_order_item(state, vm) {
            return state.order_item = vm
        },
        fetch_order_sql(state, vm) {
            return state.order_sql = vm
        },
        fetch_order_osc_id(state, vm) {
            return state.osc_id = vm
        },
        closeNav(state) {
            return state.hideMenuText = !state.hideMenuText
        },
        snippetTag(state, vm) {
            state.snippet.push({'title': vm.title, 'text': vm.text})
        },
        snippetTagToJson(state) {
            localStorage.setItem('snippet', JSON.stringify(state.snippet))
        },
        snippetTagFromJson(state) {
            state.snippet = JSON.parse(<string>localStorage.getItem('snippet'))
        },
        snippetRemoveTag(state, vm) {
            const index: number = state.snippet.indexOf(vm);
            state.snippet.splice(index, 1)
        },
        sidebar_filter(state) {
            let accessCode = parseInt(<string>sessionStorage.getItem('access')); // 0
            let menuList: any = [];
            appRouter.forEach((item) => {
                if (item.access === accessCode || item.access === 3) {
                    let i = menuList.push(item);
                    menuList[i - 1].children = item.children
                }
            });
            state.menuList = menuList
        },
        lock() {
            sessionStorage.setItem('locking', '1')
        },
        unlock() {
            sessionStorage.setItem('locking', '0')
        },
        breadcrumb_set(state, name) {
            state.currentPath = [];
            appRouter.forEach((val) => {
                for (let i of val.children) {
                    if (i.name === name) {
                        if (val.name !== 'main') {
                            state.currentPath.push({
                                'title': val.title,
                                'path': val.path,
                                'name': val.name
                            }, {
                                'title': i.title,
                                'path': `${val.path}/${i.path}`,
                                'name': i.name
                            })
                        } else {
                            state.currentPath.push({
                                'title': i.title,
                                'path': i.path,
                                'name': i.name
                            })
                        }
                    }
                }
            })
        }
    }
});

export default store
