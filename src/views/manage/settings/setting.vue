<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="md-settings"></Icon>
                        基础设置
                    </p>
                    <Row>
                        <Col span="12">
                            <Card>
                                <p slot="title">消息推送</p>
                                <Form :label-width="120">
                                    <FormItem label="webhook地址:">
                                        <Input placeholder="支持钉钉/企业微信(赞助版本) webhook机器人"
                                               v-model="message.web_hook"></Input>
                                    </FormItem>
                                    <FormItem label="webhook Secret Key:">
                                        <Input placeholder="钉钉hook secret key"
                                               v-model="message.key"  type="password" password> </Input>
                                    </FormItem>
                                    <FormItem label="邮件SMTP服务地址:">
                                        <Input placeholder="STMP服务 地址" v-model="message.host"></Input>
                                    </FormItem>
                                    <FormItem>
                                        <Checkbox v-model="message.ssl">启用ssl端口</Checkbox>
                                    </FormItem>
                                    <FormItem label="SMTP服务端口:">
                                        <InputNumber v-model="message.port"></InputNumber>
                                    </FormItem>
                                    <FormItem label="邮件推送人用户名:">
                                        <Input placeholder="推送人 用户名" v-model="message.user"></Input>
                                    </FormItem>
                                    <FormItem label="邮件推送人密码:">
                                        <Input placeholder="推送人 密码" type="password" v-model="message.password"></Input>
                                    </FormItem>
                                    <FormItem label="邮件测试收件地址::">
                                        <Input placeholder="测试收件人地址填写" v-model="message.to_user"></Input>
                                    </FormItem>
                                    <Form-item label="email推送开关:">
                                        <i-switch v-model="message.mail" size="large">
                                            <span slot="open">开</span>
                                            <span slot="close">关</span>
                                        </i-switch>
                                    </Form-item>
                                    <Form-item label="webhook推送开关:">
                                        <i-switch v-model="message.ding" size="large">
                                            <span slot="open">开</span>
                                            <span slot="close">关</span>
                                        </i-switch>
                                    </Form-item>
                                    <Button type="primary" @click="message_test('ding')">hook测试</Button>
                                    <Button type="warning" @click="message_test('mail')" style="margin-left: 5%">邮件测试
                                    </Button>
                                </Form>
                            </Card>
                        </Col>
                        <Col span="12">
                            <Card style="margin-left: 5%">
                                <p slot="title">LDAP设置</p>
                                <Form :label-width="120">
                                    <FormItem label="服务地址url">
                                        <Input placeholder="[ip地址或者域名]:[端口号]" v-model="ldap.url"></Input>
                                    </FormItem>
                                    <FormItem>
                                        <Checkbox v-model="ldap.ldaps">启用ldaps</Checkbox>
                                    </FormItem>
                                    <FormItem label="LDAP管理员DN:">
                                        <Input placeholder="请填写管理员DN" v-model="ldap.user"></Input>
                                    </FormItem>
                                    <FormItem label="LDAP管理员密码:">
                                        <Input placeholder="请填写管理员密码" v-model="ldap.password" type="password"></Input>
                                    </FormItem>
                                    <FormItem label="LDAP_Search filter:">
                                        <Input v-model="ldap.type"
                                               placeholder="例如:(&(objectClass=organizationalPerson)(sAMAccountName=%s))，%s为占位符必须存在"></Input>
                                    </FormItem>
                                    <FormItem label="LDAP_SCBASE:">
                                        <Input placeholder="LDAP Search Base" v-model="ldap.sc"></Input>
                                    </FormItem>
                                    <Button type="primary" @click="ldap_test()">ldap测试</Button>
                                </Form>
                            </Card>
                            <br>
                            <Alert style="margin-left: 5%" type="info" show-icon>
                                注意事项：
                                <template slot="desc">
                                    1.LDAP登录用户名，必须全局唯一。ldap配置请参考Grafana。
                                    <br>
                                    2.由于各个邮件服务提供商对于垃圾邮件过滤的机制各不相同，可能会造成邮件无法接收的情况。所以使用前请测试是否稳定。对于使用了ssl安全协议的stmp连接需勾选启动ssl端口复选框
                                    <br>
                                    3.只有开启相应的消息推送开关后，消息推送才会开启。
                                    <br>
                                </template>
                            </Alert>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <br>
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="android-settings"></Icon>
                        进阶设置
                    </p>
                    <Row>
                        <Col span="12">
                            <Card style="margin-left: 5%">
                                <p slot="title">其他</p>
                                <Form :label-width="120">
                                    <FormItem label="查询最大Limit限制:">
                                        <Input placeholder="查询最大的Limit数。" v-model="other.limit"></Input>
                                    </FormItem>
                                    <FormItem label="自定义环境:">
                                        <Tag v-for="item in other.idc" :key="item" :name="item" type="border" closable
                                             color="blue"
                                             @on-close="handleClose2">{{ item }}
                                        </Tag>
                                        <br>
                                        <Input placeholder="环境名称" v-model="other.foce" style="width: 30%"></Input>
                                        <Button icon="ios-plus-empty" type="dashed" size="small" @click="handleAdd"
                                                class="margin-left-10">
                                            添加环境
                                        </Button>
                                    </FormItem>
                                    <FormItem label="排除数据库:">
                                        <Tag v-for="v in other.exclude_db_list" :key="v" :name="v" type="border"
                                             closable color="blue"
                                             @on-close="handleClose_exclued_db">{{ v }}
                                        </Tag>
                                        <br>
                                        <Input placeholder="排除数据库" v-model="other.exclued_db"
                                               style="width: 30%"></Input>
                                        <Button icon="ios-plus-empty" type="dashed" size="small"
                                                @click="handleAdd_exclued_db"
                                                class="margin-left-10">添加排除数据库
                                        </Button>
                                    </FormItem>
                                    <FormItem label="脱敏字段:">
                                        <Tag v-for="v in other.insulate_word_list" :key="v" :name="v" type="border"
                                             closable color="blue"
                                             @on-close="handleClose3">{{ v }}
                                        </Tag>
                                        <br>
                                        <Input placeholder="脱敏字段设置" v-model="other.sensitive"
                                               style="width: 30%"></Input>
                                        <Button icon="ios-plus-empty" type="dashed" size="small" @click="handleAdd1"
                                                class="margin-left-10">
                                            添加脱敏字段
                                        </Button>
                                    </FormItem>
                                    <Row>
                                        <Col span="12">
                                            <Form-item label="查询审核:">
                                                <i-switch size="large" v-model="other.query">
                                                    <span slot="open">开</span>
                                                    <span slot="close">关</span>
                                                </i-switch>
                                            </Form-item>
                                        </Col>
                                        <Col span="12">
                                            <Form-item label="允许注册:">
                                                <i-switch size="large" v-model="other.register">
                                                    <span slot="open">开</span>
                                                    <span slot="close">关</span>
                                                </i-switch>
                                            </Form-item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="12">
                                            <Form-item label="查询导出:">
                                                <i-switch size="large" v-model="other.export">
                                                    <span slot="open">开</span>
                                                    <span slot="close">关</span>
                                                </i-switch>
                                            </Form-item>
                                        </Col>
                                        <Col span="12">
                                            <Form-item label="查询时限:">
                                                <InputNumber :max="600" :min="0" v-model="other.ex_query_time"
                                                             :formatter="value => `${value}分钟`"></InputNumber>
                                            </Form-item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                        <Col span="12">
                            <Row>
                                <Card style="margin-left: 5%">
                                    <p slot="title">超级管理员特权</p>
                                    <Form :label-width="160">
                                        <FormItem label="删除指定日期前的工单记录">
                                            <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择时间点"
                                                        v-model="other.overdue" @on-change="other.overdue=$event"
                                                        :editable="false"></DatePicker>
                                            <Poptip
                                                confirm
                                                title="确定要删除工单记录吗?"
                                                @on-ok="del_order">
                                                <Button style="margin-left: 10%" type="primary">删除</Button>
                                            </Poptip>
                                        </FormItem>
                                        <FormItem label="删除指定日期前的查询记录">
                                            <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择时间点"
                                                        v-model="other.query_expire"
                                                        @on-change="other.query_expire=$event"
                                                        :editable="false"></DatePicker>
                                            <Poptip
                                                confirm
                                                title="确定要删除查询记录吗?"
                                                @on-ok="del_query">
                                                <Button style="margin-left: 10%" type="primary">删除</Button>
                                            </Poptip>
                                        </FormItem>
                                    </Form>
                                </Card>
                            </Row>
                            <br>
                            <Alert style="margin-left: 5%" type="warning" show-icon>
                                注意事项：
                                <template slot="desc">
                                    1.设置最大Limit数后，所有的查询语句的查询结果都不会超过这个数值。
                                    <br>
                                    2.查询审核开关开启后，所有的查询都必须通过管理员同意才能进行。关闭则可自主查询
                                    <br>
                                    3.设置脱敏字段后，查询时如匹配到对应字段则该字段将只会以******显示
                                </template>
                            </Alert>
                            <Button style="margin-left: 5%;width: 95%" type="primary" @click="save_upload">保存</Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">

