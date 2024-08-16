<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view" id="doubleView">

            <splitpanes class="default-theme" @resize="paneSize = $event[0].size" style="height: 100%; "
                :id="doubleViewStyle[doubleViewType].id" :horizontal="doubleViewType !== 'horizontal'">
                <pane class="first-view-pane" :size="paneSize">
                    <div class="first-view" ref="firstViewRef"
                        :style="{ minWidth: doubleViewStyle[doubleViewType].firstViewMinWidth, minHeight: doubleViewStyle[doubleViewType].firstViewMinHeight }">
                        <slot name="first-view"></slot>
                    </div>
                </pane>
                <pane class="second-view-pane" :size="100 - paneSize">
                    <div class="second-view">
                        <div class="second-view-arrow">
                            <el-button type="primary" size="small" id="changeTypeButton"
                                :style="{ top: doubleViewType === 'horizontal' ? '8px' : '3px', left: doubleViewType === 'horizontal' ? '45px' : '10px' }"
                                @click="handleSidebarDirectionUpdate()">
                                <SvgIcon name="ele-Refresh" />
                                <!-- <SvgIcon name="iconfont icon-dayin" :size="19" title="打印" /> -->
                                {{ doubleViewStyle[doubleViewType].buttonName }}
                            </el-button>
                            <el-button type="primary" size="large" circle @click="moveSplitpanes()"
                                style="background-color: transparent; border: none;z-index: 1; margin-left: 0">
                                <SvgIcon v-if="arrowDirection === 'out'"
                                    :name="doubleViewStyle[doubleViewType].arrow.out" :size="20"
                                    color="var(--el-color-primary)" />
                                <SvgIcon v-else :name="doubleViewStyle[doubleViewType].arrow.in" :size="20"
                                    color="var(--el-color-primary)" />
                            </el-button>
                        </div>
                        <div class="second-view-content" ref="secondViewRef" @wheel="handleWhell"
                            @touchstart="handleTouchStart" @touchmove="handleTouchMove">
                            <slot name="second-view"></slot>
                        </div>


                    </div>
                </pane>
            </splitpanes>
        </div>
    </div>
</template>

<script setup lang="ts" name="doubleView">
import { ref, onMounted, onBeforeUnmount, reactive, watchEffect } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

// 定义变量内容
const paneSize = ref(100);
const scrollbarRef = ref();
const firstViewRef = ref();
const secondViewRef = ref();
const isSelecting = ref(false);
const validTypes = ['horizontal', 'vertical'];
const arrowDirection = ref('out');
const props = defineProps({
    isTop: {
        type: Boolean,
        default: true,
    },
    flexible: {
        type: Boolean,
        default: true,
    },
    isWheel: {
        type: Boolean,
        default: true,
    },
    isTouchMove: {
        type: Boolean,
        default: false,
    },
    viewStyle: {
        type: Object,
        default: () => ({
        }),
    },
});
const touchStartY = ref(0);
const doubleViewType = ref('horizontal' as keyof SidebarStyleObject);

