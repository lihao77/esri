<template>
    <doubleView :viewStyle="viewStyle" ref="doubleViewRef" :isTop="isTop" :flexible="false"
        :is-wheel="false">
        <template #first-view>
            <Map ref="mapRef" id="addLossMap"/>
        </template>
        <template #second-view>
            <newsTable :style="{ paddingTop: newsTablePaddingTop }" ref="lossTableRef" 
                @showFeatureOnMap="mapRef?.showFeatureOnMap" />
        </template>
    </doubleView>
</template>

<script setup lang="ts" name="adminReviewLoss">
import Map from "./map.vue";
import newsTable from "./newsTable.vue";
import doubleView from '/@/components/doubleView/index.vue';

import { computed, reactive, ref, watch } from 'vue';

const mapRef = ref();
const lossTableRef = ref();
const doubleViewRef = ref();
const isTop = ref(true);
const handleIsTopChange = (data: boolean) => {
    isTop.value = data
};
const viewStyle = ref({
    hminSize: 30,
    vminSize: 30
});
const paneSize = ref(0);
let nowRow = reactive({
    title: '',
    date: '',
    position: '',
    htmlVal: ''
});
const isWatching = ref(false);
const handleIsWatchingChange = (data: boolean) => {
    if (data) {
        if (doubleViewRef.value.doubleViewType === 'horizontal' && doubleViewRef.value.paneSize <= viewStyle.value.hminSize) {
            paneSize.value = doubleViewRef.value.paneSize
            doubleViewRef.value.goTo(viewStyle.value.hminSize)
        }else{
            paneSize.value = doubleViewRef.value.paneSize
            doubleViewRef.value.goTo(50)
        }

    } else {
        doubleViewRef.value.goTo(paneSize.value)
    }
    isWatching.value = data
};

const isSelecting = ref(false);
const handleIsSelectingChange = (data: boolean, row: any) => {
    if (data) {
        paneSize.value = doubleViewRef.value.paneSize
        doubleViewRef.value.goTo('firstMax')
    } else {
        doubleViewRef.value.goTo(paneSize.value)
    }
    isSelecting.value = data
    nowRow = row;

};
const wktString = ref("")
const handleWKTSelected = (data: string) => {
    console.log(data);
    nowRow.position = data;
    isSelecting.value = false;
    doubleViewRef.value.goTo(paneSize.value);
};
const handleDeletePosition = () => {
    mapRef.value.clearGraphics();
};

const newsTablePaddingTop = computed(() => {
    return doubleViewRef.value?.doubleViewType === 'vertical' ? '5px' : '40px';
});

</script>
