<style lang="less">
  @import '../styles/infor-card.less';
  @import "../styles/common.less";
</style>

<template>
  <count-up :id-name="idName" :end-val="endVal" :color="color"
            :countSize="countSize" :countWeight="countWeight">
  </count-up>
</template>

<script>
  import countUp from './countUp.vue';

  export default {
    name: 'inforCard',
    components: {
      countUp
    },
    props: {
      idName: String,
      endVal: Number,
      color: String,
      countSize: {
        type: String,
        default: '30px'
      },
      countWeight: {
        type: Number,
        default: 700
      }
    }
  };
</script>
