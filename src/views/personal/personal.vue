<template>
    <div>
        <Form ref="userForm" label-position="right" >
            <FormItem :label="$t('general.name')" >
                    <span>{{ userForm.username }}</span>
            </FormItem>
            <FormItem :label="$t('general.real')" >
                    <span>{{ userForm.real_name }}</span>
            </FormItem>
            <FormItem :label="$t('general.department')">
                <span>{{ userForm.department }}</span>
            </FormItem>
            <FormItem :label="$t('general.role')">
                <span>{{ userForm.rule }}</span>
            </FormItem>
            <FormItem :label="$t('general.mail')">
                <span>{{ userForm.email }}</span>
            </FormItem>
            <FormItem>
                <Button type="warning" size="small" @click="show_edit_password">{{ $t('general.change_password') }}
                </Button>
                <Button type="primary" size="small" @click="openMailChange" class="margin-left-10">
                    {{ $t('dash.edit_permissions') }}
                </Button>
                <Button type="success" size="small" @click="is_open = true" class="margin-left-10">
                    {{ $t('general.show_permissions') }}
                </Button>
            </FormItem>
        </Form>

        <Modal v-model="editEmailModal" :width="500" @on-ok="saveEmail">
            <h3 slot="header" style="color:#2D8CF0">{{ $t('dash.edit_permissions') }}</h3>
            <Form :label-width="100" label-position="right">
                <FormItem :label="$t('general.mail')">
                    <Input v-model="editEmailForm.email"></Input>
                </FormItem>
                <FormItem :label="$t('general.real')">
                    <Input v-model="editEmailForm.real_name"></Input>
                </FormItem>
            </Form>
        </Modal>

        <RulesLimits v-model="is_open"></RulesLimits>
        <ChangePassword v-model="edit_password" :username="userForm.username"></ChangePassword>
    </div>
</template>

<script lang="ts">
import ChangePassword from "@/components/modal/changePassword.vue";
import RulesLimits from "@/components/modal/rulesLimits.vue";
import Basic from "@/mixins/basic";
import {Component, Mixins} from "vue-property-decorator";
import module_verify from "@/store/modules/verify";
import module_general from "@/store/modules/general";
import module_user from "@/store/modules/user";
import {CommonChangeEmail} from "@/apis/personalApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import {DashPutApi} from "@/apis/dashApis";

@Component({components: {ChangePassword, RulesLimits}})
export default class Personal extends Mixins(Basic) {
    editEmailModal = false;
    editEmailForm = {
        email: '',
        real_name: ''
    };
    userForm = {
        username: '',
        id: '',
        password: '',
        rule: '',
        department: '',
        real_name: '',
        email: ''
    };

    show_edit_password() {
        this.edit_password = !this.edit_password
        module_user.change_username(this.userForm.username)
    }

    openMailChange() {
        this.editEmailModal = true;
        this.editEmailForm = JSON.parse(JSON.stringify(this.userForm))
    }

    saveEmail() {
        CommonChangeEmail(this.editEmailForm)
            .finally(() => {
                sessionStorage.setItem('real_name', this.editEmailForm.real_name)
            })
    }

    init() {
        DashPutApi('profile')
            .then((res: AxiosResponse<Res>) => {
                this.userForm = res.data.payload.u;
                module_verify.fetch_user_permissions({
                    username: res.data.payload.u.username,
                    list: res.data.payload.g,
                    group: res.data.payload.p
                })
                module_general.changed_stmt_status(res.data.payload.s.Stmt === 0)
            })
    }

    mounted() {
        this.init()
    }
}
</script>