import {Component, Mixins} from "vue-property-decorator";
// eslint-disable-next-line no-unused-vars
import {other_modal, message_modal, Res} from "@/interface";
import Basic from "../../../mixins/basic";
import {
    SettingCreateOrEditApi,
    SettingDeleteTestApi,
    SettingFetchApi,
    SettingLDAPTestApi,
    SettingMessageTestApi
} from "@/apis/settingApis";
import {AxiosResponse} from "axios";

@Component
export default class setting extends Mixins(Basic) {
    ldap = {};
    message = {
        push_type: false,
    } as message_modal;
    other = {
        limit: 0,
        per_order: 0
    } as other_modal;

    del_order() {
        SettingDeleteTestApi({date: this.other.overdue, tp: false})
    }

    del_query() {
        SettingDeleteTestApi({date: this.other.query_expire, tp: true})
    }

    handleAdd() {
        for (let i of this.other.idc) {
            if (i === this.other.foce) {
                this.$Message.error("请勿添加相同环境！");
                return
            }
        }
        this.other.idc.push(this.other.foce);
        this.other.foce = ''
    }

    handleAdd1() {
        for (let i of this.other.insulate_word_list) {
            if (i === this.other.sensitive) {
                this.$Message.error("请勿添加相同脱敏字段！");
                return
            }
        }

        this.other.insulate_word_list.push(this.other.sensitive);
        this.other.sensitive = ''
    }

