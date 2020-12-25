import Index from './main.vue'
import WapDash from "@/views/wap/dash.vue";

const main_child = [
    {
        path: 'home',
        meta: {
            title: '首页'
        },
        name: 'home_index',
        component: () => import('./views/home/home.vue'),

    },
    {
        path: 'query/results',
        meta: {
            title: '查询申请进度'
        },
        name: 'query_apply',
        component: () => import('./views/query/refer.vue'),
    },
    {
        path: 'query/tab',
        meta: {
            title: '查询'
        },
        name: 'query_page',
        component: () => import('./views/query/multiSource.vue'),
    },
    {
        path: 'record/profile',
        meta: {
            title: '查询记录详情'
        },
        name: 'query_review',
        component: () => import('./components/profile/query_profile.vue'),
    },
    {
        path: '/order/profile',
        meta: {
            title: '工单详情'
        },
        name: 'profile',
        component: () => import('./components/profile/profile.vue'),
    },
    {
        path: 'personal',
        name: 'my_order',
        meta: {
            title: '我的工单'
        },
        icon: 'person',
        component: () => import('./views/order/myOrder.vue')
    },
    {
        path: 'order',
        name: 'order',
        meta: {
            title: '工单提交'
        },
        icon: 'md-code',
        component: () => import('./views/order/order.vue')
    },
    {
        path: 'board',
        name: 'board',
        meta: {
            title: '公告'
        },
        icon: 'md-clipboard',
        component: () => import('./views/board.vue')
    }
];

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('./views/login/login.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    meta: {
        title: '锁屏'
    },
    component: () => import('./components/locking-page.vue')
};

export const appRouter = [
    {
        path: '/',
        icon: 'md-home',
        name: 'main',
        meta: {
            title: '首页'
        },
        component: Index,
        redirect: '/home',
        children: [
            ...main_child
        ]
    },
    {
        path: '/query',
        icon: 'md-search',
        name: 'view',
        meta: {
            title: '查询'
        },
        component: Index,
        access: 0,
        children: [
            {
                path: '/query/order',
                name: 'query',
                meta: {
                    title: 'SQL查询'
                },
                icon: 'ios-podium',
                component: () => import('./views/query/workFlow.vue')
            }
        ]
    },
    {
        path: '/audit',
        icon: 'md-open',
        name: 'audit',
        meta: {
            title: '审核'
        },
        component: Index,
        access: 1,
        children: [
            {
                path: '/audit/order',
                name: 'audit-audit',
                meta: {
                    title: '工单'
                },
                icon: 'md-create',
                component: () => import('./views/audit/order/audit.vue')
            },
            {
                path: '/audit/query',
                name: 'query-audit',
                meta: {
                    title: '查询'
                },
                icon: 'logo-rss',
                component: () => import('./views/audit/query/audit.vue')
            }
        ]
    },
    {
        path: '/record',
        icon: 'md-pie',
        name: 'record',
        meta: {
            title: '记录'
        },
        component: Index,
        access: 1,
        children: [
            {
                path: '/record/order',
                name: 'audit-record',
                meta: {
                    title: '工单记录'
                },
                icon: 'md-list',
                component: () => import('./views/records/order.vue')
            },
            {
                path: '/record/query',
                name: 'query-review',
                meta: {
                    title: '查询记录'
                },
                icon: 'md-pulse',
                component: () => import('./views/records/query.vue')
            }

        ]
    },
    {
        path: '/manage',
        icon: 'logo-buffer',
        name: 'management',
        meta: {
            title: '管理'
        },
        access: 2,
        component: Index,
        children: [
            {
                path: '/manage/user',
                name: 'manage-user',
                meta: {
                    title: '用户'
                },
                icon: 'md-people',
                component: () => import('./views/manage/user/user.vue')
            },
            {
                path: '/manage/db',
                name: 'manage-database',
                meta: {
                    title: '数据库',
                },
                icon: 'md-medal',
                component: () => import('./views/manage/db/db.vue')
            },
            {
                path: '/manage/group',
                name: 'roleGroup',
                meta: {
                    title: '权限组'
                },
                icon: 'logo-google',
                component: () => import('./views/manage/group/roleGroup.vue')
            },
            {
                path: '/manage/setting',
                name: 'setting',
                meta: {
                    title: '设置'
                },
                icon: 'md-settings',
                component: () => import('./views/manage/settings/setting.vue')
            },
            {
                path: '/manage/flow',
                name: 'flow',
                meta: {
                    title: '流程模板'
                },
                icon: 'md-trophy',
                component: () => import('./views/manage/flow/flow.vue')
            },
            {
                path: '/manage/roles',
                name: 'roles',
                meta: {
                    title: '审核规则'
                },
                icon: 'md-aperture',
                component: () => import('./views/manage/role/role.vue')
            },
            {
                path: '/manage/task',
                name: 'task',
                meta: {
                    title: '自动任务'
                },
                icon: 'md-sync',
                component: () => import('./views/manage/autoTask/autoTask.vue')
            }
        ]
    }
];

export const MainRoute = [
    loginRouter,
    locking,
    ...appRouter
];
