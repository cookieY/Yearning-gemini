import Index from './main.vue'

const main_child = [
    {
        path: 'home',
        title: '首页',
        name: 'home_index',
        component: () => import('./views/home/home.vue'),

    },
    {
        path: 'query_apply',
        title: '查询申请进度',
        name: 'query_apply',
        component: () => import('./views/query/refer.vue'),
    },
    {
        path: 'query_page',
        title: '查询',
        name: 'query_page',
        component: () => import('./views/query/multiSource.vue'),
    },
    {
        path: 'query_review',
        title: '查询审计详情',
        name: 'query_review',
        component: () => import('./components/profile/query_profile.vue'),
    },
    {
        path: 'profile',
        title: '工单详情',
        name: 'profile',
        component: () => import('./components/profile/profile.vue'),
    },
    {
        path: 'my_order',
        name: 'my_order',
        title: '我的工单',
        icon: 'person',
        component: () => import('./views/order/myOrder.vue')
    },
    {
        path: 'order',
        name: 'order',
        title: 'order',
        icon: 'md-code',
        component: () => import('./views/order/order.vue')
    },
    {
        path: 'board',
        name: 'board',
        title: '公告',
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
    component: () => import('./login.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('./components/locking-page.vue')
};

export const appRouter = [
    {
        path: '/',
        icon: 'md-home',
        name: 'main',
        title: '首页',
        component: Index,
        redirect: '/home',
        children: [
            ...main_child
        ]
    },
    {
        path: '/view',
        icon: 'md-search',
        name: 'view',
        title: '查询',
        component: Index,
        access: 0,
        children: [
            {
                path: 'query',
                name: 'query',
                title: 'SQL查询',
                icon: 'ios-podium',
                component: () => import('./views/query/workFlow.vue')
            }
        ]
    },
    {
        path: '/audit',
        icon: 'md-open',
        name: 'audit',
        title: '审核',
        component: Index,
        access: 1,
        children: [{
            path: 'audit-order',
            name: 'audit-audit',
            title: '工单',
            icon: 'md-create',
            component: () => import('./views/audit/order/audit.vue')
        },
            {
                path: 'query-audit',
                name: 'query-audit',
                title: '查询',
                icon: 'logo-rss',
                component: () => import('./views/audit/query/audit.vue')
            }
        ]
    },
    {
        path: '/record',
        icon: 'md-pie',
        name: 'record',
        title: '记录',
        component: Index,
        access: 1,
        children: [
            {
                path: 'audit-record',
                name: 'audit-record',
                title: '工单审计',
                icon: 'md-list',
                component: () => import('./views/records/order.vue')
            },
            {
                path: 'query-review',
                name: 'query-review',
                title: '查询审计',
                icon: 'md-pulse',
                component: () => import('./views/records/query.vue')
            }

        ]
    },
    {
        path: '/management',
        icon: 'logo-buffer',
        name: 'management',
        title: '管理',
        access: 2,
        component: Index,
        children: [
            {
                path: 'management-user',
                name: 'management-user',
                title: '用户',
                icon: 'md-people',
                component: () => import('./views/management/user/user.vue')
            },
            {
                path: 'management-database',
                name: 'management-database',
                title: '数据库',
                icon: 'md-medal',
                component: () => import('./views/management/db.vue')
            },
            {
                path: 'roleGroup',
                name: 'roleGroup',
                title: '权限组',
                icon: 'logo-google',
                component: () => import('./views/management/roleGroup.vue')
            },
            {
                path: 'setting',
                name: 'setting',
                title: '设置',
                icon: 'md-settings',
                component: () => import('./views/management/setting.vue')
            },
            {
                path: 'flow',
                name: 'flow',
                title: '流程模板',
                icon: 'md-trophy',
                component: () => import('./views/management/flow.vue')
            },
            {
                path: 'roles',
                name: 'roles',
                title: '审核规则',
                icon: 'md-aperture',
                component: () => import('./views/management/role.vue')
            },
            {
                path: 'task',
                name: 'task',
                title: 'AutoTask',
                icon: 'md-sync',
                component: () => import('./views/management/autoTask.vue')
            }
        ]
    }
];

export const MainRoute = [
    loginRouter,
    locking,
    ...appRouter
];
