<template>
    <div style="width:100%;height:100%;" id="data_source_axis"></div>
</template>

<script>
import axios from 'axios'

const echarts = require('echarts');
export default {
    name: 'dataSourceAxis',
    mounted() {
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
                        dataZoom: [{
                            type: 'inside',
                            start: 80,
                            end: 100
                        }, {
                            start: 0,
                            end: 20,
                            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                            handleSize: '80%',
                            handleStyle: {
                                color: '#fff',
                                shadowBlur: 3,
                                shadowColor: 'rgba(0, 0, 0, 0.6)',
                                shadowOffsetX: 2,
                                shadowOffsetY: 2
                            }
                        }],
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
