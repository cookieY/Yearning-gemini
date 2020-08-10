<template>
    <Row type="flex" justify="center">
        <Card style="min-height: 800px;width: 98%">
            <p slot="title">
                <Icon type="md-trophy"/>
                流程模板
            </p>
            <div>
                <List>
                    <ListItem v-for="i in tml_list" :key="i.title">
                        <ListItemMeta :avatar="tpl"
                                      :title="i.title" :description="i.desc"/>
                        <template slot="action">
                            <li>
                                <Button type="text" @click="open_order">编辑</Button>
                            </li>
                        </template>
                    </ListItem>
                </List>
            </div>
        </Card>


        <Modal v-model="is_open" title="编辑流程模板" width="800">
            <Steps :current="0" size="small">
                <Step v-for="i in tml.tmp_steps" :key="i.title" :title="i.desc" :content="i.auditor"></Step>
            </Steps>
            <Divider orientation="left" dashed>添加审核阶段</Divider>
            <div>
                <Row>
                    <Col span="12">
                        <Form>
                            <FormItem label="审核人">
                                <Select v-model="tml.tmp_person">
                                    <Option v-for="i in multi_list" :key="i.username" :value="i.username"
                                            :label="i.username"></Option>
                                </Select>
                            </FormItem>
                            <FormItem label="阶段描述">
                                <Input v-model="tml.tmp_desc"></Input>
                            </FormItem>
                        </Form>
                        <Button type="primary" size="small" @click="add_step">添加中间审核环节</Button>
                    </Col>
                    <Col span="11" offset="1">
                        <Alert show-icon>
                            一点小建议
                            <Icon type="ios-bulb-outline" slot="icon"></Icon>
                            <template slot="desc">
                                1.中间审核人最多支持5层
                                <br>
                                2.保存后自动添加执行步骤,无需关心执行步骤不显示的问题。
                            </template>
                        </Alert>
                    </Col>
                </Row>
            </div>
        </Modal>
    </Row>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";

    @Component({})
    export default class FlowTemplate extends Mixins(att_mixins) {
        tpl = require("../../assets/tpl.svg")
        tml_list: any = []
        tml = {
            tmp_person: '',
            tmp_desc: '',
            tmp_steps: [] as any,
            tmp_executor: {
                desc: '执行阶段',
                auditor: '数据源管理员审核并执行',
                type: 1  // 0 audit 1 executor
            }
        }

        tpl_step = [
            {
                desc: '提交阶段',
                auditor: '提交人提交工单',
                type: 0  // 0 audit 1 executor
            },
            {
                desc: '执行阶段',
                auditor: '数据源管理员审核并执行',
                type: 1  // 0 audit 1 executor
            }
        ]

        open_order() {
            // 如果回传为null 则使用初始化数据
            this.tml.tmp_steps = this.tpl_step
            this.fetch_perform()
            this.is_open = !this.is_open
        }

        fetch_all_sources() {
            this.$http.get(`${this.$config.url}/tpl`)
                .then((res: { data: any; }) => {
                    for (let i of res.data) {
                        this.tml_list.push({title: i.source, desc: `${i.source}数据源审核流程`})
                    }
                })
                .catch((err: any) => this.$config.err_notice(this, err))
        }

        add_step() {
            if (this.tml.tmp_steps.length === 7) {
                this.$Message.warning({
                    content: '中间审核环节最多支持5层'
                })
                return
            }
            this.tml.tmp_steps.pop()
            this.tml.tmp_steps.push({desc: this.tml.tmp_desc, auditor: `审核人:${this.tml.tmp_person}`, type: 0})
            this.tml.tmp_steps.push(this.tml.tmp_executor)
        }

        mounted() {
            this.fetch_all_sources()
        }
    }
</script>