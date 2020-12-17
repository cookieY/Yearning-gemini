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
                    <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                        <a href="javascript:void(0)">
                            获得赞助版本/帮助
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="sponsor">获取赞助版</DropdownItem>
                            <DropdownItem><a href="https://guide.yearning.io/"
                                             target="_Blank">{{ $t('banner.guide') }}</a></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <div @click="lockScreen" class="lock-screen-btn-con" style="margin-left: 5%">
                        <Tooltip :content="$t('dash.lock')" placement="bottom">
                            <Icon type="md-lock" :size="20"></Icon>
                        </Tooltip>
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
        <Modal v-model="is_open" title="获得赞助版本">
            <p>感谢您支持Yearning！Yearning在保证社区版持续开发的基础上为了回馈曾经在Yearning开发道路上提供积极帮助的朋友们，现推出了基于社区版的赞助版本。 </p>
            <p>赞助版基于最新的Yearning社区版本，目前已添加以下功能:</p>
            <br>
            <p>1.支持审核人移动端(手机)审核工单</p>
            <p>2.支持企业微信消息推送</p>
            <p>3.支持外键审核</p>
            <p>4.支持指定表名前缀审核规则</p>
            <p>5.可基于主键生成回滚语句</p>
            <p>6.工单复制(适用于多环境工单流转) </p>
            <p>7.搜索功能支持多条件合并搜索</p>
            <p>8.专属微信群,及时解决问题</p>
            <br>
            <h6>赞助版本将会持续更新差异化功能/支持更新</h6>
            <h5>2021年度赞助大于300可联系作者(Mail: henry@yearning.io/QQ: 834958386)获取</h5>
        </Modal>
    </div>
</template>
<script lang="ts">
    import sidebarMenu from './components/sidebarMenu.vue'
    import breadcrumbNav from '@/components/breadcrumbNav.vue'
    import {Component,Mixins} from "vue-property-decorator";
    import module_general from "@/store/modules/general";
    import module_init_args from "@/store/modules/init_args";
    import {DashPutApi} from "@/apis/dashApis";
    import att_mixins from "@/mixins/basic";

@Component({components: {sidebarMenu, breadcrumbNav}})
export default class main_farm extends Mixins(att_mixins) {
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

    handleClickUserDropdown(vl: string) {
        if (vl === 'sponsor') {
            this.is_open = true
        }
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
            DashPutApi("stmt")
        }

        beforeunloadFn() {
            module_general.snippetTagToJson()
            let root = {
                order_item: module_init_args.order_item,
            }
            sessionStorage.setItem("root", JSON.stringify(root));
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
            window.addEventListener('beforeunload', () => this.beforeunloadFn())
            if (sessionStorage.getItem("root") !== null) {
                let root = JSON.parse(sessionStorage.getItem("root") as string)
                module_init_args.fetch_order_item(root.order_item)
            }
        }

        destroyed() {
            window.removeEventListener('beforeunload', () => this.beforeunloadFn())
        }

    }
</script>
