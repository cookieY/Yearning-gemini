<template>
  <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
  import axios from 'axios'
  import i18n from "@/language";
  const echarts = require('echarts');
  export default {
    name: 'dataSourcePie',
    mounted () {
      this.$nextTick(() => {
        var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
        axios.get(`${this.$config.url}/dash/pie`)
          .then(res => {
            let piedata = [{
              value: res.data.ddl,
              name: "DDL",
              itemStyle: {
                normal: {
                  color: '#ed7996'
                }
              }
            },
              {
                value: res.data.dml,
                name: "DML",
                itemStyle: {
                  normal: {
                    color: '#78beea'
                  }
                }
              },
              {
                value: res.data.query,
                name: i18n.t('dash.axis.query'),
                itemStyle: {
                  normal: {
                    color: '#76cabf'
                  }
                }
              }
            ];
            const option = {
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              legend: {
                orient: 'horizontal',
                left: 'center',
                bottom: 10,
                data: [i18n.t('dash.axis.ddl'), i18n.t('dash.axis.dml'), i18n.t('dash.axis.query')]
              },
              series: [
                {
                  avoidLabelOverlap: false,
                  name: '访问来源',
                  type: 'pie',
                  radius: ['50%', '80%'],
                  center: ['50%', '45%'],
                  data: piedata,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  },
                  label: {
                    normal: {
                      show: false,
                      position: 'center'
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  }
                }
              ]
            };
            dataSourcePie.setOption(option);
            window.addEventListener('resize', function () {
              dataSourcePie.resize();
            });
          })
          .catch(error => {
                        this.$config.err_notice(this,error)
                    })
      });
    }
  };
</script>
