<template>
    <div class="layout-padding" id="addNews">
        <div class="layout-padding-auto layout-padding-view">
            <!-- 使用 splitpanes 组件进行布局分割 -->
            <!-- <splitpanes class="default-theme" @resize="paneSize = $event[0].size" style="height: 100%" -->
            <splitpanes class="default-theme" @resize="paneSize = $event[0].size" style="height: 100%"
                :id="sidebarStyle[sidebarType].id" :horizontal="sidebarType !== 'horizontal'">
                <pane :size="paneSize" :min-size="sidebarStyle[sidebarType].minSize">
                    <div class="map-view">
                        <Map id="addNewsMap" />
                    </div>
                </pane>
                <pane class="sidebar-pane" :size="100 - paneSize" style="min-width: 30px; min-height: 30px">
                    <div class="sidebar" :style="{ 'width': '100%' }">
                        <el-card class="sidebar-card" style="border-radius: 0;"
                            :body-style="{ paddingRight: '30px', padding: '0px', height: '100%' }">
                            <el-row style="height: 100%;">
                                <!-- 侧边栏箭头 -->
                                <div class="sidebar-arrow">
                                    <el-button type="primary" size="large" circle @click="moveSplitpanes()"
                                        style="background-color: transparent; border: none;">
                                        <SvgIcon v-if="arrowDirection === 'out'"
                                            :name="sidebarStyle[sidebarType].arrow.out" :size="20"
                                            color="var(--el-color-primary)" />
                                        <SvgIcon v-else :name="sidebarStyle[sidebarType].arrow.in" :size="20"
                                            color="var(--el-color-primary)" />
                                    </el-button>
                                </div>
                                <!-- 侧边栏内容 -->
                                <div class="sidebar-content">
                                    <el-card class="sidebar-card" shadow="never">
                                        <template #header>
                                            <div class="card-header">
                                                <span>添加新闻</span>
                                            </div>
                                            <el-button type="primary" size="small"
                                                style="position: absolute; top: 8px; left: 30px;"
                                                @click="updateSidebarDirection()">
                                                <SvgIcon name="ele-Refresh" />
                                                {{ sidebarStyle[sidebarType].buttonName }}
                                            </el-button>
                                        </template>
                                        <el-scrollbar>
                                            <el-form :model="newsState.form" size="default" label-width="100px"
                                                label-position="top">
                                                <el-form-item label="标题">
                                                    <el-input v-model="newsState.form.title" placeholder="请输入标题"
                                                        clearable></el-input>
                                                </el-form-item>
                                                <el-form-item label="位置">
                                                    <el-input v-model="newsState.form.position" placeholder="使用左边按钮选择位置"
                                                        disabled clearable>
                                                        <template #prepend>
                                                            <el-button @click="selectPosition($event)">
                                                                <SvgIcon name="ele-Location" />
                                                            </el-button>
                                                        </template>
                                                    </el-input>
                                                </el-form-item>
                                                <el-form-item label="内容">
                                                    <Editor v-model:get-html="state1.editor.htmlVal"
                                                        v-model:get-text="state1.editor.textVal"
                                                        :disable="state1.editor.disable" />
                                                </el-form-item>
                                                <el-form-item>
                                                    <el-button type="primary">
                                                        <SvgIcon name="iconfont icon-biaodan" />
                                                        提交
                                                    </el-button>
                                                </el-form-item>
                                            </el-form>
                                        </el-scrollbar>
                                    </el-card>
                                </div>
                            </el-row>
                        </el-card>
                    </div>
                </pane>
            </splitpanes>
        </div>
    </div>
</template>

<script setup lang="ts" name="infoAddNews">
import { ref, onMounted, onBeforeUnmount, reactive, defineAsyncComponent, watchEffect } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import Map from "./map.vue";

const Editor = defineAsyncComponent(() => import('/@/components/editor/index.vue'));

// 定义变量内容
const paneSize = ref(100);
const newsState = reactive({
    form: {
        title: '',
        position: '',
    },
});

// 控制 splitpanes 的移动
const moveSplitpanes = () => {
    if (arrowDirection.value === 'out') {
        paneSize.value = sidebarStyle[sidebarType.value].minSize;
        arrowDirection.value = 'in';
    } else {
        paneSize.value = 100;
        arrowDirection.value = 'out';
    }
};

// 更新侧边栏方向
const updateSidebarDirection = () => {
    let oldVal = paneSize.value
    sidebarType.value = sidebarType.value === 'horizontal' ? 'vertical' : 'horizontal';
    if (oldVal < sidebarStyle[sidebarType.value].minSize) {
        paneSize.value = sidebarStyle[sidebarType.value].minSize;
    }
};

const arrowDirection = ref('out');
// 更新箭头方向
const updateArrowDirection = (oldVal: Number, newVal: Number) => {
    if (oldVal < newVal) {
        arrowDirection.value = 'out';
    } else if (oldVal > newVal) {
        arrowDirection.value = 'in';
    }
};

// 选择位置
const selectPosition = (event: MouseEvent) => {
    console.log('选择位置');
    event.stopPropagation();
    updateArrowDirection(paneSize.value, sidebarStyle[sidebarType.value].clickMapToMaxSize);
    paneSize.value = sidebarStyle[sidebarType.value].clickMapToMaxSize;
    document.getElementById('addNewsMap')?.click();
};

onMounted(() => {
    document.addEventListener('click', handleSidebarClick);

    const addNews = document.querySelector('#addNews');
    if (addNews) {
        const { width, height } = addNews.getBoundingClientRect();
        if (width > height) {
            sidebarType.value = 'horizontal';
        } else {
            sidebarType.value = 'vertical';
        }
        paneSize.value = sidebarStyle[sidebarType.value].minSize;
    }
    console.log(sidebarStyle[sidebarType.value]);
});

