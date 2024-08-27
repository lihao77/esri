<template>
    <el-card class="sidebar-card" shadow="never">
        <div class="table-demo-container">
            <div class="table-demo-padding layout-padding-view layout-padding-auto">
                <TableSearch :search="state.tableData.search" @search="onSearch" />
                <Table ref="tableRef" v-bind="state.tableData" class="table-demo" @delRow="onTableDelRow"
                    @pageChange="onTablePageChange" @sortHeader="onSortHeader">
                    <template #expand="{ row }">
                        <!-- <Editor v-model:get-html="row.htmlVal" v-model:get-text="row.textVal" :disable="true" /> -->
                        <el-card>
                            <el-form ref="newsForm" :model="row" size="default" label-width="100px"
                                label-position="top">
                                <el-form-item label="标题" prop="goods">
                                    <el-input v-model="row.goods" placeholder="请输入标题" clearable disabled></el-input>
                                </el-form-item>

                                <el-form-item label="位置" prop="position">
                                    <el-input v-model="row.position" placeholder="使用左边按钮选择位置" disabled clearable>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="日期" prop="date">
                                    <el-date-picker v-model="row.date" type="datetime" placeholder="Pick a Date"
                                        format="YYYY-MM-DD HH:mm:ss" date-format="MMM DD, YYYY" time-format="HH:mm"
                                        style="width: 100%;" disabled />
                                </el-form-item>

                                <el-form-item label="联系方式" prop="howToGet">
                                    <el-input v-model="row.howToGet" :style="{ width: '100%' }" autosize
                                        type="textarea" placeholder="请输入联系方式" disabled/>
                                </el-form-item>
                                <el-form-item>
                                    <el-button-group class="ml-4" style="display: flex; justify-content: center;">
                                        <el-button type="primary" @click="publishRow(row)">发布</el-button>
                                        <el-button type="success" @click="modifyRow(row)">打回</el-button>
                                        <el-popconfirm title="确定删除吗？" @confirm="onTableDelRow(row)">
                                            <template #reference>
                                                <el-button type="danger">删除</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </el-button-group>
                                </el-form-item>
                            </el-form>
                        </el-card>

                    </template>
                    <template #operation="{ row }">
                        <el-button-group class="ml-4" style="display: flex; justify-content: center;">
                            <el-button type="primary" size="small" @click="editRow(row)">编辑</el-button>
                            <el-button type="success" size="small" @click="viewRow(row)">查看</el-button>
                            <el-popconfirm title="确定删除吗？" @confirm="onTableDelRow(row)">
                                <template #reference>
                                    <el-button type="danger" size="small">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </el-button-group>
                    </template>
                </Table>
            </div>
        </div>
    </el-card>
    <el-dialog v-model="publishDialogVisible" title="发布">
        <span>确定发布吗？</span>
        <el-divider></el-divider>
        <el-button @click="canclePublish()">取消</el-button>
        <el-button type="primary" @click="publishLoss()">
            发布
        </el-button>
    </el-dialog>

    <el-dialog v-model="modifyDialogVisible" title="打回">
        <el-form ref="modifyForm" :model="modifyReasonForm" size="default" label-width="100px" label-position="top">
            <el-form-item prop="reason">
                <el-input v-model="modifyReasonForm.modifyReason" placeholder="请输入打回原因" clearable></el-input>
            </el-form-item>
            <el-divider></el-divider>

            <el-form-item>
                <el-button @click="cancleModify()">取消</el-button>
                <el-button type="primary" @click="modifyNews()">
                    打回
                </el-button>
            </el-form-item>
        </el-form>
        <!-- <el-button @click="canclePublish()">取消</el-button>
        <el-button type="primary" @click="publishLoss()">
            发布
        </el-button> -->
    </el-dialog>
</template>

<script setup lang="ts" name="makeTableDemo">
import { defineAsyncComponent, reactive, ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useReviewLossApi } from '/@/api/admin/reviewLoss';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/views/admin/reviewNews/search.vue'));
const Editor = defineAsyncComponent(() => import('/@/components/editor/index.vue'));