    handleAdd_exclued_db() {
        for (let i of this.other.exclude_db_list) {
            if (i === this.other.exclued_db) {
                this.$Message.error("请勿添加相同数据库！");
                return
            }
        }
        this.other.exclude_db_list.push(this.other.exclued_db);
        this.other.exclued_db = ''
    }

    handleClose2(event: any, name: string) {
        const index = this.other.idc.indexOf(name);
        this.other.idc.splice(index, 1)
    }

    handleClose3(event: any, name: string) {
        const index = this.other.insulate_word_list.indexOf(name);
        this.other.insulate_word_list.splice(index, 1)
    }

    handleClose_exclued_db(event: any, name: string) {
        const index = this.other.exclude_db_list.indexOf(name);
        this.other.exclude_db_list.splice(index, 1)
    }

    ldap_test() {
        SettingLDAPTestApi(this.ldap)
    }

    message_test(ty: string) {
        SettingMessageTestApi(ty, this.message)
    }

    save_upload() {
        SettingCreateOrEditApi({
            ldap: this.ldap,
            message: this.message,
            other: this.other
        })
    }

    mounted() {
        SettingFetchApi()
            .then((res: AxiosResponse<Res>) => {
                this.message = res.data.payload.Message;
                this.other = res.data.payload.Other;
                this.ldap = res.data.payload.Ldap;
            })
    }
}
</script>

<style>
label {
    font-size: 30px;
}
</style>
