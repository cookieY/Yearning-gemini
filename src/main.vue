<style lang="less" scoped>
    @import "styles/main.less";
</style>
<template>
    <div id="main" class="main">

        <div
                class="sidebar-menu-con"
                style="width:200px; background:#ffffff;z-index: 1"
        >
            <sidebar-menu :menuList="menuList" :iconSize="18"/>
        </div>
        <div class="main-header-con">
            <div class="main-header">
                <div class="main-breadcrumb">
                    <breadcrumb-nav></breadcrumb-nav>
                </div>
                <div class="header-avator-con">
                    <a href="https://guide.yearning.io/" target="_Blank">{{$t('banner.guide')}}</a>
                    <div @click="lockScreen" class="lock-screen-btn-con">
                        <Tooltip :content="$t('dash.lock')" placement="bottom">
                            <Icon type="md-lock" :size="20"></Icon>
                        </Tooltip>
                    </div>
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <Avatar :style="{background: color}">{{ userName }}</Avatar>
                                    <Icon type="md-arrow-dropdown"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="loginout">{{$t('banner.login_out')}}</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <div class="single-page-con" style="padding-left:200px">
            <div class="single-page">
                <transition name="fade" mode="out-in" appear>
                    <router-view>
                    </router-view>
                </transition>
            </div>
        </div>
        <Modal
                v-model="stmt"
                :title="$t('banner.statement.banner')"
                width="600"
                :mask-closable="false"
                :closable="false"
                :styles="{top: '20%'}"
                :ok-text="$t('general.agreed')"
                @on-ok="agreement"
        >
            <h3>{{$t('banner.statement.title')}}</h3>
            <br>
            <p>{{$t('banner.statement.title_text')}}</p>
            <br>
            <H3>{{$t('banner.statement.notes')}}</H3>
            <br>
            <p> {{$t('banner.statement.text')}}</p>
            <br>
            <p>{{$t('banner.statement.text_1')}}</p>
            <br>
            <p>{{$t('banner.statement.text_2')}}</p>
            <br>
            <p>{{$t('banner.statement.text_3')}}</p>
            <br>
            <p>{{$t('banner.statement.text_4')}}</p>
            <br>
            <p>{{$t('banner.statement.text_5')}}</p>
            <h3>{{$t('banner.statement.text_6')}}</h3>
            <br>
            <p>{{$t('banner.statement.text_7')}}</p>
            <br>
            <h3>{{$t('banner.statement.text_8')}}</h3>
            <br>
            <p>{{$t('banner.statement.text_9')}}</p>
        </Modal>
    </div>
</template>
<script lang="ts">
    import sidebarMenu from './components/sidebarMenu.vue'
    import breadcrumbNav from '@/components/breadcrumbNav.vue'
    import axios from 'axios'
    import {Component, Vue} from "vue-property-decorator";
    import module_general from "@/store/modules/general";

    @Component({components: {sidebarMenu, breadcrumbNav}})
    export default class main_farm extends Vue {
        $config: any;
        userName = sessionStorage.getItem('user');
        isFullScreen = false;
        lockScreenSize = 0;
        colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
        color = '';

        get stmt() {
            return module_general.stmt
        }

        set stmt(val) {
            module_general.changed_stmt_status(val)
        }

        get menuList() {
            return module_general.menuList
        }

        set menuList(vl) {
            module_general.changed_menuList(vl)
        }

        handleClickUserDropdown() {
            localStorage.clear();
            sessionStorage.clear();
            this.$router.push({
                name: 'login'
            })
        }

        handleChange() {
            let i = this.$config.random(0, 3);
            this.color = this.colorList[i]
        }

        // 锁屏
        lockScreen() {
            let lockScreenBack: any = document.getElementById('lock_screen_back')
            lockScreenBack.style.transition = 'all 3s';
            lockScreenBack.style.zIndex = 10000;
            lockScreenBack.style.boxShadow = '0 0 0 ' + this.lockScreenSize + 'px #667aa6 inset';
            this.$store.commit('lock');
            let page_name: any = this.$route.name;
            sessionStorage.setItem('last_page_name', page_name); // 本地存储锁屏之前打开的页面以便解锁后打开
            setTimeout(() => {
                lockScreenBack.style.transition = 'all 0s';
                this.$router.push({
                    name: 'locking'
                })
            }, 800)
        }

        init() {
            // 全屏相关
            document.addEventListener('fullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen
            });
            document.addEventListener('mozfullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen
            });
            document.addEventListener('webkitfullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen
            });
            document.addEventListener('msfullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen
            });
            // 锁屏相关
            let lockScreenBack: any = document.getElementById('lock_screen_back')
            let x = document.body.clientWidth;
            let y = document.body.clientHeight;
            let size = Math.sqrt(x * x + y * y);
            this.lockScreenSize = size;
            window.addEventListener('resize', () => {
                let x = document.body.clientWidth;
                let y = document.body.clientHeight;
                let size = Math.sqrt(x * x + y * y);
                this.lockScreenSize = size;
                lockScreenBack.style.transition = 'all 0s';
                lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
            })
            lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
            // 问候信息相关
            if (!sessionStorage.getItem('hasGreet')) {
                let now = new Date();
                let hour = now.getHours();
                let greetingWord = {
                    title: '',
                    words: ''
                };
                let userName = this.userName;
                if (hour < 6) {
                    greetingWord = {
                        title: '凌晨好~' + userName,
                        words: '早起的鸟儿有虫吃~'
                    }
                } else if (hour >= 6 && hour < 9) {
                    greetingWord = {
                        title: '早上好~' + userName,
                        words: '来一杯咖啡开启美好的一天~'
                    }
                } else if (hour >= 9 && hour < 12) {
                    greetingWord = {
                        title: '上午好~' + userName,
                        words: '工作要加油哦~'
                    }
                } else if (hour >= 12 && hour < 14) {
                    greetingWord = {
                        title: '中午好~' + userName,
                        words: '午饭要吃饱~'
                    }
                } else if (hour >= 14 && hour < 17) {
                    greetingWord = {
                        title: '下午好~' + userName,
                        words: '下午也要活力满满哦~'
                    }
                } else if (hour >= 17 && hour < 19) {
                    greetingWord = {
                        title: '傍晚好~' + userName,
                        words: '下班没事问候下爸妈吧~'
                    }
                } else if (hour >= 19 && hour < 21) {
                    greetingWord = {
                        title: '晚上好~' + userName,
                        words: '工作之余品一品书香吧~'
                    }
                } else {
                    greetingWord = {
                        title: '深夜好~' + userName,
                        words: '夜深了，注意休息哦~'
                    }
                }
                this.$Notice.config({
                    top: 130
                });
                this.$Notice.info({
                    title: greetingWord.title,
                    desc: greetingWord.words,
                    duration: 4,
                    name: 'greeting'
                });
                sessionStorage.setItem('hasGreet', '1')
            }
        }

        agreement() {
            axios.put(`${this.$config.url}/dash/stmt`)
        }

        beforeunloadFn() {
            module_general.snippetTagToJson()
        }

        mounted() {
            this.handleChange();
            module_general.breadcrumb_set(this.$route.matched[1].name)
            module_general.changed_currentPageName(this.$route.matched[1].name)
            module_general.check_page_open()
            this.init();
        }

        created() {
            // 权限菜单过滤相关
            module_general.sidebar_filter()
            module_general.snippetTagFromJson()
            axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('jwt');
            window.addEventListener('beforeunload', () => this.beforeunloadFn())
        }

        destroyed() {
            window.removeEventListener('beforeunload', () => this.beforeunloadFn())
        }

    }
</script>
