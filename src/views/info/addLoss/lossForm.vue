<template>

    <el-card class="sidebar-card" shadow="never">
        <template #header>
            <div class="card-header">
                <span>添加失物招领信息</span>
            </div>
        </template>
        <el-scrollbar ref="scrollbarRef" @scroll="handleScroll">
            <el-form ref="newsForm" :model="lossState.form" :rules="rules" size="default" label-width="100px"
                label-position="top">
                <el-form-item label="物品" prop="goods">
                    <el-input v-model="lossState.form.goods" placeholder="请输入物品" clearable></el-input>
                </el-form-item>

                <el-form-item label="位置" prop="position">
                    <el-input v-model="lossState.form.position" placeholder="使用左边按钮选择位置" disabled clearable>
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
                    <el-date-picker v-model="lossState.form.date" type="datetime" placeholder="Pick a Date"
                        format="YYYY-MM-DD HH:mm:ss" date-format="MMM DD, YYYY" time-format="HH:mm"
                        style="width: 100%;" />
                </el-form-item>

                <el-form-item label="联系方式" prop="howToGet">
                    <el-input v-model="lossState.form.howToGet" :style="{width: '100%'} " autosize type="textarea"
                        placeholder="请输入联系方式" />
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
import { useAddLossApi } from '/@/api/info/addLoss';

const addLossApi = useAddLossApi();


// 定义变量联系方式
const lossState = reactive({
    form: {
        goods: '',
        position: '',
        date: '',
        howToGet: '',

    },
    editorDisable: false,

});
const rules = {
    goods: [
        { required: true, message: '请输入物品', trigger: 'blur' },
    ],
    position: [
        { required: true, message: '请选择位置', trigger: 'blur' },
    ],
    date: [
        { required: true, message: '请选择日期', trigger: 'blur' },
    ],
    howToGet: [
        { required: true, message: '请输入联系方式', trigger: 'blur' },
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
    lossState.form.position = '';
    emit('delete:position');
};

const submitNews = async () => {
    console.log(lossState.form);
    const res = await addLossApi.addLoss(lossState.form);
    console.log(res.status);
    if (res.status == 200) {
        ElMessage.success('添加成功');
    } else {
        ElMessage.error('添加失败');
    }
};

onMounted(() => {

});


watch(() => props.wktString, (newVal) => {
    console.log('wktString:', newVal);
    lossState.form.position = newVal;
    if (isSelecting.value) {
        isSelecting.value = false;
        emit('update:isSelecting', isSelecting.value);
    }
});

// watchEffect(() => {
//     console.log('wktString:', props.wktString);
//     lossState.form.position = props.wktString;

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