interface SidebarStyleObject {
    [key: string]: {
        type: string;
        id: string;
        firstViewMinWidth: string;
        firstViewMinHeight: string;
        secondViewMinWidth: string;
        secondViewMinHeight: string;
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
const doubleViewStyle: SidebarStyleObject = reactive({
    horizontal: {
        type: 'horizontal',
        id: 'doubleView-horizontal',
        firstViewMinWidth: '100%',
        firstViewMinHeight: '100%',
        secondViewMinWidth: '100%',
        secondViewMinHeight: '100%',
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
        secondViewMinWidth: '100%',
        secondViewMinHeight: '100%',
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

const moveSplitpanes = () => {
    if (arrowDirection.value === 'out') {
        paneSize.value = doubleViewStyle[doubleViewType.value].minSize;
        arrowDirection.value = 'in';
    } else {
        paneSize.value = 100;
        arrowDirection.value = 'out';
    }
};

const handleSidebarDirectionUpdate = () => {
    let oldVal = paneSize.value
    doubleViewType.value = doubleViewType.value === 'horizontal' ? 'vertical' : 'horizontal';
    if (oldVal < doubleViewStyle[doubleViewType.value].minSize) {
        paneSize.value = doubleViewStyle[doubleViewType.value].minSize;
    }
};


const updateArrowDirection = (oldVal: Number, newVal: Number) => {
    if (oldVal < newVal) {
        arrowDirection.value = 'out';
    } else if (oldVal > newVal) {
        arrowDirection.value = 'in';
    }
};

const handleWhell = (event: WheelEvent) => {
    console.log('handleWhell', event.deltaY, props.isTop);
    if (props.isWheel && doubleViewType.value === 'vertical') {
        if (event.deltaY > 0) {
            if (paneSize.value > doubleViewStyle[doubleViewType.value].minSize) {
                event.preventDefault();
                paneSize.value -= 10;
            }
        } else {
            if (paneSize.value < 100 && props.isTop) {
                paneSize.value += 10;
            }
        }
    }
}

const handleTouchStart = (event: any) => {
    touchStartY.value = event.touches[0].clientY;
};

const handleTouchMove = (event: any) => {
    if (props.isTouchMove && doubleViewType.value === 'vertical') {
        const touchMoveY = event.touches[0].clientY;
        const deltaY = touchMoveY - touchStartY.value;

        if (deltaY > 0) {
            if (paneSize.value < 100 && props.isTop) {
                paneSize.value += 0.5;
            }
        } else {
            if (paneSize.value > doubleViewStyle.vertical.minSize) {
                event.preventDefault();
                paneSize.value -= 0.5;
            }
        }
    }
};

const handleDoubleViewClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (target?.closest('.first-view') && paneSize.value < doubleViewStyle[doubleViewType.value].clickFirstViewToMaxSize) {
        updateArrowDirection(paneSize.value, doubleViewStyle[doubleViewType.value].clickFirstViewToMaxSize);
        paneSize.value = doubleViewStyle[doubleViewType.value].clickFirstViewToMaxSize;
    } else if (target?.closest('.second-view') && paneSize.value > doubleViewStyle[doubleViewType.value].clickSecondViewToMaxSize) {
        updateArrowDirection(paneSize.value, doubleViewStyle[doubleViewType.value].clickSecondViewToMaxSize);
        paneSize.value = doubleViewStyle[doubleViewType.value].clickSecondViewToMaxSize;
    }
};

enum Enum {
    firstMax = doubleViewStyle[doubleViewType.value].clickFirstViewToMaxSize,
    secondMax = doubleViewStyle[doubleViewType.value].clickSecondViewToMaxSize
}

const goTo = (newPaneSize: number | Enum) => {

    if (typeof newPaneSize === 'number') {
        updateArrowDirection(paneSize.value, newPaneSize);
        paneSize.value = newPaneSize;
    } else {
        console.log(Enum[newPaneSize])

        updateArrowDirection(paneSize.value, Number(Enum[newPaneSize]));
        paneSize.value = Number(Enum[newPaneSize]);
    }
}

watchEffect(() => {
    if (paneSize.value <= doubleViewStyle[doubleViewType.value].minSize) {
        arrowDirection.value = 'in';
    } else if (paneSize.value === 100) {
        arrowDirection.value = 'out';
    }
});

onMounted(() => {
    if (props.flexible) {
        document.addEventListener('click', handleDoubleViewClick);
    }

    const doubleView = document.querySelector('#doubleView');
    if (doubleView) {
        const { width, height } = doubleView.getBoundingClientRect();
        if (width > height) {
            doubleViewType.value = 'horizontal';
        } else {
            doubleViewType.value = 'vertical';
        }
        console.log(props.viewStyle.hminSize)

        if (props.viewStyle.hminSize !== undefined) {
            doubleViewStyle['horizontal'].minSize = props.viewStyle.hminSize;
            doubleViewStyle['horizontal'].clickFirstViewToMaxSize = 100 - doubleViewStyle['horizontal'].minSize;
            doubleViewStyle['horizontal'].clickSecondViewToMaxSize = doubleViewStyle['horizontal'].minSize;

        }
        if (props.viewStyle.vminSize !== undefined) {
            doubleViewStyle['vertical'].minSize = props.viewStyle.vminSize;
            doubleViewStyle['vertical'].clickFirstViewToMaxSize = 100 - doubleViewStyle['vertical'].minSize;
            doubleViewStyle['vertical'].clickSecondViewToMaxSize = doubleViewStyle['vertical'].minSize;
        }
        paneSize.value = doubleViewStyle[doubleViewType.value].minSize;
        doubleViewStyle['horizontal'].firstViewMinWidth = (width - 7) * doubleViewStyle['horizontal'].minSize / 100 + 'px';
        doubleViewStyle['vertical'].firstViewMinHeight = (height - 7) * doubleViewStyle['vertical'].minSize / 100 + 'px';
        doubleViewStyle['horizontal'].secondViewMinWidth = (width - 7) * (100 - doubleViewStyle['horizontal'].minSize) / 100 + 'px';
        doubleViewStyle['vertical'].secondViewMinHeight = (height - 7) * (100 - doubleViewStyle['vertical'].minSize) / 100 + 'px';

    }
});



onBeforeUnmount(() => {
    if (props.flexible) {
        document.removeEventListener('click', handleDoubleViewClick);
    }
    console.log("news/index.vue 组件销毁");
});

defineExpose({
    firstViewRef,

    secondViewRef,
    doubleViewType,
    paneSize,
    goTo
});
</script>

<style lang="scss" scoped>
:root {
    --first-view-width: 100%;
    --second-view-width: 250px;
}

.second-view {
    position: relative;
    display: flex;
    height: 100%;
    overflow: hidden;
    width: 100%;
    transition: width 0.3s ease-in-out;
}

// .second-view-arrow {
//     background-color: white;
// }
.first-view-pane {
    // z-index: -9999;
    background-color: #fff !important;
}

.second-view-pane {
    min-width: 30px;
    min-height: 30px;
    // z-index: -1;
    background-color: #fff !important;
}

#doubleView-horizontal {
    // z-index: 0;

    // :deep(.splitpanes__splitter) {
    //     z-index: -1;
    // }

    .first-view {
        height: 100%;
        width: 100%;
        min-width: 900px;
    }

    .second-view {
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

            flex-grow: 1;
            min-width: 650px;
            height: 100%;
        }
    }
}

#doubleView-vertical {
    z-index: 0;

    // :deep(.splitpanes__splitter) {
    //     z-index: -1;
    // }

    // :deep(.second-view-pane) {
    //     z-index: -1;
    // }

    .first-view {
        height: 100%;
        width: 100%;
        min-height: 300px;
    }

    .second-view {
        height: 100%;
        width: 100%;
        border-radius: 0px;
        border: unset;
        font-size: small;

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

.second-view :deep(.el-scrollbar__thumb) {
    right: -10px;
}

#changeTypeButton {
    position: absolute;
}

// .second-view :deep(.el-card__body) {
//     padding-left: 30px;
//     padding-right: 30px;
//     height: calc(100% - 40px);
// }

:deep(.esri-view-root){
    z-index: 200;
}

</style>
