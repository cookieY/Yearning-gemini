<template>
    <Card>
        <p slot="title">
            <Icon type="md-bulb"/>
            审核规则
        </p>
        <Row>
            <Col :span="15">
                <Input placeholder="根据描述信息搜索" v-model="find.text"
                       clearable @on-clear="clear_data" @on-enter="search_data"/>

            </Col>
            <Col :span="1">
                <Button @click="search_data" class="margin-left-10" type="primary">搜索</Button>
            </Col>
            <Col :span="1" offset="2">
                <Affix :offset-top="100">
                    <Button type="info" @click="referRoles" class="margin-left-10">保存</Button>
                </Affix>
            </Col>
        </Row>
        <br>
        <Table :columns="col" :data="tb_data" border>
            <template slot-scope="{row}" slot="switch">
                <i-switch size="large" v-model="juno[row.name]" v-if="row.tp === 0">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
                <InputNumber v-model="juno[row.name]" v-else-if="row.tp === 1"></InputNumber>
                <Input v-model="juno[row.name]" v-else></Input>
            </template>
        </Table>
    </Card>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    // eslint-disable-next-line no-unused-vars
    import {rule, Rule} from "@/views/management/role/role_args";
    import att_mixins from "@/mixins/basic";

    @Component({components: {}})
    export default class Role extends Mixins(att_mixins) {
        juno = {
            DMLMaxInsertRows: 2
        };

        col = [
            {
                title: '规则类型',
                key: 'type'
            },
            {
                title: '规则描述',
                key: 'desc'
            },
            {
                title: '开关',
                key: 'switch',
                slot: 'switch'
            },
        ]

        tb_data: Rule[] = rule

        clear_data() {
            this.tb_data = rule
        }

        search_data() {
            let tb: Rule[] = []
            this.tb_data.forEach((item: Rule) => {
                if (item.desc.indexOf(this.find.text) !== -1) {
                    tb.push(item)
                }
            })
            this.tb_data = tb
        }

        referRoles() {
            this.$http.post(`${this.$config.url}/group/setting/roles`, {
                'juno': this.juno
            })
                .then((res: { data: string; }) => {
                    this.$config.notice(res.data)
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }

        mounted() {
            this.$http.get(`${this.$config.url}/group/setting`)
                .then((res: { data: { AuditRole: any; }; }) => {
                    this.juno = res.data.AuditRole
                })
                .catch((error: any) => {
                    this.$config.err_notice(this, error)
                })
        }
    }
</script>

<style lang="less" scoped>
    @import "../../styles/common.less";
</style>
