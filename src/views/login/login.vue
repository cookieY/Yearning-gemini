<style lang="less" scoped>

.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px; /*脚部的高度*/
    clear: both;
    margin-left: 6rem;
    z-index: 999;
}

.header {
    position: absolute;
    top: 0;
    width: 100%;
    height: 40px; /*脚部的高度*/
    clear: both;
    z-index: 999;
    margin-left: 6rem;
    margin-top: 10px;
}

.header a {
    color: #FFFFFF;
}

.homepage-hero-module,
.video-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
}

.video-container .poster img,
.video-container video {
    z-index: 0;
    position: absolute;
}

.video-container .filter {
    z-index: 1;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
}

.div-a {
    position: absolute;
    width: 100%;
}
</style>

<template>
    <div>
        <div class="header">
            <Row type="flex" justify="start" align="middle">
                <Col span="1">
                    <a href="https://github.com/cookieY/Yearning" target="_blank">
                        <Icon type="logo-github" size="30"/>
                    </a>
                </Col>
                <Col span="2"><a class="navbar-brand"> {{ $t('version') }}: {{ $config.version }} </a></Col>
                <Col span="1">
                    <Button v-if="switchCode" type="default" ghost @click="register = true" size="small"
                            style="z-index: 9999">
                        {{ $t('sign') }}
                    </Button
                    >
                </Col>
                <Col span="1">
                    <Button type="default" @click="sponsorship = true" ghost size="small">
                        {{ $t('sponsor') }}
                    </Button>
                </Col>
            </Row>
        </div>
        <div style="z-index: 100" class="div-a">
            <Row type="flex">
                <Col span="3" offset="2">
                    <div style="margin:180px 0 0 ;;width: 300px;">
                        <Form label-position="right">
                            <FormItem>
                                <img src="../../assets/logo.png" width="300px">
                            </FormItem>
                            <FormItem>
                                <Input style="opacity: 0.6" :placeholder="$t('account')"
                                       v-model="formInline.user"></Input>
                            </FormItem>
                            <FormItem>
                                <Input style="opacity: 0.6" :placeholder="$t('password')" v-model="formInline.password"
                                       type="password" @keyup.enter.native="is_verify=true"></Input>
                            </FormItem>
                            <FormItem>
                                <Checkbox v-model="is_open"><span style="color: #FFFFFF;">{{ $t('ldap') }}</span>
                                </Checkbox>
                            </FormItem>
                            <FormItem>
                                <Button long type="primary" ghost @click="is_verify=true"> 登录</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
        <div class="footer">
            <Row type="flex" justify="start" align="bottom" style="z-index: 999">
                <Col span="2">
                    <Tooltip content="yearning.io" placement="top-start">
                        <a href="https://yearning.io" style="color: #FFFFFF">
                            {{ $t('about') }}
                        </a>
                    </Tooltip>
                </Col>
                <Col span="2">
                    <Tooltip :content="$t('community_addr')" placement="top-start">
                                    <span style="color: #FFFFFF">
                                        {{ $t('community') }}
                                    </span>
                    </Tooltip>
                </Col>
                <Col span="2">
                    <a
                        href="https://www.gnu.org/licenses/agpl-3.0.en.html" style="color: #FFFFFF"
                    >
                        {{ $t('license') }}
                    </a>
                </Col>
                <Col span="18">
                    <div style="color: #FFFFFF">{{ $t('tips') }}</div>
                </Col>
            </Row>
        </div>
        <div class="homepage-hero-module">
            <div class="video-container">
                <div :style="fixStyle" class="filter">

                </div>
                <video :style="fixStyle" autoplay loop class="fillWidth" v-on:canplay="canplay" muted>
                    <source src="../../assets/groud.mp4" type="video/mp4"/>
                </video>
            </div>
        </div>

        <Modal v-model="is_verify" width="340"
               transfer
               footer-hide
               title="拼图验证"
               draggable
               :styles="{top:'150px'}"
        >
            <slide-verify :l="42"
                          :r="10"
                          :w="310"
                          :h="155"
                          @success="onSuccess"
                          @fail="() => $Message.error('验证失败')"
                          slider-text="向右滑动"
                          ref="slideblock"
            ></slide-verify>
        </Modal>

        <Modal
            v-model="register"
            @on-ok="LoginRegister"
            :title="$t('sign')"
            :ok-text="$t('sign')"
            :mask-closable="false"
        >
            <Form ref="user_reg" :model="userinfo" :rules="userInfoValidate">
                <FormItem :label="$t('sign_userInfo.username')" prop="username">
                    <Input v-model="userinfo.username"></Input>
                </FormItem>

                <FormItem :label="$t('sign_userInfo.password')" prop="password">
                    <Input type="password" v-model="userinfo.password"></Input>
                </FormItem>

                <FormItem :label="$t('sign_userInfo.confirm')" prop="confirm_password">
                    <Input v-model="userinfo.confirm_password" type="password"></Input>
                </FormItem>

                <FormItem prop="real_name" :label="$t('sign_userInfo.real')">
                    <Input v-model="userinfo.real_name"></Input>
                </FormItem>

                <FormItem prop="department" :label="$t('sign_userInfo.department')">
                    <Input v-model="userinfo.department"></Input>
                </FormItem>

                <FormItem prop="mail" :label="$t('sign_userInfo.mail')">
                    <Input v-model="userinfo.mail"></Input>
                </FormItem>
            </Form>
        </Modal>

        <Modal v-model="sponsorship" :title="$t('sponsor_title')" width="640">
            <h3>{{ $t('sponsor_1') }}</h3>
            {{ $t('sponsor_2') }}
            <br/>
            <br/>
            <h3>{{ $t('sponsor_3') }}</h3>
            {{ $t('sponsor_4') }}
            <br/>
            <br/>
            <h3>{{ $t('sponsor_5') }}</h3>
            {{ $t('sponsor_6') }}
            <br/>
            {{ $t('sponsor_7') }}
            <br/>
            <br/>
            <img style="height:300px;width:300px" src="../../assets/alipay.jpg" alt=""/>
            <img style="height:300px;width:300px" src="../../assets/wechat.jpg" alt=""/>
        </Modal>

    </div>

