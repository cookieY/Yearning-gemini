<template>
    <div>
        <Form>
            <FormItem v-if="c_flag === 0">
                <Select v-model="personal" placeholder="请选择下一级审核人" style="width: 20%">
                    <Option v-for="i in p_flag" :key="i" :value="i" :label="i"></Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click.native="testTo()" :loading="loading">
                    <span v-if="!loading">检测sql</span>
                    <span v-else>检测中</span>
                </Button>
                <Button type="error" @click="reject()" class="margin-left-10">驳回</Button>
                <Button type="success" @click="agreed()" :disabled="summit" v-if="c_flag ===0" class="margin-left-10">
                    同意
                </Button>
                <Button type="success" @click="perform()" :disabled="summit" class="margin-left-10" v-else>执行</Button>
            </FormItem>
            <FormItem>
                <Table :columns="sql_columns" :data="sql_data" :max-height="300"></Table>
            </FormItem>
        </Form>
        <reject v-model="is_open"></reject>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import render from "@/interface/render";
    import modules_order from "@/store/modules/order";
    import detail_mixin from "@/mixins/detail_mixin";
    import reject from "@/views/audit/order/reject.vue";
    import module_init_args from "@/store/modules/init_args";

    @Component({components: {reject}})
    export default class Testing extends Mixins(detail_mixin) {
        auth = sessionStorage.getItem('auth');
        summit = true;
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
        personal = ''

        get sql_data() {
            return modules_order.order_sql;
        }

        set sql_data(vl) {
            modules_order.fetch_order_sql(vl)
        }

        get c_flag() {
            let flag = this.order.current_step as number;
            if (flag >= module_init_args.order_step.length) {
                flag = 0
            }
            return module_init_args.order_step[flag].type
        }

        get p_flag() {
            let flag = this.order.current_step as number;
            if (flag >= module_init_args.order_step.length || this.c_flag === 1) {
                flag = 0
            } else {
                flag = flag + 1
            }
            return module_init_args.order_step[flag].auditor
        }

        reject() {
            this.is_open = !this.is_open
        }

        agreed() {
            if (this.personal === '') {
                this.$Message.error({content:'请选择下一级审核人!'})
                return
            }
            this.$http.post(`${this.$config.url}/audit/agree`, {
                // 接口需要修改 取消执行人角色
                'work_id': this.order.work_id,
                'perform': this.personal,
                'flag': this.order.current_step
            })
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data);
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
                .finally(() => {
                    this.$router.go(-1)
                    this.summit = !this.summit
                })
        }

        perform() {
            this.$http.post(`${this.$config.url}/audit/execute`, {
                'work_id': this.order.work_id
            })
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data);
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
                .finally(() => {
                    this.summit = !this.summit
                    this.$router.go(-1)
                })
        }

        testTo() {
            this.loading = true;
            this.$http.post(`${this.$config.url}/audit/test`, {
                work_id: this.order.work_id
            })
                .then((res: { data: object[]; }) => {
                    this.sql_data = res.data;
                    let gen = 0;
                    this.sql_data.forEach(vl => {
                        if (vl.level !== 0) {
                            gen += 1
                        }
                    });
                    this.summit = gen !== 0;
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
                .finally(() => {
                    this.loading = false
                })
        }
    }
</script>

<style lang="less">
    @import "../../styles/common";
</style>
