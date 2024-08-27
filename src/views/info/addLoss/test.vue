<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view" id="doubleView">
            <splitpanes class="default-theme" @resize="paneSize = $event[0].size" style="height: 100%"
                :id="doubleViewStyle[doubleViewType].id" :horizontal="doubleViewType !== 'horizontal'">
                <pane class="first-view-pane" :size="paneSize">
                    <div class="first-view"
                        :style="{ minWidth: doubleViewStyle[doubleViewType].firstViewMinWidth, minHeight: doubleViewStyle[doubleViewType].firstViewMinHeight }">
                        <slot name="first-view">

                        </slot>
                    </div>
                </pane>
                <pane class="second-view-pane" :size="100 - paneSize" style="min-width: 30px; min-height: 30px">
                    <div class="second-view" :style="{ 'width': '100%' }">
                        <el-card class="second-view-card" style="border-radius: 0;"
                            :body-style="{ paddingRight: '30px', padding: '0px', height: '100%' }">
                            <el-row style="height: 100%;">
                                <div class="second-view-arrow">
                                    <el-button type="primary" size="large" circle @click="moveSplitpanes()"
                                        style="background-color: transparent; border: none;">
                                        <SvgIcon v-if="arrowDirection === 'out'"
                                            :name="doubleViewStyle[doubleViewType].arrow.out" :size="20"
                                            color="var(--el-color-primary)" />
                                        <SvgIcon v-else :name="doubleViewStyle[doubleViewType].arrow.in" :size="20"
                                            color="var(--el-color-primary)" />
                                    </el-button>
                                </div>
                                <div class="second-view-content" @wheel="handleWhell" @touchstart="handleTouchStart"
                                    @touchmove="handleTouchMove">
                                    <slot name="second-view-content">

                                    </slot>
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
import { ref, onMounted, onBeforeUnmount, reactive, defineAsyncComponent, watchEffect, computed } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import { ElMessage } from 'element-plus';
import 'splitpanes/dist/splitpanes.css';

const Editor = defineAsyncComponent(() => import('/@/components/editor/index.vue'));

// 定义变量内容
const paneSize = ref(100);
const newsState = reactive({
    form: {
        title: '',
        position: '',
    },
});

const scrollbarRef = ref();
const isSelecting = ref(false);
const validTypes = ['horizontal', 'vertical'];
const arrowDirection = ref('out');
const isTop = ref(false);
const touchStartY = ref(0);
const doubleViewType = ref('horizontal' as keyof DoubleViewStyleObject);

interface DoubleViewStyleObject {
    [key: string]: {
        type: string;
        id: string;
        firstViewMinWidth: string;
        firstViewMinHeight: string;
        minSize: number;
        clickFirstViewToMaxSize: number;
        clickSecondViewToMaxSize: number;
        arrow: {
            out: string;
            in: string;
        };
        buttonName: string;
    };
}
const doubleViewStyle: DoubleViewStyleObject = reactive({
    horizontal: {
        type: 'horizontal',
        id: 'doubleView-horizontal',
        firstViewMinWidth: '100%',
        firstViewMinHeight: '100%',
        minSize: 30,
        clickFirstViewToMaxSize: 70,
        clickSecondViewToMaxSize: 30,
        arrow: {
            out: 'ele-ArrowLeftBold',
            in: 'ele-ArrowRightBold',
        },
        buttonName: '竖屏吸附',
    },
    vertical: {
        type: 'vertical',
        id: 'doubleView-vertical',
        firstViewMinWidth: '100%',
        firstViewMinHeight: '100%',
        minSize: 20,
        clickFirstViewToMaxSize: 80,
        clickSecondViewToMaxSize: 20,
        arrow: {
            out: 'ele-ArrowUpBold',
            in: 'ele-ArrowDownBold',
        },
        buttonName: '横屏吸附',
    },
});


const modifyPaneSize = (size: number) => {
    paneSize.value = size;
};
const handleDoubleViewTypeUpdate = (type: string) => {
    let oldVal = paneSize.value
    if (validTypes.includes(type)) {
        doubleViewType.value = type;
        if (oldVal < doubleViewStyle[doubleViewType.value].minSize) {
            paneSize.value = doubleViewStyle[doubleViewType.value].minSize;
        }
    }

};



const handlePaneSizeUpdate = (size: number) => {
    paneSize.value = size;
};
// 控制 splitpanes 的移动
const moveSplitpanes = () => {
    if (arrowDirection.value === 'out') {
        paneSize.value = doubleViewStyle[doubleViewType.value].minSize;
        arrowDirection.value = 'in';
    } else {
        paneSize.value = 100;
        arrowDirection.value = 'out';
    }
};

// 更新侧边栏方向
const handleDoubleViewDirectionUpdate = () => {
    let oldVal = paneSize.value
    doubleViewType.value = doubleViewType.value === 'horizontal' ? 'vertical' : 'horizontal';
    if (oldVal < doubleViewStyle[doubleViewType.value].minSize) {
        paneSize.value = doubleViewStyle[doubleViewType.value].minSize;
    }
};

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

    if (isSelecting.value) {
        isSelecting.value = false;
        ElMessage.success('选择器已关闭');

    } else {
        event.stopPropagation();
        updateArrowDirection(paneSize.value, doubleViewStyle[doubleViewType.value].clickFirstViewToMaxSize);
        paneSize.value = doubleViewStyle[doubleViewType.value].clickFirstViewToMaxSize;
        // document.getElementById('doubleViewMap')?.click();
        isSelecting.value = true;
        ElMessage.success('请在地图上选择位置');
    }

};
const handleWKTSelected = (wkt: string) => {
    console.log('wkt', wkt);
    newsState.form.position = wkt;
    isSelecting.value = false;
    updateArrowDirection(paneSize.value, doubleViewStyle[doubleViewType.value].clickSecondViewToMaxSize);
    paneSize.value = doubleViewStyle[doubleViewType.value].clickSecondViewToMaxSize;
    ElMessage.success('位置选择成功');
};

