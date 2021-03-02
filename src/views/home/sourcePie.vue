<template>
    <div id="data_source">
    </div>

</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {Chart} from '@antv/g2';
import {DashGetApi} from "@/apis/dashApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";

@Component({components: {}})
export default class SourcePie extends Vue {
    mounted() {
        let data = [] as any;
        const chart = new Chart({
            container: 'data_source',
            autoFit: true,
            height: 335,
        });
        DashGetApi('pie')
            .then((res: AxiosResponse<Res>) => {
                data = res.data.payload
            })
            .finally(() => {

                chart.data(data);
                chart.tooltip({
                    showMarkers: false
                });
                chart.legend('data_base', {
                    position: 'right',                                  // 配置图例显示位置
                    custom: true,                                       // 关键字段，告诉 G2，要使用自定义的图例
                    items: data.map((obj: any, index: number) => {
                        return {
                            name: obj.data_base,                                 // 对应 itemName
                            value: obj.count,                             // 对应 itemValue
                            marker: {
                                symbol: 'square',                             // marker 的形状
                                style: {
                                    r: 5,                                       // marker 图形半径
                                    fill: chart.getTheme().colors10[index],     // marker 颜色，使用默认颜色，同图形对应
                                },
                            },                                              // marker 配置
                        };
                    }),
                    itemValue: {
                        style: {
                            fill: '#999',
                        },                                               // 配置 itemValue 样式
                    },
                });

                chart
                    .interval()
                    .position('data_base*count')
                    .color('data_base');
                chart.interaction('legend-highlight');
                chart.interaction('axis-label-highlight');
                chart.theme({
                    "styleSheet": {
                        "brandColor": "#5B8FF9",
                        "paletteQualitative10": ["#5B8FF9", "#61DDAA", "#65789B", "#F6BD16", "#7262fd", "#78D3F8", "#9661BC", "#F6903D", "#008685", "#F08BB4"],
                        "paletteQualitative20": ["#5B8FF9", "#CDDDFD", "#61DDAA", "#CDF3E4", "#65789B", "#CED4DE", "#F6BD16", "#FCEBB9", "#7262fd", "#D3CEFD", "#78D3F8", "#D3EEF9", "#9661BC", "#DECFEA", "#F6903D", "#FFE0C7", "#008685", "#BBDEDE", "#F08BB4", "#FFE0ED"]
                    }
                });
                chart.render();
            })
    }
}
</script>

<style scoped>

</style>