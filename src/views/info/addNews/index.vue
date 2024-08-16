<template>
    <doubleView ref="doubleViewRef" :isTop="isTop" :flexible="true" >
        <template #first-view>
            <Map ref="mapRef" id="addNewsMap" :is-selecting="isSelecting" @wkt-selected="handleWKTSelected"/>
        </template>
        <template #second-view>
            <newsForm ref="newsFormRef" :wkt-string="wktString" @update:isTop="handleIsTopChange" @update:isSelecting="handleIsSelectingChange" @delete:position="handleDeletePosition" />
        </template>
    </doubleView>
</template>

<script setup lang="ts" name="addNews">
import Map from "./map.vue";
import newsForm from "./newsForm.vue";
import doubleView from '/@/components/doubleView/index.vue';
import { ref, watch } from 'vue';

const mapRef = ref();
const newsFormRef = ref();
const doubleViewRef = ref();
const isTop = ref(true);
const handleIsTopChange = (data: boolean) => {
    isTop.value = data
};
const isSelecting = ref(false);
const paneSize = ref(0);
const handleIsSelectingChange = (data: boolean) => {
    if (data) {
        paneSize.value = doubleViewRef.value.paneSize
        doubleViewRef.value.goTo('firstMax')
    } else {
        doubleViewRef.value.goTo(paneSize.value)
    }
    isSelecting.value = data
};
const wktString = ref("")
const handleWKTSelected = (data: string) => {
    wktString.value = data;
    console.log(data);
};
const handleDeletePosition = () => {
    mapRef.value.clearGraphics();
};


</script>
