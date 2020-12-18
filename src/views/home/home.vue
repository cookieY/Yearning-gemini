<style lang="less">
    @import "../../styles/home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div>
        <Row>
            <Col class-name="padding-left-5">
                <Row>
                    <Col span="6">
                        <div>
                            <div class="card bg-gradient-danger card-img-holder text-white">
                                <Row>
                                    <div class="card-body">
                                        <img src="../../assets/circle.svg" class="card-img-absolute "
                                             alt="circle-image"/>
                                        <Col span="11">
                                            <Icon type="md-person-add" size="40"/>
                                            <h1>{{$t('dash.user')}}</h1>
                                        </Col>
                                        <Col span="8" offset="5">
                                            <info_card id-name="transfer_count0"
                                                       :end-val="count.createUser"></info_card>
                                        </Col>
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <div>
                            <div class="card bg-gradient-primary card-img-holder text-white">
                                <Row>
                                    <div class="card-body">
                                        <img src="../../assets/circle.svg" class="card-img-absolute "
                                             alt="circle-image"/>
                                        <Col span="11">
                                            <Icon type="md-podium" size="40"/>
                                            <h1>{{$t('dash.source')}}</h1>
                                        </Col>
                                        <Col span="8" offset="5">
                                            <info_card id-name="transfer_count1" :end-val="count.source"></info_card>
                                        </Col>
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <div>
                            <div class="card bg-gradient-info card-img-holder text-white">
                                <Row>
                                    <div class="card-body">
                                        <img src="../../assets/circle.svg" class="card-img-absolute "
                                             alt="circle-image"/>
                                        <Col span="11">
                                            <Icon type="md-shuffle" size="40"/>
                                            <h1>{{$t('dash.order')}}</h1>
                                        </Col>
                                        <Col span="8" offset="5">
                                            <info_card id-name="transfer_count2" :end-val="count.order"></info_card>
                                        </Col>
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <div>
                            <div class="card bg-gradient-success card-img-holder text-white">
                                <Row>
                                    <div class="card-body">
                                        <img src="../../assets/circle.svg" class="card-img-absolute "
                                             alt="circle-image"/>
                                        <Col span="11">
                                            <Icon type="md-search" size="40"/>
                                            <h1>{{$t('dash.query')}}</h1>
                                        </Col>
                                        <Col span="8" offset="5">
                                            <info_card id-name="transfer_count3" :end-val="count.query"></info_card>
                                        </Col>
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
        <br>
        <Row style="margin-left: 0.5%">
            <Col span="7">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="md-person" size="24"/>
                        {{$t('dash.profile')}}
                    </p>
                    <myself></myself>
                </Card>
            </Col>
            <Col span="8" style="margin-left: 1%">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="md-pie"/>
                        {{$t('dash.order_count')}}
                    </p>
                    <div class="data-source-row">
                        <data-source-pie :dml="this.count.dml" :ddl="this.count.ddl"
                                         :query="this.count.query"></data-source-pie>
                    </div>
                </Card>
            </Col>
            <Col span="8" style="margin-left: 1%">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="md-pie"/>
                        {{$t('dash.db_top')}}
                    </p>
                    <div class="data-source-row">
                        <Table border :columns="columnsTop5" :data="count.dataTop5" stripe></Table>
                    </div>
                </Card>
            </Col>
        </Row>
        <br>
            <Row class="margin-top-10">
              <Col span="24" style="margin-left: 0.5%">
                <Card>
                  <p slot="title" class="card-title">
                    <Icon type="md-map"></Icon>
                    {{$t('dash.axis.trend')}}
                  </p>
                  <div class="data-source-row">
                    <dataSourceAxis></dataSourceAxis>
                  </div>
                </Card>
              </Col>
            </Row>
    </div>
</template>

<script lang="ts">
    import dataSourcePie from '@/components/dataSourcePie.vue'
    import dataSourceAxis from '@/components/dataSourceAxis.vue'
    import info_card from '@/components/inforCard.vue'
    import myself from '@/views/personal/personal.vue'
    import {Component, Mixins} from 'vue-property-decorator'
    import i18n from "@/language";
    import att_mixins from "@/mixins/basic";
    import {AxiosResponse} from "axios";
    import {Res} from "@/interface";
    import {DashGetApi} from "@/apis/dashApis";

    @Component({components: {dataSourcePie, info_card, dataSourceAxis, myself}})
    export default class home extends Mixins(att_mixins) {
        columnsTop5 = [
            {
                title: i18n.t('general.db'),
                key: 'DataBase'
            },
            {
                title: i18n.t('dash.order'),
                key: 'C'
            }
        ];
        count = {
            dataTop5: [],
            createUser: 0,
            order: 0,
            source: 0,
            query: 0,
            ddl: 0,
            dml: 0
        };
        mounted() {
            DashGetApi('count')
                .then((res: AxiosResponse<Res>) => {
                    this.count = res.data.payload;
                })
        }
    }
</script>