const emit = defineEmits(['showFeatureOnMap']);
const reviewNewsApi = useReviewLossApi();
// 定义变量内容
const publishDialogVisible = ref(false);
const modifyDialogVisible = ref(false);
let publishRowData: any = {}
const modifyReasonForm = reactive({
    modifyReason: '',
    rowID: '',
    status: -1
})
const tableRef = ref<RefType>();
const state = reactive<TableDemoState>({
    // tableData: {
    //     // 列表数据（必传）
    //     data: [],
    //     // 表头内容（必传，注意格式）
    //     header: [
    //         { key: 'name', colWidth: '', title: '应检尽检核酸采样点名称', type: 'text', isCheck: true },
    //         { key: 'address', colWidth: '', title: '详细地址', type: 'text', isCheck: true },
    //         { key: 'phone', colWidth: '', title: '采样点联系电话', type: 'text', isCheck: true },
    //         { key: 'time', colWidth: '', title: '开放时间', type: 'text', isCheck: true },
    //         { key: 'isSupport', colWidth: '', title: '是否支持24小时核酸检测', type: 'text', isCheck: true },
    //         { key: 'image', colWidth: '', width: '70', height: '40', title: '图片描述', type: 'image', isCheck: true },
    //     ],
    //     // 配置项（必传）
    //     config: {
    //         total: 0, // 列表总数
    //         loading: true, // loading 加载
    //         isBorder: false, // 是否显示表格边框
    //         isSerialNo: true, // 是否显示表格序号
    //         isSelection: true, // 是否显示表格多选
    //         isOperate: true, // 是否显示表格操作栏
    //     },
    //     // 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
    //     search: [
    //         { label: '采样点名称', prop: 'name', placeholder: '请输入应检尽检核酸采样点名称', required: true, type: 'input' },
    //         { label: '详细地址', prop: 'address', placeholder: '请输入详细地址', required: false, type: 'input' },
    //         { label: '联系电话', prop: 'phone', placeholder: '请输入采样点联系电话', required: false, type: 'input' },
    //         { label: '开放时间', prop: 'time', placeholder: '请选择', required: false, type: 'date' },
    //         {
    //             label: '支持24小时',
    //             prop: 'isSupport',
    //             placeholder: '请选择',
    //             required: false,
    //             type: 'select',
    //             options: [
    //                 { label: '是', value: 1 },
    //                 { label: '否', value: 0 },
    //             ],
    //         },
    //         { label: '图片描述', prop: 'image', placeholder: '请输入图片描述', required: false, type: 'input' },
    //         { label: '核酸机构', prop: 'mechanism', placeholder: '请输入核酸机构', required: false, type: 'input' },
    //     ],
    //     // 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
    //     param: {
    //         pageNum: 1,
    //         pageSize: 10,
    //     },
    //     // 打印标题
    //     printName: '新闻审核表单',
    // },
    tableData: {
        // 列表数据（必传）
        data: [],
        // 表头内容（必传，注意格式）
        header: [
            { key: 'goods', colWidth: '', title: '失物名称', type: 'text', isCheck: true },
            { key: 'date', colWidth: '', title: '时间', type: 'date', isCheck: true },
            { key: 'position', colWidth: '', title: '地点', type: 'text', isCheck: true },
            { key: 'howToGet', colWidth: '', title: '地点', type: 'text', isCheck: true },
            // { key: 'image', colWidth: '', width: '70', height: '40', title: '图片', type: 'image', isCheck: true },
        ],
        // 配置项（必传）
        config: {
            total: 0, // 列表总数
            loading: true, // loading 加载
            isBorder: false, // 是否显示表格边框
            isSerialNo: true, // 是否显示表格序号
            isSelection: true, // 是否显示表格多选
            isOperate: true, // 是否显示表格操作栏
            isExpand: true, // 是否显示表格展开
            operateWidth: 200, // 操作栏宽度

        },
        // 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
        search: [
            { label: '失物名称', prop: 'goods', placeholder: '请输入物品名称', required: true, type: 'input' },
            { label: '时间', prop: 'date', placeholder: '请选择时间', required: true, type: 'date' },
            { label: '地点', prop: 'position', placeholder: '请输入地点', required: false, type: 'input' },
            // { label: '图片', prop: 'image', placeholder: '请输入图片描述', required: false, type: 'input' },
        ],
        // 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
        param: {
            pageNum: 1,
            pageSize: 10,
        },
        // 打印标题
        printName: '失物招领审核表单',
    }

});

