import Vue from 'vue'
import Vuex from 'vuex'
import {appRouter} from './router'
import {order} from "@/interface";
import createVuexAlong from "vuex-along";

Vue.use(Vuex);

const module_init_args = {
    namespaced: true,
    state: {
        order_item: {
            work_id: '',
            idc: '',
            source: '',
            data_base: '',
            table: '',
            text: '',
            delay: '',
            type: 0,
            status: 0,
            username: '',
            date: '',
            rejected: '',
            execute_time: '',
            backup: 0,
            assigned: ''
        },
    },
    mutations: {
        fetch_order_item(state: { order_item: order; }, vm: order) {
            state.order_item = vm
        },
    }
};

interface Finder {
    picker: string[]
    valve: boolean
    text: string
}

const module_search = {
    namespaced: true,
    state: {
        find: {
            picker: [],
            valve: false,
            text: ''
        }
    },
    mutations: {
        post_search_args(state: { find: Finder }, vm: Finder) {
            state.find = vm
        }
    }
}

interface group {
    username: string
    list: []
    group: string[]
}

const module_verify = {
    namespaced: true,
    state: {
        group: {
            username: '',
            list: [],
            group: []
        }
    },
    mutations: {
        fetch_user_permissions(state: { group: group }, vm: group) {
            state.group = vm
        }
    }
}

const module_user = {
    namespaced: true,
    state: {
        edit: {
            id: 0,
            username: '',
            department: '',
            real_name: '',
            rule: '',
            email: '',
            multi: false,
            password: ''
        }
    },
    mutations: {
        fetch_user_info(state: { edit: object }, vm: object) {
            state.edit = vm
        }
    }
}

const store = new Vuex.Store({
    state: {
        steps: 0,
        is_dml: false,
        order: {
            idc: '',
            source: '',
            data_base: '',
            table: '',
            text: '',
            delay: null,
            assigned: '',
            backup: 1,
            export: 0
        },
        wordList: [],

        always: {
            one: true,
            two: false,
            three: false
        },

        hideMenuText: false,
        is_open: false,
        stmt: false,
        password: '',
        openReLogin: false,
        menuList: [],
        currentPageName: 'home_index',
        currentPath: [
            {
                title: '首页',
                path: '/',
                name: 'home_index'
            }
        ],
        pageOpenedList: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ],
        snippet: [] as any[],
        group_props: [],
        order_sql: [],
        osc_id: '',
    },
    modules: {
        init_args: module_init_args,
        search_args: module_search,
        verify_args: module_verify,
        user_args: module_user
    },
    mutations: {
        clear_order(state) {
            state.order = {
                idc: '',
                source: '',
                data_base: '',
                table: '',
                text: '',
                delay: null,
                assigned: '',
                backup: 1,
                export: 0
            }
        },
        clear_always(state) {
            state.always = {one: true, two: false, three: false}
        },
        changed_wordList(state, vm) {
            state.wordList = vm
        },
        changed_always(state, vm) {
            state.always = vm
        },
        changed_step(state, vm) {
            state.steps = vm
        },
        changed_is_dml(state, vm: boolean) {
            state.is_dml = vm
        },
        fetch_order_sql(state, vm) {
            return state.order_sql = vm
        },
        fetch_order_osc_id(state, vm) {
            return state.osc_id = vm
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
                // @ts-ignore
                if (item.access < accessCode) {
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

export default store
