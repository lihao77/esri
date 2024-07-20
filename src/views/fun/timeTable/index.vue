<template>
    <time-table3 v-if="!disPlayMap" @setPoint="setPoint"></time-table3>

    <div class="layout-padding" v-else>
        <div class="layout-padding-auto layout-padding-view">
            <time-table-map  :point="point" @changeDisplay="changeDisplay"></time-table-map>
            <!-- <p>hello</p> -->
        </div>
    </div>
</template>
<script setup lang="ts" funTimeTable>
import { ref } from 'vue';
import timeTable3 from './timeTable3.vue';
import timeTableMap from './timeTableMap.vue';

const disPlayMap = ref(false);
const point = ref({
    x: 0,
    y: 0
});

function setPoint(newPoint) {
    disPlayMap.value = true;
    console.log(newPoint);
    point.value = newPoint;
}

function changeDisplay() {
    disPlayMap.value = false;
}
</script>