// 处理侧边栏点击事件
function handleSidebarClick(event: MouseEvent) {
    const target = event.target as Element | null;
    if (target?.closest('.map-view') && paneSize.value < sidebarStyle[sidebarType.value].clickMapToMaxSize) {
        updateArrowDirection(paneSize.value, sidebarStyle[sidebarType.value].clickMapToMaxSize);
        paneSize.value = sidebarStyle[sidebarType.value].clickMapToMaxSize;
    } else if ( target?.closest('.sidebar') && paneSize.value > sidebarStyle[sidebarType.value].clickSidebarToMaxSize ) {
        updateArrowDirection(paneSize.value, sidebarStyle[sidebarType.value].clickSidebarToMaxSize);
        paneSize.value = sidebarStyle[sidebarType.value].clickSidebarToMaxSize;
    }
}

const sidebarType = ref('horizontal' as keyof SidebarStyleObject);

interface SidebarStyleObject {
    [key: string]: {
        type: string;
        id: string;
        minSize: number;
        clickMapToMaxSize: number;
        clickSidebarToMaxSize: number;
        arrow: {
            out: string;
            in: string;
        };
        buttonName: string;
    };
}
const sidebarStyle: SidebarStyleObject = reactive({
    horizontal: {
        type: 'horizontal',
        id: 'addNews-horizontal',
        minSize: 20,
        clickMapToMaxSize: 60,
        clickSidebarToMaxSize: 40,
        arrow: {
            out: 'ele-ArrowLeftBold',
            in: 'ele-ArrowRightBold',
        },
        buttonName: '竖屏吸附',
    },
    vertical: {
        type: 'vertical',
        id: 'addNews-vertical',
        minSize: 0,
        clickMapToMaxSize: 80,
        clickSidebarToMaxSize: 20,
        arrow: {
            out: 'ele-ArrowUpBold',
            in: 'ele-ArrowDownBold',
        },
        buttonName: '横屏吸附',
    },
});

watchEffect(() => {
    if (paneSize.value === sidebarStyle[sidebarType.value].minSize) {
        arrowDirection.value = 'in';
    } else if (paneSize.value === 100) {
        arrowDirection.value = 'out';
    }
});

const state1 = reactive({
    editor: {
        htmlVal: '<p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">胡歌，1982年9月20日出生于上海市徐汇区，中国内地影视男演员、流行乐歌手，</span><a href="https://baike.baidu.com/item/%E6%B0%91%E7%9B%9F/1971441?fromModule=lemma_inlink" target="_blank" style="text-indent: 28px; text-align: start;">民盟</a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">盟员</span><span style="color: rgb(51, 102, 204); background-color: rgb(255, 255, 255); font-size: 12px;"><sup> [1]</sup></span><a href="" target="" style="text-indent: 28px; text-align: start;"> </a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;"> ，毕业于</span><a href="https://baike.baidu.com/item/%E4%B8%8A%E6%B5%B7%E6%88%8F%E5%89%A7%E5%AD%A6%E9%99%A2/1736818?fromModule=lemma_inlink" target="_blank" style="text-indent: 28px; text-align: start;">上海戏剧学院</a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">表演系。</span></p>',
        textVal: '胡歌，1982年9月20日出生于上海市徐汇区，中国内地影视男演员、流行乐歌手，民盟盟员 [1]  ，毕业于上海戏剧学院表演系。',
        disable: false,
    },
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleSidebarClick);
    console.log("news/index.vue 组件销毁");
});
</script>

<style lang="scss" scoped>
.popup {
    position: absolute;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    top: 10px;
    left: 10px;
}

.popup button {
    margin-top: 5px;
    padding: 5px 10px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.popup button:hover {
    background-color: #d32f2f;
}

:root {
    --sidebar-width: 250px;
    --gap: 20px;
}

.sidebar {
    position: relative;
    height: 100%;
    overflow: hidden;
    width: 100%;
    transition: width 0.3s ease-in-out;
}

#addNews-horizontal {
    z-index: 0;
    :deep(.splitpanes__splitter){
        z-index: -1;
    }
    .map-view {
        height: 100%;
        width: 100%;
        min-width: 900px;
    }

    .sidebar-card {
        height: 100%;
        width: 100%;
        border-radius: 0px;
        border: unset;

        .sidebar-arrow {
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 100%;
        }

        .sidebar-content {
            position: absolute;
            top: 0;
            left: 0px;
            width: 100%;
            min-width: 650px;
            height: 100%;
        }
    }
}

#addNews-vertical {
    z-index: 0;
    :deep(.splitpanes__splitter){
        z-index: -1;
    }
    :deep(.sidebar-pane) {
        z-index: -1;
    }
    .map-view {
        height: 100%;
        width: 100%;
        min-height: 300px;
    }

    .sidebar-card {
        height: 100%;
        width: 100%;
        border-radius: 0px;
        border: unset;

        .sidebar-arrow {
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 30px;
        }

        .sidebar-content {
            position: absolute;
            top: 30px;
            left: 0px;
            width: 100%;
            height: calc(100% - 30px);
        }
    }
}

.sidebar-card :deep(.el-scrollbar__thumb) {
    right: -10px;
}

.sidebar-card :deep(.el-card__header) {
    padding: 0;
    margin-left: 30px;
    margin-right: 30px;

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
}

.sidebar-card :deep(.el-card__body) {
    padding-left: 30px;
    padding-right: 30px;
    height: calc(100% - 40px);
}
</style>