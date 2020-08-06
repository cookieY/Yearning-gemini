<template>
    <div>
        <Row type="flex" justify="center" align="middle" class="div-a">
            <Col>
                <Row style="width: 450px">
                    <Col span="9">
                        <svg t="1594359662140" class="icon" viewBox="0 0 1134 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="883" width="100" height="100">
                            <path d="M542.47179 1017.240227l-517.545127-304.189789a49.219598 49.219598 0 0 1 0-84.497163l517.545127-303.344817a49.536462 49.536462 0 0 1 49.853326 0l518.073234 302.81671a49.219598 49.219598 0 0 1 0 84.497163l-517.545127 304.189789a49.008355 49.008355 0 0 1-50.381433 0.528107z"
                                  fill="#00D0FF" opacity=".8" p-id="884"></path>
                            <path d="M542.47179 698.791542l-517.545127-304.189789a49.219598 49.219598 0 0 1 0-85.02527l517.545127-302.81671a49.536462 49.536462 0 0 1 49.853326 0l518.073234 302.81671a49.219598 49.219598 0 0 1 0 85.02527l-517.545127 304.189789a49.008355 49.008355 0 0 1-50.381433 0z"
                                  fill="#032CDD" opacity=".7" p-id="885"></path>
                        </svg>
                    </Col>
                    <Col span="15">
                        <Row>
                            <h3>工单已提交</h3>
                        </Row>
                        <Divider></Divider>
                        <Row>
                            <p>如有疑问请联系相关审核人/管理员</p>
                            <br>
                            <p>如填写错误请前往我的工单处撤销工单</p>
                        </Row>
                    </Col>
                </Row>
                <br>
                <Row type="flex" justify="center" align="bottom">
                    <Button type="primary" long @click="toOriginal">返回</Button>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import modules_order from "@/store/modules/order";

    @Component({components: {}})
    export default class orderIsPost extends Vue {
        toOriginal() {
            modules_order.clear_order()
            modules_order.changed_always({one: true, two: false, three: false})
        }

        destroyed() {
            modules_order.clear_order()
        }
    }
</script>

<style scoped>
    .div-a {
        position: absolute;
        z-index: 1000;
        width: 100%;
        margin-top: 10%;
    }
</style>
