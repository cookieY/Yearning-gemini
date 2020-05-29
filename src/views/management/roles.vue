<template>
  <div>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="md-bulb"/>
            审核规则
          </p>
          <div>
            <Row>
              <Col span="24">
                <Card>
                  <p slot="title">
                    <Icon type="md-flower"/>
                    审核规则
                  </p>
                  <div>
                    <Row>
                      <Col span="6">
                        <Form :label-width="150">
                          <FormItem label="检查表注释">
                            <i-switch size="large" v-model="juno.DDLCheckTableComment">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="检查列注释">
                            <i-switch size="large" v-model="juno.DDlCheckColumnComment">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="检查是否为not null">
                            <i-switch size="large" v-model="juno.DDLCheckColumnNullable">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="检查列默认值">
                            <i-switch size="large" v-model="juno.DDLCheckColumnDefault">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="检查时间字段默认值">
                            <i-switch size="large" v-model="juno.DDLTimeFieldDefault">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="是否允许跨库表迁移">
                            <i-switch size="large" v-model="juno.DDLEnableAcrossDBRename">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="强制自增列初始值为1">
                            <i-switch size="large" v-model="juno.DDLEnableAutoincrementInit">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="开启索引名称规范">
                            <i-switch size="large" v-model="juno.DDLIndexNameSpec">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="强制主键名为ID">
                            <i-switch size="large" v-model="juno.DDLPrimaryKeyMust">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="强制主键为自增列">
                            <i-switch size="large" v-model="juno.DDLEnableAutoIncrement">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                        </Form>
                      </Col>
                      <Col span="6">
                        <Form :label-width="150">
                          <FormItem label="检查关键词">
                            <i-switch size="large" v-model="juno.CheckIdentifier">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="检查无符号标志unsigned">
                            <i-switch size="large" v-model="juno.DDLEnableAutoincrementUnsigned">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="允许删除表">
                            <i-switch size="large" v-model="juno.DDLEnableDropTable">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="允许删除库">
                            <i-switch size="large" v-model="juno.DDLEnableDropDatabase">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="允许索引名为空">
                            <i-switch size="large" v-model="juno.DDLEnableNullIndexName">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="允许设置排列顺序">
                            <i-switch size="large" v-model="juno.EnableSetCollation">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="允许设置字符集">
                            <i-switch size="large" v-model="juno.EnableSetCharset">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="允许工单多条DDL">
                            <i-switch size="large" v-model="juno.DDLMultiToSubmit">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="打开OSC">
                            <i-switch size="large" v-model="juno.IsOSC">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="允许字段类型转换">
                            <i-switch size="large" v-model="juno.DDLAllowColumnType">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                        </Form>
                      </Col>
                      <Col span="6">
                        <Form :label-width="150">
                          <FormItem label="允许主键类型非int/bigint">
                            <i-switch size="large" v-model="juno.DDLAllowPRINotInt">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="检查类型隐式转换">
                            <i-switch size="large" v-model="juno.DDLImplicitTypeConversion">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="单个索引指定字段上限">
                            <InputNumber :min="0" v-model="juno.DDLMaxKeyParts"></InputNumber>
                          </FormItem>
                          <FormItem label="单表索引数上限">
                            <InputNumber :min="0" v-model="juno.DDLMaxKey"></InputNumber>
                          </FormItem>
                          <FormItem label="char字段最大长度">
                            <InputNumber :min="0" v-model="juno.DDLMaxCharLength"></InputNumber>
                          </FormItem>
                          <FormItem label="表名最大长度">
                            <InputNumber :min="0" v-model="juno.MaxTableNameLen"></InputNumber>
                          </FormItem>
                          <FormItem label="DML最大影响行数">
                            <InputNumber :min="0" v-model="juno.MaxAffectRows"></InputNumber>
                          </FormItem>
                          <FormItem label="DDL最大影响行数">
                            <InputNumber :min="0" v-model="juno.MaxDDLAffectRows"></InputNumber>
                          </FormItem>
                          <FormItem label="允许的Collate范围">
                            <Input v-model="juno.SupportCollation"></Input>
                          </FormItem>
                          <FormItem label="允许的Charset范围">
                            <Input v-model="juno.SupportCharset"></Input>
                          </FormItem>
                          <FormItem label="建表必须拥有字段">
                            <Input v-model="juno.MustHaveColumns"></Input>
                          </FormItem>

                        </Form>
                      </Col>
                      <Col span="6">
                        <Form :label-width="150">
                          <FormItem label="OSCMinTableSize">
                            <InputNumber :min="0" v-model="juno.OscSize"
                                         :formatter="value => `${value}m`"></InputNumber>
                          </FormItem>
                          <FormItem label="检查插入语句存在列名">
                            <i-switch size="large" v-model="juno.DMLInsertColumns">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="检查dml语句where条件">
                            <i-switch size="large" v-model="juno.DMLWhere">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="dml语句禁用order">
                            <i-switch size="large" v-model="juno.DMLOrder">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="dml语句禁用select">
                            <i-switch size="large" v-model="juno.DMLSelect">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="允许创建视图">
                            <i-switch size="large" v-model="juno.AllowCreateView">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="允许创建分区表">
                            <i-switch size="large" v-model="juno.AllowCreatePartition">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="允许bit,enum,set类型">
                            <i-switch size="large" v-model="juno.AllowSpecialType">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="基于主键回滚">
                            <i-switch size="large" v-model="juno.PRIRollBack">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="Insert语句字段上限">
                            <InputNumber :min="0" v-model="juno.DMLMaxInsertRows"></InputNumber>
                          </FormItem>
                        </Form>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            </Row>
            <br>
            <Row>
              <Col span="12">
                <Card>
                  <p slot="title">
                    <Icon type="md-flower"/>
                    Pt-OSC设置
                  </p>
                  <div>
                    <Row>
                      <Col span="12">
                        <Form :label-width="180">
                          <FormItem label="OscDropNewTable">
                            <i-switch size="large" v-model="juno.OscDropNewTable">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="OscDropOldTable">
                            <i-switch size="large" v-model="juno.OscDropOldTable">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="OscCheckReplicationFilters">
                            <i-switch size="large" v-model="juno.OscCheckReplicationFilters">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="OscCheckAlter">
                            <i-switch size="large" v-model="juno.OscCheckAlter">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="OscPrintSql">
                            <i-switch size="large" v-model="juno.OscPrintSql">
                              <span slot="open">开</span>
                              <span slot="close">关</span>
                            </i-switch>
                          </FormItem>
                          <FormItem label="OscAlterForeignKeysMethod">
                            <Input v-model="juno.OscAlterForeignKeysMethod"></Input>
                          </FormItem>
                          <FormItem label="OscChunkTime">
                            <InputNumber :min="0" v-model="juno.OscChunkTime"></InputNumber>
                          </FormItem>
                        </Form>
                      </Col>
                      <Col span="12">
                        <Form :label-width="200">
                          <FormItem label="OscBinDir">
                            <Input v-model="juno.OscBinDir"></Input>
                          </FormItem>
                          <FormItem label="OscMaxLag">
                            <InputNumber :min="0" v-model="juno.OscMaxLag"></InputNumber>
                          </FormItem>
                          <FormItem label="OscCheckInterval">
                            <InputNumber :min="0" v-model="juno.OscCheckInterval"></InputNumber>
                          </FormItem>
                          <FormItem label="OscMaxThreadConnected">
                            <InputNumber :min="0" v-model="juno.OscMaxThreadConnected"></InputNumber>
                          </FormItem>
                          <FormItem label="OscMaxThreadRunning">
                            <InputNumber :min="0" v-model="juno.OscMaxThreadRunning"></InputNumber>
                          </FormItem>
                          <FormItem label="OscCriticalThreadConnected">
                            <InputNumber :min="0" v-model="juno.OscCriticalThreadConnected"></InputNumber>
                          </FormItem>
                          <FormItem label="OscCriticalThreadRunning">
                            <InputNumber :min="0" v-model="juno.OscCriticalThreadRunning"></InputNumber>
                          </FormItem>
                          <FormItem label="OscRecursionMethod">
                            <Input v-model="juno.OscRecursionMethod"></Input>
                          </FormItem>
                        </Form>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
              <Col span="12">
                <Card class="margin-left-10">
                  <p slot="title">
                    <Icon type="md-flower"/>
                    保存
                  </p>
                  <div>
                    <Alert show-icon class="margin-left-10" type="warning">
                      注意事项
                      <Icon type="ios-bulb-outline" slot="icon"></Icon>
                      <template slot="desc">
                        1.数值型规则0值都为不受限制。
                        <br>
                        2.开启检查时间字段默认值,所有时间类型字段都必须设置默认值且默认值必须为CURRENT_TIMESTAMP
                        <br>
                        3.osc相关规则请参考相关工具参数说明。
                        <br>
                        4.受制于各种条件影响, 影响行数判断并不一定准确,仅作为部分参考。
                        <br>
                        5.OSCMinTableSize当表体积大于该值时如果启动osc则走osc执行。
                        <br>
                        6.排序/字符集/建表必须拥有字段设置 请使用逗号分隔多个值
                      </template>
                    </Alert>
                    <Button type="primary" @click="referRoles" long class="margin-left-10">保存</Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import {Mixins, Component} from "vue-property-decorator";
    import att_mixins from "../../mixins/att";

    @Component
    export default class roles extends Mixins(att_mixins) {
        juno = {
            DMLMaxInsertRows: 2
        };

        referRoles() {
            axios.post(`${this.$config.url}/group/setting/roles`, {
                'juno': this.juno
            })
                .then(res => {
                    this.$config.notice(res.data)
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                })
        }

        mounted() {
            axios.get(`${this.$config.url}/group/setting`)
                .then(res => {
                    this.juno = res.data.AuditRole
                })
                .catch(error => {
                    this.$config.err_notice(this, error)
                })
        }
    }
</script>

<style lang="less" scoped>
  @import "../../styles/common.less";
</style>
