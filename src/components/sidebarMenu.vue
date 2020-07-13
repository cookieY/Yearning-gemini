<template>
    <div style="height: 100%;overflow: scroll">
        <Menu width="auto" @on-select="currentPageTab" :active-name="currentPageName" accordion>
            <MenuItem name="main">
                <Row>
                    <Col span="12"><img src="../assets/logo_s.png" width="90%"></Col>
                    <Col span="12" style="font-weight: bold;font-size: 20px;padding-top: 20px;">Yearning</Col>
                </Row>
            </MenuItem>
            <MenuItem name="home_index">
                <Icon type="md-home" :size="iconSize"></Icon>
                <span class="layout-text">首页</span>
            </MenuItem>
            <MenuItem name="my_order">
                <Icon type="md-person" :size="iconSize"></Icon>
                <span class="layout-text">我的工单</span>
            </MenuItem>
            <template v-for="item in menuList">
                <Submenu v-if="item.children.length>=1 && item.name !== 'main'" :name="item.name" :key="item.path">
                    <template slot="title">
                        <Icon :type="item.icon" :size="iconSize"></Icon>
                        <span class="layout-text">{{ item.title }}</span>
                    </template>
                    <template v-for="child in item.children">
                        <MenuItem :name="child.name" :key="child.name" style="margin-left: -5%">
                            <Icon :type="child.icon" :size="iconSize" :key="child.name"></Icon>
                            <span class="layout-text" :key="child.name + 1">{{ child.title }}</span>
                        </MenuItem>
                    </template>
                </Submenu>
            </template>
            <Menu-item name="board">
                <Icon type="md-clipboard" :size="iconSize"></Icon>
                <span class="layout-text">公告</span>
            </Menu-item>
            <Menu-item name="login">
                <Icon type="md-log-out" :size="iconSize"></Icon>
                <span class="layout-text">退出</span>
            </Menu-item>
        </Menu>
    </div>
</template>
<script>
    import libs from '../libs/libs'
    import module_general from "@/store/modules/general";

    export default {
        name: 'sidebarMenu',
        props: {
            menuList: Array,
            iconSize: Number
        },
        data() {
            return {
            }
        },
        computed: {
            currentPageName() {
                return module_general.currentPageName
            }
        },
        methods: {
            currentPageTab(val) {
                if (val === 'login') {
                    localStorage.removeItem('pageOpenedList');
                    sessionStorage.clear();
                    this.$router.push({
                        name: 'login'
                    })
                } else {
                    libs.openPage(this, val)
                }
            }
        }
    }
</script>

<style>
    span {
        font-weight: bold;
    }
</style>
