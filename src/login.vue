<style lang="css" scoped>
    @import "styles/bootstrap.min.css";
    @import "styles/login.css";

    .div-relative {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .div-a {
        position: absolute;
        z-index: 1000;
        width: 100%;
    }

    li {
        float: left;
        list-style-type: none;
    }

    a:link {
        color: #FFFFFF;
    }

    a:visited {
        color: #FFFFFF;
    }
</style>

<template>
    <div id="band" class="div-relative ">
        <nav class="navbar  bg-primary fixed-top navbar-transparent " color-on-scroll="400">
            <div class="container">
                <div>
                    <a class="navbar-brand">
                        {{$t('version')}}: v2.2.2 general
                    </a>
                    <Button v-if="switchCode" type="default" ghost @click="register= true"> {{$t('sign')}}</Button>
                </div>
                <div>
                    <ul>
                        <li>
                            <Button type="default" @click="sponsorship = true" ghost>{{$t('sponsor')}}</Button>
                        </li>
                        <li>
                            <div style="margin-left: 50%">
                                <a href="https://github.com/cookieY/Yearning" target="_blank">
                                    <Icon type="logo-github" size="30"/>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="page-header div-a" filter-color="orange">
            <div class="page-header-image"></div>
            <div class="container">
                <div class="content-center">
                    <div class="card">
                        <form style="width: 45%;margin-left: 25%">
                            <img src="./assets/logo.png" width="80%">
                            <div class="input-group form-group-no-border input-lg">
                                <span class="input-group-addon">
                                   <Icon type="md-person"/>
                                </span>
                                <input type="text" class="form-control" :placeholder="$t('account')"
                                       v-model="formInline.user">
                            </div>
                            <div class="input-group form-group-no-border input-lg">
                                <span class="input-group-addon">
                                  <Icon type="md-key"/>
                                </span>
                                <input type="password" :placeholder="$t('password')" class="form-control"
                                       v-model="formInline.password"/>
                            </div>
                            <div class="input-group form-group-no-border input-lg">
                <span class="input-group-addon">
                                  <Icon type="md-key"/>
                                </span>
                                <input :placeholder="$t('pin')" class="form-control"
                                       v-model="formInline.code"
                                       @keyup.enter="signIn"/>
                                <SIdentify
                                        @identifyCode="checkCode" class="input-group-addon" :replace="replace"></SIdentify>
                            </div>
                            <div class="footer text-center">
                                <Checkbox v-model="single"> {{$t('ldap')}}</Checkbox>
                                <a class="btn btn-primary btn-round btn-lg btn-block" @click="signIn()">
                                    {{$t('login')}}</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <footer class="footer">
                <div class="container">
                    <nav>
                        <ul>
                            <li>
                                <Tooltip content="yearning.io" placement="top-start">
                                    <a class="nav-link" href="https://yearning.io">
                                        {{$t('about')}}
                                    </a>
                                </Tooltip>
                            </li>
                            <li>
                                <Tooltip :content="$t('community_addr')" placement="top-start">
                  <span class="nav-link">
                   {{$t('community')}}
                  </span>
                                </Tooltip>
                            </li>
                            <li>
                                <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" class="nav-link">
                                    {{$t('license')}}
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div class="copyright"> {{$t('tips')}}</div>
                </div>
            </footer>
        </div>

        <Modal v-model="register" @on-ok="LoginRegister" :title="$t('sign')" :ok-text="$t('sign')"
               :mask-closable="false">
            <Form ref="userinfova" :model="userinfo" :rules="userinfoValidate">
                <FormItem :label="$t('sign_userInfo.username')" prop="username">
                    <Input v-model="userinfo.username"></Input>
                </FormItem>

                <FormItem :label="$t('sign_userInfo.password')" prop="password">
                    <Input type="password" v-model="userinfo.password"></Input>
                </FormItem>

                <FormItem :label="$t('sign_userInfo.confirm')" prop="confirmpassword">
                    <Input v-model="userinfo.confirmpassword" type="password"></Input>
                </FormItem>

                <FormItem prop="realname" :label="$t('sign_userInfo.real')">
                    <Input v-model="userinfo.realname"></Input>
                </FormItem>

                <FormItem prop="department" :label="$t('sign_userInfo.department')">
                    <Input v-model="userinfo.department"></Input>
                </FormItem>

                <FormItem prop="email" :label="$t('sign_userInfo.mail')">
                    <Input v-model="userinfo.email"></Input>
                </FormItem>
            </Form>
        </Modal>

        <Modal v-model="sponsorship" :title="$t('sponsor_title')" width="640">
            <h3> {{$t('sponsor_1')}}</h3>
            {{$t('sponsor_2')}}
            <br>
            <br>
            <h3>{{$t('sponsor_3')}}</h3>
            {{$t('sponsor_4')}}
            <br>
            <br>
            <h3>{{$t('sponsor_5')}}</h3>
            {{$t('sponsor_6')}}
            <br>
            {{$t('sponsor_7')}}
            <br>
            <br>
            <img height="300" width="300" src="./assets/alipay.jpg">
            <img height="300" width="300" src="./assets/wechat.jpg">
        </Modal>
    </div>
</template>
<script lang="ts">
    import axios from 'axios'
    import SIdentify from '@/components/identify.vue'
    import {Vue, Component} from "vue-property-decorator";
    import i18n from '@/language/index';

    @Component({components: {SIdentify}})
    export default class login extends Vue {

        valideuserinfoPassword = (rule: any, value: string, callback: any) => {
            if (value !== this.userinfo.password) {
                callback(new Error(i18n.t('sign_up_validate.twice') as any))
            } else {
                callback()
            }
        };
        regExp_password = (rule: any, value: string, callback: any) => {
            let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
            if (!pPattern.test(value)) {
                callback(new Error(i18n.t('sign_up_validate.regexp') as any))
            } else {
                callback()
            }
        };

        $config: any;
        replace = false
        single = false;
        switchCode = false;
        sponsorship = false;
        register = false;
        userinfo = {
            username: '',
            password: '',
            confirmpassword: '',
            email: '',
            realname: '',
            department: ''
        };
        userinfoValidate = {
            username: [
                {
                    required: true,
                    message: i18n.t('sign_up_validate.username'),
                    trigger: 'blur'
                }
            ],
            password: [
                {
                    required: true,
                    message: i18n.t('sign_up_validate.password'),
                    trigger: 'blur'
                },
                {
                    min: 6,
                    message: i18n.t('sign_up_validate.min'),
                    trigger: 'blur'
                },
                {
                    max: 32,
                    message: i18n.t('sign_up_validate.max'),
                    trigger: 'blur'
                },
                {
                    validator: this.regExp_password,
                    trigger: 'blur'
                }
            ],
            confirmpassword: [
                {
                    required: true,
                    message: i18n.t('sign_up_validate.confirm'),
                    trigger: 'blur'
                },
                {
                    validator: this.valideuserinfoPassword,
                    trigger: 'blur'
                }
            ],
            realname: [
                {
                    required: true,
                    message: i18n.t('sign_up_validate.real'),
                    trigger: 'blur'
                }
            ],
            department: [
                {
                    required: true,
                    message: i18n.t('sign_up_validate.department'),
                    trigger: 'blur'
                }
            ],
            email: [
                {required: true, message: i18n.t('sign_up_validate.mail'), trigger: 'blur'},
                {type: 'email', message: i18n.t('sign_up_validate.mail_format'), trigger: 'blur'}
            ]
        };
        formInline = {
            user: '',
            password: '',
            code: ''
        };
        check_code = '';

        checkCode(vl: string) {
            this.check_code = vl.toLowerCase()
        }

        LoginRegister() {
            let is_validate: any = this.$refs['userinfova'];
            is_validate.validate((valid: boolean) => {
                if (valid) {
                    axios.post(this.$config.register, {
                        'userinfo': this.userinfo
                    })
                        .then(res => {
                            this.$config.notice(res.data);
                            this.$config.clearObj(this.userinfo)
                        })
                        .catch(error => {
                            this.$config.err_notice(this, error)
                        })
                } else {
                    this.$config.notice(i18n.t('sign_up_validate.sign_fail') as string)
                }
            })
        }

        signIn() {
            if (this.check_code !== this.formInline.code.toLowerCase()) {
                this.$Message.warning({
                    content: i18n.t('sign_up_validate.pin') as string
                });
                this.replace = !this.replace
                return
            }
            let url = this.$config.auth;
            if (this.single) {
                url = `${this.$config.gen}/ldap`
            }
            axios.post(url, {
                'username': this.formInline.user,
                'password': this.formInline.password
            })
                .then(res => {
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
                    sessionStorage.setItem('user', this.formInline.user);
                    sessionStorage.setItem('jwt', `Bearer ${res.data.token}`);
                    sessionStorage.setItem('auth', res.data['permissions']);
                    sessionStorage.setItem('real_name', res.data['real_name']);
                    let auth = res.data['permissions'];
                    (auth === 'admin' || auth === 'perform') ? sessionStorage.setItem('access', '0') : sessionStorage.setItem('access', '1');
                    this.$router.push({
                        name: 'home_index'
                    })
                })
                .catch(err => {
                    this.replace = !this.replace
                    this.$config.auth_notice(err)
                })
        }

        mounted() {
            let windows: any = window;
            windows.particlesJS.load('band', `${process.env.BASE_URL}particlesjs-config.json`);
            axios.get(`${this.$config.gen}/fetch`)
                .then(res => {
                    if (res.data === 1) {
                        this.switchCode = true;
                    }
                })
                .catch(err => this.$config.auth_notice(err));
        }
    }
</script>
