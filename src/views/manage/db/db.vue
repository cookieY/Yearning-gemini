<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Row>
        <Col span="5">
            <Card>
                <p slot="title">
                    <Icon type="md-refresh"/>
                    添加数据库
                </p>
                <CustomForm :item="general" :rule="ruleInline" :label-value="dbLabelValue" ref="db" :label-width="100">
                    <template slot="idc">
                        <Select v-model="general.idc">
                            <Option v-for="list in idcList" :value="list" :key="list">{{ list }}</Option>
                        </Select>
                    </template>
                    <template slot="port">
                        <InputNumber :min="0" v-model="general.port"></InputNumber>
                    </template>
                    <template slot="is_query">
                        <RadioGroup v-model="general.is_query">
                            <Radio :label="2">读写</Radio>
                            <Radio :label="1">读</Radio>
                            <Radio :label="0">写</Radio>
                        </RadioGroup>
                    </template>
                </CustomForm>
                <Button type="info" @click="test_db()">测试连接</Button>
                <Button type="success" @click="add_db()" style="margin-left: 5%">确定</Button>
                <Button type="warning" @click="restCustomFields('db')" style="margin-left: 5%">重置</Button>
            </Card>
        </Col>
        <Col span="19" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="md-apps"/>
                    数据库详情表
                </p>
                <Input v-model="find.source" placeholder="请填写连接名" style="width: 15%" clearable></Input>
                <Select v-model="find.idc" placeholder="请填写环境" style="width: 15%" class="margin-left-10">
                    <Option v-for="list in idcList" :value="list" :key="list">{{ list }}</Option>
                </Select>
                <Button @click="queryData" type="primary" class="margin-left-10">查询</Button>
                <Button @click="queryCancel" type="warning" class="margin-left-10">重置</Button>
                <div class="edit-table-con-1">
                    <Table :columns="columns" :data="table_data">
                        <template slot-scope="{ row }" slot="is_query">
                            <Tag checkable color="primary" v-if="row.is_query === 0">写</Tag>
                            <Tag checkable color="success" v-if="row.is_query === 1">读</Tag>
                            <Tag checkable color="warning" v-if="row.is_query === 2">读写</Tag>
                        </template>
                        <template slot-scope="{ row }" slot="action">
                            <Button type="info" size="small" @click="viewConnectionModal(row)"
                                    style="margin-right: 5px">详细信息
                            </Button>
                            <Poptip
                                confirm
                                title="删除数据源将会删除对应的所有工单信息,确定要删除吗？"
                                @on-ok="delete_db(row)"
                                transfer
                            >
                                <Button type="warning" size="small">删除</Button>
                            </Poptip>
                        </template>
                    </Table>
                </div>
                <br>
                <Page :total="page_number" show-elevator @on-change="current_page" :page-size="10"
                      :current.sync="current"></Page>
            </Card>
        </Col>
        <Modal v-model="is_open" :width="500" okText="保存" @on-ok="modifyBase">
            <h3 slot="header" style="color:#2D8CF0">数据库连接信息</h3>
            <CustomForm :label-value="dbLabelValue" :item="dbInfoEdit" :label-width="100">
                <template slot="port">
                    <InputNumber :min="0" v-model="dbInfoEdit.port"></InputNumber>
                </template>
                <template slot="is_query">
                    <RadioGroup v-model="dbInfoEdit.is_query">
                        <Radio :label="2">读写</Radio>
                        <Radio :label="1">读</Radio>
                        <Radio :label="0">写</Radio>
                    </RadioGroup>
                </template>
            </CustomForm>
        </Modal>
    </Row>
</template>
<script lang="ts">
import {Mixins, Component} from "vue-property-decorator";
import Basic from "../../../mixins/basic";
import {DB, DBCreateOrEditApi, DBDeleteApi, DBFetchApi} from "@/apis/dbApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import CustomForm, {Label} from "@/components/customForm/customForm.vue";

const regExp_Name = (rule: any, value: any, callback: any) => {
    let pPattern = new RegExp("[`~!@#$^&*()={}':;',\\[\\]<>/?~！@#￥……&*（）——{}【】‘；：”“'。，、？]");
    if (pPattern.test(value)) {
        callback(new Error('特殊字符仅可使用|与-'))
    } else {
        callback()
    }
};

const regExp_password = (rule: any, value: any, callback: any) => {
    let pPattern = new RegExp("[`?？^$]");
    if (pPattern.test(value)) {
        callback(new Error('密码中不得含有? @ ^ $'))
    } else {
        callback()
    }
};

@Component({components: {CustomForm}})
export default class database_manager extends Mixins(Basic) {
    columns = [
        {
            title: '连接名称',
            key: 'source'
        },
        {
            title: '查询数据源',
            key: 'is_query',
            slot: 'is_query'
        },
        {
            title: '数据库地址',
            key: 'ip'
        },
        {
            title: '环境',
            key: 'idc'
        },
        {
            title: '操作',
            key: 'action',
            width: 300,
            slot: 'action'
        }
    ];
    // 添加表单验证规则
    ruleInline = {
        idc: [
            {
                required: true,
                message: '请选择对应环境',
                trigger: 'change'
            }
        ],
        source: [
            {
                required: true,
                message: '请填写连接名称',
                trigger: 'blur',

            },
            {
                validator: regExp_Name,
                trigger: 'blur'
            }
        ],
        ip: [
            {
                required: true,
                message: '请填写连接地址',
                trigger: 'blur'
            }
        ],
        username: [
            {
                required: true,
                message: '请填写用户名',
                trigger: 'blur'
            }
        ],
        port: [
            {
                required: true,
                message: '请填写端口',
                trigger: 'blur',
                type: 'number'
            }
        ],
        password: [
            {
                required: true,
                message: '请填写密码',
                trigger: 'blur'
            },
            {
                validator: regExp_password,
                trigger: 'blur'
            }
        ]
    };
    idcList = [];
    dbInfoEdit = {};
    private dbLabelValue: Label = {
        idc: {name: '环境'},
        source: {name: '数据源名称'},
        ip: {name: '数据源地址'},
        port: {name: '端口'},
        username: {name: '用户名'},
        password: {name: '密码', type: 'password'},
        is_query: {name: '数据源类型'}

    }

    test_db() {
        DBCreateOrEditApi({tp: 'test', db: this.general})
    }

    add_db() {
        const verify = this.$config.formVerify(this.$refs.db)
        if (verify.isOk) {
            DBCreateOrEditApi({tp: 'create', db: this.general})
                .finally(() => {
                    verify.next.resetFields()
                    this.current_page(this.current);
                })
        }
    }

    viewConnectionModal(row: DB) {
        this.is_open = true;
        this.dbInfoEdit = Object.assign({}, row)
    }

    delete_db(vl: { source: string; }) {
        DBDeleteApi(vl.source)
            .finally(() => this.current_page(this.table_data.length === 1 ? this.current - 1 : this.current))
    }

    current_page(vl = 1) {
        DBFetchApi({page: vl, find: this.find})
            .then((res: AxiosResponse<Res>) => {
                this.table_data = res.data.payload.data;
                this.page_number = res.data.payload.page;
                this.idcList = res.data.payload.idc;
            })
    }

    modifyBase() {
        let x = Object.assign({} as any, this.dbInfoEdit)
        DBCreateOrEditApi({tp: 'edit', db: x}).finally(() => this.current_page(this.current))
    }

    mounted() {
        this.current_page()
    }
}
</script>
