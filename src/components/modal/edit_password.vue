<template>
    <Modal v-model="is_open" :width="500" @on-ok="change_password" transfer @on-cancel="cancel">
        <h3 slot="header" style="color:#2D8CF0">{{ $t('general.change_password') }}</h3>
        <Form ref="editPasswordForm" :model="form" :label-width="100" label-position="right"
              :rules="validate_form">
            <FormItem :label="$t('general.name')">
                <Input v-model="info.username" readonly></Input>
            </FormItem>
            <FormItem :label="$t('sign_userInfo.password')" prop="password">
                <Input v-model="form.password" :placeholder="$t('sign_up_validate.min')" type="password"></Input>
            </FormItem>
            <FormItem :label="$t('sign_userInfo.confirm')" prop="confirm">
                <Input v-model="form.confirm" type="password"></Input>
            </FormItem>
        </Form>
    </Modal>
</template>

<script lang="ts">
import i18n from "@/language";
import {Component, Mixins, Prop, Watch} from "vue-property-decorator";
import att_mixins from "@/mixins/basic";
import module_user from "@/store/modules/user";
import {AdminChangePassword, CommonChangePassword} from "@/apis/changePasswordApis";

@Component({})
export default class edit_password extends Mixins(att_mixins) {

    regExp_password = (rule: any, value: string, callback: any) => {
        let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
        if (!pPattern.test(value)) {
            callback(new Error('至少1个大写字母,1个小写字母,1个数字'))
        } else {
            callback()
        }
    };

    validate_password = (rule: any, value: string, callback: any) => {
        if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致'))
        } else {
            callback()
        }
    };

    @Prop({
        required: true,
        type: Boolean,
        default: false
    }) value !: boolean

    @Watch('value')
    get_visible(vl: boolean) {
        this.is_open = vl
    }

    @Prop({
        type: Boolean,
        default: false
    }) public is_admin !: boolean

    form = {
        password: '',
        confirm: '',
    }

    validate_form = {
        old_password: [
            {
                required: true,
                message: i18n.t('sign_up_validate.password'),
                trigger: 'blur'
            }
        ],
        password: [
            {
                required: true,
                message: i18n.t('sign_up_validate.confirm'),
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
        confirm: [
            {
                required: true,
                message: i18n.t('sign_up_validate.confirm'),
                trigger: 'blur'
            },
            {
                validator: this.validate_password,
                trigger: 'blur'
            }
        ]
    }

    get info() {
        return module_user.edit
    }

    change_password() {
        let validate: any = this.$refs['editPasswordForm']
        validate.validate((valid: any) => {
            if (valid) {
                this.is_admin ? AdminChangePassword({
                    username: this.info.username as string,
                    password: this.form.password
                }).finally(() => {
                    this.cancel()
                    this.resetFields('editPasswordForm')
                }) : CommonChangePassword({
                    username: this.info.username as string,
                    password: this.form.password
                })
                    .finally(() => {
                        this.cancel()
                        this.resetFields('editPasswordForm')
                    })
            } else {
                this.$config.notice("密码提交格式错误！")
            }
        });
    }
}
</script>

<style scoped>

</style>