</template>
<script lang="ts">
import SIdentify from '@/components/identify.vue'
import {Mixins, Component} from "vue-property-decorator";
import i18n from '@/language';
import Basic from "@/mixins/basic";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import {request} from "@/libs/requests";
import {LoginApi} from "@/apis/loginApis";

@Component({components: {SIdentify}})
export default class login extends Mixins(Basic) {

    valid_password = (rule: any, value: string, callback: any) => {
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
    is_verify = false
    switchCode = false;
    sponsorship = false;
    register = false;
    userinfo = {
        username: '',
        password: '',
        confirm_password: '',
        mail: '',
        real_name: '',
        department: ''
    };
    userInfoValidate = {
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
        confirm_password: [
            {
                required: true,
                message: i18n.t('sign_up_validate.confirm'),
                trigger: 'blur'
            },
            {
                validator: this.valid_password,
                trigger: 'blur'
            }
        ],
        real_name: [
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
        mail: [
            {required: true, message: i18n.t('sign_up_validate.mail'), trigger: 'blur'},
            {type: 'email', message: i18n.t('sign_up_validate.mail_format'), trigger: 'blur'}
        ]
    };
    formInline = {
        user: '',
        password: '',
    };

    onSuccess() {
        this.$Message.success('验证成功!')
        this.signIn()
        this.is_verify = false
        let ref = this.$refs.slideblock as any
        ref.reset();
    }

    LoginRegister() {
        let is_validate: any = this.$refs['user_reg'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                request.post("/register", this.userinfo)
                    .finally(() => this.resetFields('user_reg'))
            } else {
                this.$config.notice(i18n.t('sign_up_validate.sign_fail') as string)
            }
        })
    }

    signIn() {
        LoginApi(this.is_open, {
            username: this.formInline.user,
            password: this.formInline.password
        })
            .then((res: AxiosResponse<Res>) => {
                if (res.data.payload.code === 1301) {
                    return
                }
                request.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.payload.token;
                sessionStorage.setItem('jwt', 'Bearer ' + res.data.payload.token)
                sessionStorage.setItem('user', this.formInline.user);
                sessionStorage.setItem('auth', res.data.payload.permissions);
                sessionStorage.setItem('real_name', res.data.payload.real_name);
                let auth = res.data.payload.permissions
                if (auth === 'guest') {
                    sessionStorage.setItem('access', '1')
                } else if (auth === 'admin' || auth === 'perform') {
                    sessionStorage.setItem('access', '2')
                } else if (auth === 'super') {
                    sessionStorage.setItem('access', '3')
                }
                this.$router.push({name: 'home_index'})
            })
    }

    vedioCanPlay = false
    fixStyle = '' as any

    canplay() {
        this.vedioCanPlay = true
    }

    mask() {
        const windowWidth = document.body.clientWidth
        const windowHeight = document.body.clientHeight
        const windowAspectRatio = windowHeight / windowWidth
        let videoWidth
        let videoHeight
        if (windowAspectRatio < 0.5625) {
            videoWidth = windowWidth
            videoHeight = videoWidth * 0.5625
            this.fixStyle = {
                height: windowWidth * 0.5625 + 'px',
                width: windowWidth + 'px',
                'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
                'margin-left': 'initial'
            }
        } else {
            videoHeight = windowHeight
            videoWidth = videoHeight / 0.5625
            this.fixStyle = {
                height: windowHeight + 'px',
                width: windowHeight / 0.5625 + 'px',
                'margin-left': (windowWidth - videoWidth) / 2 + 'px',
                'margin-bottom': 'initial'
            }
        }
    }

    mounted() {
        window.onresize = () => {
            this.mask()
        }
        this.mask()
        request.get(`/fetch`)
            .then((res: AxiosResponse<Res>) => {
                this.switchCode = res.data.payload.reg;
            })
    }
}
</script>
