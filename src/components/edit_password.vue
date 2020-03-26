<template>
  <Modal v-model="open" :width="500" @on-ok="change_password" transfer :z-index="9999">
    <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
    <Form ref="editPasswordForm" :model="form" :label-width="100" label-position="right"
          :rules="validate_form">
      <FormItem label="用户">
        <Input v-model="username" readonly></Input>
      </FormItem>
      <FormItem label="新密码" prop="password">
        <Input v-model="form.password" placeholder="请输入新密码，至少6位字符" type="password"></Input>
      </FormItem>
      <FormItem label="确认新密码" prop="confirm">
        <Input v-model="form.confirm" placeholder="请再次输入新密码" type="password"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
    import axios from "axios";

    const regExp_password = (rule, value, callback) => {
        let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
        if (!pPattern.test(value)) {
            callback(new Error('至少1个大写字母,1个小写字母,1个数字'))
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
                    callback(new Error('两次输入密码不一致'))
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
                            message: '请输入原密码',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入新密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            message: '请至少输入6个字符',
                            trigger: 'blur'
                        },
                        {
                            max: 32,
                            message: '最多输入32个字符',
                            trigger: 'blur'
                        },
                        {
                            validator: regExp_password,
                            trigger: 'blur'
                        }
                    ],
                    confirm: [{
                        required: true,
                        message: '请再次输入新密码',
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
                let url = `user/password_reset`;
                this.$refs['editPasswordForm'].validate((valid) => {
                    if (valid) {
                        if (this.is_admin) {
                            url = `management_user/password_reset`
                        }
                        axios.post(`${this.$config.url}/${url}`, {
                            'username': this.username,
                            'new': this.form.password
                        })
                            .then(res => {
                                this.$config.notice(res.data);
                            })
                            .catch(error => {
                        this.$config.err_notice(this,error)
                    });
                    }
                });
                this.$config.clearObj(this.formItem)
            }
        },
    }
</script>

<style scoped>

</style>
