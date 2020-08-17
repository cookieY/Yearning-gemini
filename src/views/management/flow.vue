<template>
    <Row type="flex" justify="center">
        <Card style="min-height: 800px;width: 98%">
            <p slot="title">
                <Icon type="md-trophy"/>
                流程模板
            </p>
            <div>
                <List>
                    <ListItem v-for="i in tpl_list" :key="i.title">
                        <ListItemMeta :avatar="tpl_logo"
                                      :title="i.title" :description="i.desc"/>
                        <template slot="action">
                            <li>
                                <Button type="text" @click="open_order(i.title)">编辑</Button>
                            </li>
                        </template>
                    </ListItem>
                </List>
            </div>
        </Card>

        <Modal v-model="is_open" title="编辑流程模板" width="1000" @on-ok="post_tpl">
            <Steps :current="0" size="small">
                <Step v-for="i in tmp_steps" :key="i.title" :title="i.desc" :content="`相关人员:${i.auditor}`"></Step>
            </Steps>
            <Divider orientation="left" dashed>添加阶段</Divider>
            <div>
                <Row>
                    <Col span="12">
                        <Tabs value="preview">
                            <TabPane label="预览编辑" name="preview">
                                <Form>
                                    <FormItem label="步骤类型">
                                        <Select v-model="tpl.tmp_type">
                                            <Option label="审核" :value="0"></Option>
                                            <Option label="执行" :value="1"></Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="相关人员">
                                        <Select v-model="tpl.tmp_person" multiple>
                                            <Option v-for="i in multi_list" :key="i.username" :value="i.username"
                                                    :label="i.username"></Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="阶段描述">
                                        <Input v-model="tpl.tmp_desc"></Input>
                                    </FormItem>
                                </Form>
                                <Button type="primary" size="small" @click="add_step">添加阶段</Button>
                            </TabPane>
                            <TabPane label="代码编辑">
                                <Input v-model="raw_code" type="textarea" :rows="12"></Input>
                                <br>
                                <br>
                                <Button type="primary" @click="raw_gen" size="small"> 生成</Button>
                            </TabPane>
                        </Tabs>

                    </Col>
                    <Col span="11" offset="1">
                        <Alert show-icon>
                            一点小建议
                            <Icon type="ios-bulb-outline" slot="icon"></Icon>
                            <template slot="desc">
                                1.中间审核人最多支持5层
                                <br>
                                2.可使用预览编辑/代码编辑两种方式编辑(预览编辑不支持删除,更改顺序)
                                <br>
                                3.代码编辑参数解释:
                                <br>
                                desc 阶段描述,
                                <br>
                                auditor 审核人username,
                                <br>
                                type 0(审核) 1(执行)
                                <br>
                                4.仅允许一个执行阶段! 请将审核阶段的参数添加在执行阶段之前。
                                <br>
                                5.如代码编辑后点击生成无法生成对应步骤,请检查JSON格式是否正确!
                                <br>
                                6.特别注意,如对现有流程进行更改。请确保当前流程下所有工单都已执行完毕，否则将会导致未执行工单流程错乱!
                            </template>
                        </Alert>
                    </Col>
                </Row>
            </div>
        </Modal>
    </Row>
</template>

<script lang="ts">
    import {Component, Mixins, Watch} from "vue-property-decorator";
    import att_mixins from "@/mixins/basic";

    @Component({})
    export default class FlowTemplate extends Mixins(att_mixins) {
        tpl_logo = require("../../assets/tpl.svg")
        tpl_list: any = []
        tpl = {
            tmp_person: [],
            tmp_desc: '',
            tmp_type: 0,
            source: ''
        }

        raw_code = ''

        tmp_steps = [] as any

        tpl_step = [
            {
                desc: '提交阶段',
                auditor: ['提交人'],
                type: 0  // 0 audit 1 executor
            }
        ]

        @Watch('tmp_steps')
        get_raw_code(tmp_steps: any) {
            this.raw_code = JSON.stringify(tmp_steps, null, '\t')
        }

        post_tpl() {
            this.$http.post(`${this.$config.url}/tpl`, {
                steps: this.tmp_steps,
                source: this.tpl.source
            })
                .then((res: { data: string; }) => this.$config.notice(res.data))
                .catch((err: any) => this.$config.err_notice(this, err))
        }

        open_order(vl: string) {
            // 如果回传为null 则使用初始化数据
            this.$http.put(`${this.$config.url}/tpl`, {
                source: vl
            })
                .then((res: { data: any; }) => {
                    if (res.data.steps === null) {
                        this.tmp_steps = this.tpl_step
                    } else {
                        this.tmp_steps = res.data.steps
                    }
                })
                .catch((err: any) => this.$config.err_notice(this, err))
                .finally(() => {
                    this.is_open = !this.is_open
                    this.tpl.source = vl
                })

        }

        fetch_all_sources() {
            this.$http.get(`${this.$config.url}/tpl`)
                .then((res: { data: any; }) => {
                    for (let i of res.data) {
                        this.tpl_list.push({title: i.source, desc: `${i.source}数据源审核流程`})
                    }
                })
                .catch((err: any) => this.$config.err_notice(this, err))
        }

        raw_gen() {
            try {
                this.tmp_steps = JSON.parse(this.raw_code)
            } catch (e) {
                this.$Message.error({content: e, duration: 10})
            }
        }

        add_step() {
            if (this.tpl.tmp_type === 1) {
                for (let i of this.tmp_steps) {
                    if (i.type === 1) {
                        this.$Message.warning({content: '执行阶段仅允许添加一次!'})
                        return;
                    }
                }
            }
            if (this.tmp_steps.length === 7) {
                this.$Message.warning({
                    content: '中间审核环节最多支持5层'
                })
                return
            }
            this.tmp_steps.push({desc: this.tpl.tmp_desc, auditor: this.tpl.tmp_person, type: this.tpl.tmp_type})
        }

        mounted() {
            this.fetch_perform()
            this.fetch_all_sources()
        }
    }
</script>