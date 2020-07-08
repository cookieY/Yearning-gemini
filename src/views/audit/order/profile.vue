<template>
    <Modal v-model="is_open" width="1000" @on-cancel="cancel">
        <p slot="header" style="color:#f60;font-size: 16px">
            <Icon type="information-circled"></Icon>
            <span>SQL工单详细信息</span>
        </p>
        <Form label-position="right">
            <FormItem label="环境:">
                <span>{{ order.idc }}</span>
            </FormItem>
            <FormItem label="连接名称:">
                <span>{{ order.source }}</span>
            </FormItem>
            <FormItem label="数据库库名:">
                <span>{{ order.data_base }}</span>
            </FormItem>
            <FormItem label="数据库表名:">
                <span>{{ order.table }}</span>
            </FormItem>
            <FormItem label="定时执行:">
                <span>{{ order.delay }}</span>
            </FormItem>
            <FormItem label="工单说明:">
                <span>{{ order.text }}</span>
            </FormItem>
            <FormItem>
                <Table :columns="sql_columns" :data="sql_data" :max-height="300"></Table>
            </FormItem>
            <FormItem label="选择执行人:" v-if="is_multi && auth === 'admin'" required>
                <Select v-model="multi_name" style="width: 20%">
                    <Option v-for="i in multi_list" :value="i.username" :key="i.username">{{i.username}}</Option>
                </Select>
            </FormItem>
        </Form>

        <div slot="footer">
            <Button type="warning" @click.native="testTo()" :loading="loading">
                <span v-if="!loading">检测sql</span>
                <span v-else>检测中</span>
            </Button>
            <Button type="error" @click="reject()">驳回</Button>
            <template v-if="is_multi">
                <Button type="success" @click="agreed()" :disabled="summit"
                        v-if="auth === 'admin' || auth === 'super'">
                    同意
                </Button>
                <Button type="success" @click="perform()" :disabled="summit" v-if="auth === 'perform'">执行</Button>
            </template>
            <template v-else>
                <Button type="success" @click="perform()" :disabled="summit">执行</Button>
            </template>
        </div>
    </Modal>
</template>

<script lang="ts">
    import {Component, Mixins, Prop, Watch} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";
    import render from "@/interface/render";

    @Component({components: {}})
    export default class audit_detail extends Mixins(att_mixins) {
        auth = sessionStorage.getItem('auth');
        summit = true;
        multi_name = '';
        is_multi = false
        sql_columns = [
            {
                type: 'expand',
                width: 50,
                render: render.expand
            },
            {
                title: '当前检查的sql',
                key: 'sql',
                render: render.sub_sql

            },
            {
                title: '阶段',
                key: 'status',
                width: '150'
            },
            {
                title: '错误等级',
                key: 'level',
                width: '100'
            },
            {
                title: '错误信息',
                key: 'error',
                tooltip: true
            },
            {
                title: '影响行数',
                key: 'affect_rows',
                width: '120'
            }
        ];

        @Prop({
            type: Boolean,
            required: true,
            default: false
        }) public value !: boolean;

        @Watch('value')
        get_visible(vl: boolean) {
            if (vl && this.is_multi && this.auth === 'admin') {
                this.fetch_perform()
            }
            this.is_open = vl
        }

        get order() {
            return this.$store.state.init_args.order_item
        }

        get sql_data() {
            return this.$store.state.order_sql;
        }

        set sql_data(vl) {
            this.$store.state.order_sql = vl;
        }

        reject() {
            this.$emit("reject")
        }

        agreed() {
            this.$emit("agreed", this.multi_name, this.order.work_id)
        }

        perform() {
            this.$emit("perform", this.order.work_id)
        }

        cancel() {
            this.$emit("input", false);
            this.summit = true
        }

        fetch_perform() {
            this.$http.get(`${this.$config.url}/fetch/perform`)
                .then((res: { data: { perform: string[], multi: boolean }; }) => {
                    this.multi_list = res.data.perform
                    this.is_multi = res.data.multi
                })
                .catch((err: any) => this.$config.err_notice(this, err))
        }

        testTo() {
            this.loading = true;
            let s = '';
            for (let i of this.sql_data) {
                s += i.sql
            }
            let isDML = this.order.type === 1;
            this.$http.put(`${this.$config.url}/fetch/test`, {
                'source': this.order.source,
                'database': this.order.data_base,
                'table': this.order.table,
                'sql': s,
                'isDMl': isDML
            })
                .then((res: { data: string[]; }) => {
                    this.sql_data = res.data;
                    let gen = 0;
                    this.sql_data.forEach((vl: { level: number; }) => {
                        if (vl.level !== 0) {
                            gen += 1
                        }
                    });
                    this.summit = gen !== 0;
                    this.loading = false
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }
    }
</script>