const handleDelRow = (row: any) => {
    const index = state.tableData.data.indexOf(row);
    if (index !== -1) {
        state.tableData.data.splice(index, 1);
    }
};
const editRow = (row: any) => {
    ElMessage.info(`编辑行: ${row.id}`);
    tableRef.value.tableRef.toggleRowExpansion(row, true);
    row.editorDisable = false;
};
const viewRow = (row: any) => {
    ElMessage.info(`查看行: ${row.id}`);
    // 将数据在地图展示

    emit('showFeatureOnMap', row);
};
const publishRow = (row: any) => {
    // ElMessage.success(`发布成功！`);
    publishRowData = row;
    publishDialogVisible.value = true;
}

const confirmTitle = () => {
    if (publishRowData.editorDisable) {
        return "确定发布吗？"
    }
    else {
        return "该新闻已被编辑是否保存并发布？"
    }
}
const canclePublish = () => {
    publishRowData = {}
    publishDialogVisible.value = false
}
const publishLoss = () => {
    if (Object.keys(publishRowData).length > 0) {
        publishRowData.status = 1
        console.log(publishRowData);
        reviewNewsApi.modifyNews(publishRowData).then((res) => {
            if (res.status == 200) {
                ElMessage.success(res.message);
            } else {
                ElMessage.warning(res.message);
            }
            getTableData()
        })
    }
    publishDialogVisible.value = false
}
const modifyRow = (row: any) => {
    modifyDialogVisible.value = true;
    modifyReasonForm.rowID = row.id

};

const cancleModify = () => {
    publishRowData = {}
    modifyDialogVisible.value = false
}

