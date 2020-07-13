<template>
    <Modal v-model="is_open" :width="800" @on-cancel="cancel" @on-ok="is_post">
        <h3 slot="header" style="color:#2D8CF0">用户权限</h3>
        <Form :label-width="120" label-position="top">
            <FormItem label="用户名">
                <Input v-model="rule.username" readonly></Input>
            </FormItem>
            <FormItem label="权限组" v-show="is_admin">
                <Select v-model="rule.group" @on-change="marge_group" clearable multiple filterable>
                    <Option v-for=" i in rule.list" :key="i.name" :value="i.name" :label="i.name"></Option>
                </Select>
            </FormItem>
            <template>
                <template>
                    <FormItem label="DDL数据源:">
                        <Tag color="purple" v-for="i in permission.ddl_source" :key="i"> {{i}}</Tag>
                    </FormItem>
                </template>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <template>
                    <FormItem label="DML数据源:">
                        <Tag color="geekblue" v-for="i in permission.dml_source" :key="i"> {{i}}</Tag>
                    </FormItem>
                </template>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <template>
                    <FormItem label="查询数据源:">
                        <Tag color="blue" v-for="i in permission.query_source" :key="i"> {{i}}</Tag>
                    </FormItem>
                </template>
                <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
                <br>
                <FormItem label="选择查询审核人:">
                    <Tag color="cyan" v-for="i in permission.auditor" :key="i"> {{i}}</Tag>
                </FormItem>
            </template>
        </Form>
    </Modal>
</template>

<script lang="ts">

    import {Component, Mixins, Prop, Watch} from "vue-property-decorator";

    import att_mixins from "@/mixins/basic";
    import module_verify from "@/store/modules/verify";

    @Component({components: {}})
    export default class edit_rule extends Mixins(att_mixins) {
        permission = {
            ddl_source: [],
            dml_source: [],
            query_source: [],
            auditor: []
        }

        @Prop({
            type: Boolean,
            default: false
        }) public is_admin !: boolean

        @Prop({
            type: Boolean,
            required: true,
            default: false
        }) public value !: boolean;

        @Watch('value')
        get_visible(vl: boolean) {
            this.is_open = vl
        }

        get rule() {
            return module_verify.group
        }

        set rule(vl) {
            module_verify.fetch_user_permissions(vl)
        }

        is_post() {
            if (this.is_admin) {
                this.$http.post(`${this.$config.url}/group/update`, {
                    'username': this.rule.username,
                    'permission': this.permission,
                    'group': this.rule.group,
                })
                    .then((res: { data: string; }) => {
                        this.$config.notice(res.data);
                        this.$emit('success');
                        this.cancel()
                    })
                    .catch((error: any) => {
                        this.$config.err_notice(this, error)
                    })
            }
        }

        marge_group(group: never[]) {
            this.$http.post(`${this.$config.url}/fetch/marge`, {
                "user": this.rule.username,
                "group": group,
            })
                .then((res: { data: { ddl_source: never[]; dml_source: never[]; query_source: never[]; auditor: never[]; }; }) => {
                    this.permission = res.data;
                })
                .catch((err: any) => this.$config.err_notice(this, err))
        }
    }
</script>
