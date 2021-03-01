<template>
    <div id="data_source">
    </div>

</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {Chart, Util} from '@antv/g2';
import {DashGetApi} from "@/apis/dashApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";

@Component({components: {}})
export default class SourcePie extends Vue {
    mounted() {
        let data = [] as any;
        DashGetApi('pie')
            .then((res: AxiosResponse<Res>) => {
                data = res.data.payload
            })
        .finally(() => {
            const chart = new Chart({
                container: 'data_source',
                autoFit: true,
                height: 305,
            });

            chart.data(data);
            chart.tooltip({
                showMarkers: false
            });

            chart
                .interval()
                .position('data_base*count')
                .color('data_base');

            chart.interaction('element-highlight');
            chart.interaction('element-list-highlight');
            chart.interaction('legend-highlight');
            chart.interaction('axis-label-highlight');

            chart.theme({ "styleSheet": { "brandColor": "#5B8FF9", "paletteQualitative10": ["#5B8FF9", "#61DDAA", "#65789B", "#F6BD16", "#7262fd", "#78D3F8", "#9661BC", "#F6903D", "#008685", "#F08BB4"], "paletteQualitative20": ["#5B8FF9", "#CDDDFD", "#61DDAA", "#CDF3E4", "#65789B", "#CED4DE", "#F6BD16", "#FCEBB9", "#7262fd", "#D3CEFD", "#78D3F8", "#D3EEF9", "#9661BC", "#DECFEA", "#F6903D", "#FFE0C7", "#008685", "#BBDEDE", "#F08BB4", "#FFE0ED"] } });
            chart.render();
        })
    }
}
</script>

<style scoped>

</style>