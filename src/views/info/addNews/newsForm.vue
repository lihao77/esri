<template>

    <el-card class="sidebar-card" shadow="never">
        <template #header>
            <div class="card-header">
                <span>添加新闻</span>
            </div>
        </template>
        <el-scrollbar ref="scrollbarRef" @scroll="handleScroll">
            <el-form ref="newsForm" :model="newsState.form" :rules="rules" size="default" label-width="100px"
                label-position="top">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="newsState.form.title" placeholder="请输入标题" clearable></el-input>
                </el-form-item>

                <el-form-item label="位置" prop="position">
                    <el-input v-model="newsState.form.position" placeholder="使用左边按钮选择位置" disabled clearable>
                        <template #prepend>
                            <el-button-group class="ml-4">
                                <el-button @click="selectPosition($event)">
                                    <SvgIcon v-if="!isSelecting" name="ele-Location" />
                                    <SvgIcon v-else name="ele-CloseBold" />
                                </el-button>
                                <el-button @click="deletePosition()" type="primary">
                                    <SvgIcon name="ele-DeleteFilled" />
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="日期" prop="date">
                    <el-date-picker v-model="newsState.form.date" type="datetime" placeholder="Pick a Date"
                        format="YYYY-MM-DD HH:mm:ss" date-format="MMM DD, YYYY" time-format="HH:mm"
                        style="width: 100%;" />
                </el-form-item>

                <el-form-item label="内容" prop="content">
                    <Editor v-model:get-html="newsState.form.htmlVal" v-model:get-text="newsState.form.textVal"
                        :disable="newsState.editorDisable" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitNews">
                        <SvgIcon name="iconfont icon-biaodan" />
                        提交
                    </el-button>
                </el-form-item>
            </el-form>
        </el-scrollbar>
    </el-card>

</template>

<script lang="ts" setup name="newsForm">
import { ref, onMounted, onBeforeUnmount, reactive, defineAsyncComponent, watchEffect, computed, watch } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import { ElMessage } from 'element-plus';
import { useAddNewsApi } from '/@/api/info/addNews';

const addNewsApi = useAddNewsApi();
const Editor = defineAsyncComponent(() => import('/@/components/editor/index.vue'));

// 定义变量内容
const newsState = reactive({
    form: {
        title: '',
        position: '',
        date: '',

        // htmlVal: '<p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">胡歌，1982年9月20日出生于上海市徐汇区，中国内地影视男演员、流行乐歌手，</span><a href="https://baike.baidu.com/item/%E6%B0%91%E7%9B%9F/1971441?fromModule=lemma_inlink" target="_blank" style="text-indent: 28px; text-align: start;">民盟</a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">盟员</span><span style="color: rgb(51, 102, 204); background-color: rgb(255, 255, 255); font-size: 12px;"><sup> [1]</sup></span><a href="" target="" style="text-indent: 28px; text-align: start;"> </a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;"> ，毕业于</span><a href="https://baike.baidu.com/item/%E4%B8%8A%E6%B5%B7%E6%88%8F%E5%89%A7%E5%AD%A6%E9%99%A2/1736818?fromModule=lemma_inlink" target="_blank" style="text-indent: 28px; text-align: start;">上海戏剧学院</a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">表演系。</span></p>',
        // textVal: '胡歌，1982年9月20日出生于上海市徐汇区，中国内地影视男演员、流行乐歌手，民盟盟员 [1]  ，毕业于上海戏剧学院表演系。',
        htmlVal: '',
        textVal: '',

    },
    editorDisable: false,

});
const rules = {
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
    ],
    position: [
        { required: true, message: '请选择位置', trigger: 'blur' },
    ],
    date: [
        { required: true, message: '请选择日期', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
    ],
};

const emit = defineEmits(['update:isTop', 'update:isSelecting', 'delete:position']);
const props = defineProps({
    wktString: {
        type: String,
        default: '',
        required: true,
    },
});


const scrollbarRef = ref();
const isSelecting = ref(false);


const isTop = ref(false);
const touchStartY = ref(0);
// 处理滚动事件
const handleScroll = (e: any) => {
    console.log(e);
    if (e.scrollTop === 0) {
        isTop.value = true;
    } else {
        isTop.value = false;
    }
    emit('update:isTop', isTop.value);
};

const selectPosition = (event: MouseEvent) => {
    console.log('选择位置');

    if (isSelecting.value) {
        isSelecting.value = false;
        ElMessage.success('选择器已关闭');
    } else {
        event.stopPropagation();
        isSelecting.value = true;
        ElMessage.success('请在地图上选择位置');
    }
    emit('update:isSelecting', isSelecting.value);
};

const deletePosition = () => {
    newsState.form.position = '';
    emit('delete:position');
};

const submitNews = async () => {
    console.log(newsState.form);
    const res = await addNewsApi.addNews(newsState.form);
    console.log(res.status);
    if (res.status == 200) {
        ElMessage.success('添加成功');
    } else {
        ElMessage.error('添加失败');
    }
};

onMounted(() => {

});



onBeforeUnmount(() => {
    console.log("news/index.vue 组件销毁");
});

watch(() => props.wktString, (newVal) => {
    console.log('wktString:', newVal);
    newsState.form.position = newVal;
    if (isSelecting.value) {
        isSelecting.value = false;
        emit('update:isSelecting', isSelecting.value);
    }
});

// watchEffect(() => {
//     console.log('wktString:', props.wktString);
//     newsState.form.position = props.wktString;

//     isSelecting.value = false;
//     emit('update:isSelecting', isSelecting.value);

// });

</script>

<style lang="scss" scoped>
.sidebar-card {
    height: 100%;
    width: 100%;
    border-radius: 0px;
    border: unset;

    :deep(.el-card__header) {
        padding: 0;
    }

    :deep(.el-card__body) {
        height: calc(100% - 40px);
    }
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    justify-content: center;
}
</style>