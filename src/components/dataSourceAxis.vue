<template>
  <div style="width:100%;height:100%;" id="data_source_axis"></div>
</template>

<script>
  import axios from 'axios'

  const echarts = require('echarts');
  export default {
    name: 'dataSourceAxis',
    mounted () {
      this.$nextTick(() => {
        let dataSourcePie = echarts.init(document.getElementById('data_source_axis'));
        axios.get(`${this.$config.url}/dash/axis`)
          .then(res => {
            const option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              color: ['#63d5c5'],
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: false,
                  data: res.data.c
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '工单数',
                  type: 'line',
                  data: res.data.o,
                  areaStyle: {normal: {}},
                  stack: '总量'
                }
              ]
            };
            dataSourcePie.setOption(option);
            window.addEventListener('resize', function () {
              dataSourcePie.resize();
            });
          })
      });
    }
  }
</script>

<style scoped>

</style>
