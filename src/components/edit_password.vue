<template>
  <Modal v-model="open" :width="500" @on-ok="change_password" transfer :z-index="9999">
    <h3 slot="header" style="color:#2D8CF0">{{$t('general.change_password')}}</h3>
    <Form ref="editPasswordForm" :model="form" :label-width="100" label-position="right"
          :rules="validate_form">
      <FormItem :label="$t('general.name')">
        <Input v-model="username" readonly></Input>
      </FormItem>
      <FormItem :label="$t('sign_userInfo.password')" prop="password">
        <Input v-model="form.password" :placeholder="$t('sign_up_validate.min')" type="password"></Input>
      </FormItem>
      <FormItem :label="$t('sign_userInfo.confirm')" prop="confirm">
        <Input v-model="form.confirm"  type="password"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
    import axios from "axios";
    import i18n from "@/language";

    const regExp_password = (rule, value, callback) => {
        let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
        if (!pPattern.test(value)) {
            callback(new Error(i18n.t('sign_up_validate.regexp')))
        } else {
            callback()
        }
    };

    export default {
        name: "edit_password",
        props: {
            is_open: Boolean,
            username: String,
            is_admin: Boolean
        },
        computed: {
            open: {
                get () {
                    return this.is_open
                },
                set (){
                    this.$emit("cancel")
                }
            }
        },
        data() {
            const validate_password = (rule, value, callback) => {
                if (value !== this.form.password) {
                  callback(new Error(i18n.t('sign_up_validate.twice')))
                } else {
                    callback()
                }
            };
            return {
                form: {
                    old_password: '',
                    password: '',
                    confirm: ''
                },
                validate_form: {
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
                            validator: regExp_password,
                            trigger: 'blur'
                        }
                    ],
                    confirm: [{
                        required: true,
                        message: i18n.t('sign_up_validate.confirm'),
                        trigger: 'blur'
                    },
                        {
                            validator: validate_password,
                            trigger: 'blur'
                        }
                    ]
                },
            }
        },
        methods: {
            change_password() {
                let url = `user/edit/password`;
                this.$refs['editPasswordForm'].validate((valid) => {
                    if (valid) {
                        if (this.is_admin) {
                            url = `manage_user`
                        }
                        axios.put(`${this.$config.url}/${url}`, {
                            'username': this.username,
                            'new': this.form.password,
                            'tp': 'password',
                        })
                            .then(res => {
                                this.$config.notice(res.data);
                            })
                            .catch(error => {
                                this.$config.err_notice(this, error)
                            });
                    } else {
                       this.$config.notice("密码提交格式错误！")
                    }
                });
                this.$config.clearObj(this.formItem)
            }
        },
    }
</script>

<style scoped>

</style>
