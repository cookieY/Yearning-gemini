<template>
    <div id="container">
    </div>

</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {Chart} from '@antv/g2';
import {DashGetApi} from "@/apis/dashApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import {ListItem} from '@antv/g2/lib/dependents';
import {TooltipItem} from "@antv/g2/lib/interface";

@Component({components: {}})
export default class OrderChart extends Vue {
    mounted() {
        let data = [] as any
        DashGetApi('axis')
            .then((res: AxiosResponse<Res>) => {
                data = res.data.payload
            })
            .finally(() => {
                const chart = new Chart({
                    container: 'container',
                    autoFit: true,
                    height: 400,
                });

                chart.data(data);
                chart.scale('count', {
                    nice: true,
                });
                chart.tooltip({
                    showMarkers: false,
                    shared: true,
                    customItems: (items: any) => {
                        for (let i = 0; i < items.length; i++) {
                            if (items[i].name === '1') {
                                items[i].name = 'DML'
                            } else {
                                items[i].name = 'DDL'
                            }
                        }
                        return items
                    }
                });

                chart.option('slider', {
                    start: 0.5,
                    end: 1
                });
                chart.legend({
                    itemName: {
                        formatter: function (text: string, item: ListItem, index: number) {
                            return text === "1" ? "DML" : "DDL"
                        }
                    }
                });
                chart
                    .interval()
                    .position('time*count')
                    .color('type')
                    .adjust([
                        {
                            type: 'dodge',
                            marginRatio: 0,
                            dodgeBy: 'type'
                        },
                    ]);

                chart.interaction('active-region');

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