// 处理滚动事件
const handleScroll = (e: any) => {
    if (e.scrollTop === 0) {
        isTop.value = true;
    } else {
        isTop.value = false;
    }
};

const handleWhell = (event: WheelEvent) => {
    if (doubleViewType.value === 'vertical') {
        if (event.deltaY > 0) {
            // console.log('向下滚动');
            if (paneSize.value > doubleViewStyle[doubleViewType.value].minSize) {
                event.preventDefault();
                paneSize.value -= 10;
            }
        } else {
            // console.log('向上滚动');
            if (paneSize.value < 100 && isTop.value) {
                paneSize.value += 10;
            }
        }
    }
}

const handleTouchStart = (event) => {
    touchStartY.value = event.touches[0].clientY;
};

const handleTouchMove = (event) => {
    if (doubleViewType.value === 'vertical') {
        const touchMoveY = event.touches[0].clientY;
        const deltaY = touchMoveY - touchStartY.value;

        if (deltaY > 0) {
            console.log('向下滑动');
            if (paneSize.value < 100 && isTop.value) {
                paneSize.value += 0.5;
            }
        } else {
            console.log('向上滑动');

            if (paneSize.value > doubleViewStyle.vertical.minSize) {
                event.preventDefault();
                paneSize.value -= 0.5;
            }
        }
    }
};



onMounted(() => {
    document.addEventListener('click', handleDoubleViewClick);


    const doubleView = document.querySelector('#doubleView');
    if (doubleView) {
        const { width, height } = doubleView.getBoundingClientRect();
        if (width > height) {
            doubleViewType.value = 'horizontal';
        } else {
            doubleViewType.value = 'vertical';
        }
        paneSize.value = doubleViewStyle[doubleViewType.value].minSize;

        doubleViewStyle['horizontal'].firstViewMinWidth = (width - 7) * doubleViewStyle['horizontal'].minSize / 100 + 'px';
        doubleViewStyle['vertical'].firstViewMinHeight = (height - 7) * doubleViewStyle['vertical'].minSize / 100 + 'px';
        console.log(width, height, doubleViewStyle['vertical'].firstViewMinWidth);
    }
    console.log(doubleViewStyle[doubleViewType.value]);
});

// 处理侧边栏点击事件
function handleDoubleViewClick(event: MouseEvent) {
    const target = event.target as Element | null;
    if (target?.closest('.first-view') && paneSize.value < doubleViewStyle[doubleViewType.value].clickFirstViewToMaxSize) {
        updateArrowDirection(paneSize.value, doubleViewStyle[doubleViewType.value].clickFirstViewToMaxSize);
        paneSize.value = doubleViewStyle[doubleViewType.value].clickFirstViewToMaxSize;
    } else if (target?.closest('.doubleView') && paneSize.value > doubleViewStyle[doubleViewType.value].clickSecondViewToMaxSize) {
        updateArrowDirection(paneSize.value, doubleViewStyle[doubleViewType.value].clickSecondViewToMaxSize);
        paneSize.value = doubleViewStyle[doubleViewType.value].clickSecondViewToMaxSize;
    }
}



watchEffect(() => {
    if (paneSize.value <= doubleViewStyle[doubleViewType.value].minSize) {
        arrowDirection.value = 'in';
    } else if (paneSize.value === 100) {
        arrowDirection.value = 'out';
    }
});



onBeforeUnmount(() => {
    document.removeEventListener('click', handleDoubleViewClick);
    console.log("news/index.vue 组件销毁");
});
</script>

<style scoped lang="less">
.second-view {
    position: relative;
    height: 100%;
    overflow: hidden;
    width: 100%;
    transition: width 0.3s ease-in-out;
}

#doubleView-horizontal {
    z-index: 0;

    :deep(.splitpanes__splitter) {
        z-index: -1;
    }

    .first-view {
        height: 100%;
        width: 100%;
        min-width: 900px;
    }

    .second-view-card {
        height: 100%;
        width: 100%;
        border-radius: 0px;
        border: unset;

        .second-view-arrow {
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 100%;
        }

        .second-view-content {
            position: absolute;
            top: 0;
            left: 0px;
            width: 100%;
            min-width: 650px;
            height: 100%;
        }
    }
}

#doubleView-vertical {
    z-index: 0;

    :deep(.splitpanes__splitter) {
        z-index: -1;
    }

    :deep(.second-view-pane) {
        z-index: -1;
    }

    .first-view {
        height: 100%;
        width: 100%;
        min-height: 300px;
    }

    .second-view-card {
        height: 100%;
        width: 100%;
        border-radius: 0px;
        border: unset;

        .second-view-arrow {
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 30px;
        }

        .second-view-content {
            position: absolute;
            top: 30px;
            left: 0px;
            width: 100%;
            height: calc(100% - 30px);
        }
    }
}

.second-view-card :deep(.el-scrollbar__thumb) {
    right: -10px;
}

.second-view-card :deep(.el-card__header) {
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

.second-view-card :deep(.el-card__body) {
    padding-left: 30px;
    padding-right: 30px;
    height: calc(100% - 40px);
}
</style>
