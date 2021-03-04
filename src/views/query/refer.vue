<template>
    <div>
        <Row>
            <Card>
                <div class="step-header-con">
                    <h3>{{ stepData.title }}</h3>
                    <h5>{{ stepData.describe }}</h5>
                    <h4 style="margin-top: 5%">{{ stepData.content }}</h4>
                    <br>
                    <br>
                    <Button @click="back">返回</Button>
                    <Button @click="deferReply" class="margin-left-10">撤销</Button>
                </div>
                <div class="step-content" style="height: 150px">
                </div>
                <Steps :current="1" style="margin-left: 10%">
                    <Step v-for="item in stepList1" :title="item.title" :content="item.describe"
                          :key="item.title"></Step>
                </Steps>
            </Card>
        </Row>
    </div>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import {CommonPutApis} from "@/apis/queryApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import QueryMixin from "@/mixins/query";

@Component({components: {}})
export default class put_ready extends Mixins(QueryMixin) {
    stepData = {
        title: 'Yearning SQL查询系统',
        describe: `欢迎你！ ${sessionStorage.getItem('user')}`,
        content: '你的工单已提交审核，请等待审核人批准！'
    };
    stepList1 = [
        {
            title: '提交',
            describe: '提交查询申请'
        },
        {
            title: '审核',
            describe: '等待审核结果'
        },
        {
            title: '查询',
            describe: '审核完毕，进入查询页面'
        }
    ];

    back() {
        this.$router.push({
            name: 'home_index'
        })
    }

    mounted() {
        CommonPutApis('status', null)
            .then((res: AxiosResponse<Res>) => {
                if (res.data.payload.status === 1) {
                    this.$router.push({
                        name: 'query_page'
                    })
                }
            })
    }
}

</script>

<style lang="less">
@import "../../styles/common";

.step {
    &-header-con {
        text-align: center;

        h3 {
            margin: 10px 0;
        }

        h5 {
            margin: 0 0 5px;
        }
    }

    &-content {
        padding: 5px 20px 26px;
        margin-bottom: 20px;
        border-bottom: 1px solid #dbdddf;
    }

    &-form {
        padding-bottom: 10px;
        border-bottom: 1px solid #dbdddf;
        margin-bottom: 20px;
    }
}
</style>
