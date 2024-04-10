<template>
    <!-- <time-table :afternoon-length="5" :length="12" :events="events">
    </time-table> -->
    <!-- <time-table1></time-table1> -->
    <time-table3></time-table3>
</template>
<script>
import TimeTable from './timeTable.vue'
import timeTable1 from './timeTable1.vue';
import timeTable3 from './timeTable3.vue';
export default {

    components: {
        TimeTable,
        timeTable1,
        timeTable3
    },
    data() {
        return {
            events: [
                {
                    xq: 1,
                    title: '形势与政治',
                    class: 'sport',
                    content: '1-4节' + '/' + '社会学1班' + '/' + '5教-402室',
                    start: 1,
                    end: 4
                },
                {
                    xq: 1,
                    title: '形势与政治',
                    class: 'leisure',
                    content: '9-12节' + '<br>' + '社会学2班' + '<br>' + '5教-401室',
                    start: 9,
                    end: 12
                },
                {
                    xq: 3,
                    title: '形势与政治',
                    class: 'sport',
                    content: '5-6节' + '/' + '社会学2班' + '/' + '1教-401室',
                    start: 5,
                    end: 6
                },
                {
                    xq: 4,
                    title: '形势与政治',
                    class: 'sport',
                    content: '1-2节' + '/' + '社会学1班' + '/' + '5教-402室',
                    start: 1,
                    end: 2
                },
                {
                    xq: 4,
                    title: '形势与政治',
                    class: 'sport',
                    content: '7-8节' + '/' + '社会学1班' + '/' + '5教-402室',
                    start: 7,
                    end: 8
                },
                {
                    xq: 5,
                    title: '形势与政治',
                    class: 'sport',
                    content: '社会学1班' + '/' + '5教-402室',
                    start: 3,
                    end: 4
                },
                {
                    xq: 5,
                    title: '形势与政治',
                    class: 'sport',
                    content: '5-6节' + '/' + '社会学1班' + '/' + '5教-402室',
                    start: 5,
                    end: 6
                }
            ],
        }
    }
}
</script>