const modifyNews = () => {
    if (modifyReasonForm.modifyReason != '') {
        reviewNewsApi.modifyNews(modifyReasonForm).then((res) => {
            if (res.status == 200) {
                ElMessage.success(res.message);
            } else {
                ElMessage.warning(res.message);
            }
            getTableData()
        })
    }

    modifyReasonForm.modifyReason = ''
    modifyReasonForm.rowID = ''
    modifyDialogVisible.value = false
}
// 初始化列表数据
const getTableData = () => {
    state.tableData.config.loading = true;
    // state.tableData.data = [];
    // for (let i = 0; i < 20; i++) {
    //     state.tableData.data.push({
    //         id: `news${i + 1}`,
    //         title: `新闻标题 ${i + 1}`,
    //         date: `2024-07-28`,
    //         position: `POINT(116.405 39.915)`,

    //         htmlVal: '<p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">胡歌，1982年9月20日出生于上海市徐汇区，中国内地影视男演员、流行乐歌手，</span><a href="https://baike.baidu.com/item/%E6%B0%91%E7%9B%9F/1971441?fromModule=lemma_inlink" target="_blank" style="text-indent: 28px; text-align: start;">民盟</a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">盟员</span><span style="color: rgb(51, 102, 204); background-color: rgb(255, 255, 255); font-size: 12px;"><sup> [1]</sup></span><a href="" target="" style="text-indent: 28px; text-align: start;"> </a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;"> ，毕业于</span><a href="https://baike.baidu.com/item/%E4%B8%8A%E6%B5%B7%E6%88%8F%E5%89%A7%E5%AD%A6%E9%99%A2/1736818?fromModule=lemma_inlink" target="_blank" style="text-indent: 28px; text-align: start;">上海戏剧学院</a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">表演系。</span></p><p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">胡歌，1982年9月20日出生于上海市徐汇区，中国内地影视男演员、流行乐歌手，</span><a href="https://baike.baidu.com/item/%E6%B0%91%E7%9B%9F/1971441?fromModule=lemma_inlink" target="_blank" style="text-indent: 28px; text-align: start;">民盟</a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">盟员</span><span style="color: rgb(51, 102, 204); background-color: rgb(255, 255, 255); font-size: 12px;"><sup> [1]</sup></span><a href="" target="" style="text-indent: 28px; text-align: start;"> </a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;"> ，毕业于</span><a href="https://baike.baidu.com/item/%E4%B8%8A%E6%B5%B7%E6%88%8F%E5%89%A7%E5%AD%A6%E9%99%A2/1736818?fromModule=lemma_inlink" target="_blank" style="text-indent: 28px; text-align: start;">上海戏剧学院</a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">表演系。</span></p>',
    //         textVal: '胡歌，1982年9月20日出生于上海市徐汇区，中国内地影视男演员、流行乐歌手，民盟盟员 [1]  ，毕业于上海戏剧学院表演系。',
    //         // htmlVal: '',
    //         // textVal: '',

    //         editorDisable: true,

    //         // content: '胡歌，1982年9月20日出生于上海市徐汇区，中国内地影视男演员、流行乐歌手，民盟盟员 [1]  ，毕业于上海戏剧学院表演系。',
    //         // expandHtml: '<p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">胡歌，1982年9月20日出生于上海市徐汇区，中国内地影视男演员、流行乐歌手，</span><a href="https://baike.baidu.com/item/%E6%B0%91%E7%9B%9F/1971441?fromModule=lemma_inlink" target="_blank" style="text-indent: 28px; text-align: start;">民盟</a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">盟员</span><span style="color: rgb(51, 102, 204); background-color: rgb(255, 255, 255); font-size: 12px;"><sup> [1]</sup></span><a href="" target="" style="text-indent: 28px; text-align: start;"> </a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;"> ，毕业于</span><a href="https://baike.baidu.com/item/%E4%B8%8A%E6%B5%B7%E6%88%8F%E5%89%A7%E5%AD%A6%E9%99%A2/1736818?fromModule=lemma_inlink" target="_blank" style="text-indent: 28px; text-align: start;">上海戏剧学院</a><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 14px;">表演系。</span></p>',
    //         // image: `https://img2.baidu.com/it/u=417454395,2713356475&fm=253&fmt=auto?w=200&h=200`,
    //     });
    // }

    reviewNewsApi.getReviewLossData().then((res) => {
        state.tableData.data = res.data;
        state.tableData.config.total = state.tableData.data.length;
        setTimeout(() => {
            state.tableData.config.loading = false;
        }, 500);
    });
    // 数据总数（模拟，真实从接口取）

};
// 搜索点击时表单回调
const onSearch = (data: EmptyObjectType) => {
    state.tableData.param = Object.assign({}, state.tableData.param, { ...data });
    tableRef.value.pageReset();
};
// 删除当前项回调
const onTableDelRow = (row: EmptyObjectType) => {
    ElMessage.success(`删除${row.name}成功！`);
    getTableData();
};
// 分页改变时回调
const onTablePageChange = (page: TableDemoPageType) => {
    state.tableData.param.pageNum = page.pageNum;
    state.tableData.param.pageSize = page.pageSize;
    getTableData();
};
// 拖动显示列排序回调
const onSortHeader = (data: TableHeaderType[]) => {
    state.tableData.header = data;
};


// 页面加载时
onMounted(() => {
    getTableData();
});
</script>

<style scoped lang="scss">
.table-demo-container {
    height: 100%;
    border: unset !important;

    .table-demo-padding {
        padding: 10px;
        // padding-left: 10px;
        padding-top: 0;
        border: unset !important;

        .table-demo {
            flex: 1;
            overflow: hidden;
        }
    }
}

.sidebar-card {
    :deep(.el-card__body) {
        height: 100%;
        // padding: 0
    }

    height: 100%;
    width: 100%;
    border-radius: 0px;
    border: unset;
}
</style>
