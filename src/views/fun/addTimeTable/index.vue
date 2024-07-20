<template>
	<div class="layout-pd">
		<el-card shadow="hover" header="表单表格验证">
			<el-form ref="tableRulesRef" :model="state.tableData" size="default">
				<el-table ref="tableRef" :data="state.tableData.data" border class="module-table-uncollected"
					max-height="200">
					<el-table-column v-for="(item, index) in state.tableData.header" :key="index" show-overflow-tooltip
						:prop="item.prop" :width="item.width" :label="item.label">
						<template v-slot:header>
							<span v-if="item.isRequired" class="color-danger">*</span>
							<span class="pl5">{{ item.label }}</span>
							<el-tooltip v-if="item.isTooltip" effect="dark" content="这是tooltip" placement="top">
								<i class="iconfont icon-quanxian" />
							</el-tooltip>
						</template>
						<template v-slot="scope">
							<el-form-item :prop="`data.${scope.$index}.${item.prop}`" :rules="getRules(item)">
								<el-input v-model="scope.row[item.prop]" placeholder="请输入内容"
									v-if="item.type === 'input'" />
								<el-select v-model="scope.row[item.prop]" placeholder="请选择"
									v-else-if="item.type === 'select'">
									<el-option v-for="sel in state.tableData.options[item.prop as keyof TableOptions]"
										:key="sel.value" :label="sel.label" :value="sel.value" />
								</el-select>
								<el-input v-model="scope.row[item.prop]" readonly placeholder="请输入内容"
									v-else-if="item.type === 'dialog'">
									<template v-slot:suffix>
										<i class="iconfont icon-shouye_dongtaihui" />
									</template>
								</el-input>
							</el-form-item>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<el-row class="flex mt15">
				<div class="flex-margin">
					<el-button size="default" type="success" @click="onValidate(tableRulesRef)">表格验证</el-button>
					<el-button size="default" type="primary" @click="onAddRow">新增一行</el-button>
				</div>
			</el-row>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import request from '/@/utils/request';


// 定义数据接口
interface TableRow {
	classname: string;
	weektime: string;
	time: string;
	week: string;
	place: string;
	classroom: string;
}

interface TableHeader {
	prop: keyof TableRow;
	width: string;
	label: string;
	isRequired: boolean;
	type: 'input' | 'select' | 'dialog';
	isTooltip: boolean;
}

interface TableOptions {
	weektime: { value: string; label: string }[];
	time: { value: string; label: string }[];
	place: { value: string; label: string }[];
}

// 定义表单规则接口
interface FormRule {
	required?: boolean;
	message?: string;
	trigger?: string;
	validator?: (rule: any, value: string, callback: (error?: Error) => void) => void;
}

// 定义变量内容
const tableRulesRef = ref<FormInstance>();
const tableRef = ref();
const state = reactive({
	tableData: {
		data: [] as TableRow[], // 使用 TableRow 类型定义 data
		header: [
			{ prop: 'classname', width: '', label: '课程', isRequired: true, type: 'input', isTooltip: false },
			{ prop: 'weektime', width: '', label: '星期', isRequired: true, type: 'select', isTooltip: false },
			{ prop: 'time', width: '', label: '时间段', isRequired: true, type: 'select', isTooltip: false },
			{ prop: 'week', width: '', label: '第几周', isRequired: true, type: 'input', isTooltip: true },
			{ prop: 'place', width: '', label: '教学楼', isRequired: true, type: 'select', isTooltip: false },
			{ prop: 'classroom', width: '', label: '课室', isRequired: true, type: 'input', isTooltip: false }
		] as TableHeader[],
		options: {
			weektime: [
				{ value: '周一', label: '周一' },
				{ value: '周二', label: '周二' },
				{ value: '周三', label: '周三' },
				{ value: '周四', label: '周四' },
				{ value: '周五', label: '周五' }
			],
			time: [
				{ label: '08:00-08:50', value: '08:00-08:50' },
				{ label: '08:00-09:50', value: '08:00-09:50' },
				{ label: '08:00-11:00', value: '08:00-11:00' },
				{ label: '08:00-12:00', value: '08:00-12:00' },
				{ label: '09:00-09:50', value: '09:00-09:50' },
				{ label: '09:00-11:00', value: '09:00-11:00' },
				{ label: '09:00-12:00', value: '09:00-12:00' },
				{ label: '10:10-11:00', value: '10:10-11:00' },
				{ label: '10:10-12:00', value: '10:10-12:00' },
				{ label: '11:10-12:00', value: '11:10-12:00' },
				{ label: '15:00-15:50', value: '15:00-15:50' },
				{ label: '15:00-16:50', value: '15:00-16:50' },
				{ label: '15:00-17:50', value: '15:00-17:50' },
				{ label: '15:00-18:50', value: '15:00-18:50' },
				{ label: '16:00-16:50', value: '16:00-16:50' },
				{ label: '16:00-17:50', value: '16:00-17:50' },
				{ label: '16:00-18:50', value: '16:00-18:50' },
				{ label: '17:00-17:50', value: '17:00-17:50' },
				{ label: '17:00-18:50', value: '17:00-18:50' },
				{ label: '18:00-18:50', value: '18:00-18:50' },
				{ label: '19:30-20:20', value: '19:30-20:20' },
				{ label: '19:30-21:20', value: '19:30-21:20' },
				{ label: '19:30-22:20', value: '19:30-22:20' },
				{ label: '20:30-21:20', value: '20:30-21:20' },
				{ label: '20:30-22:20', value: '20:30-22:20' },
				{ label: '21:30-22:20', value: '21:30-22:20' }
			],
			place: [
				{ value: '第一教学楼', label: '第一教学楼' },
				{ value: '第二教学楼', label: '第二教学楼' },
				{ value: '第三教学楼', label: '第三教学楼' }
			]
		} as TableOptions
	}
});

// 获取验证规则
const getRules = (item: TableHeader): FormRule[] => {
	const rules: FormRule[] = [{
		required: item.isRequired,
		message: '不能为空',
		trigger: 'blur'
	}];

	if (item.prop === 'week') {
		rules.push({
			validator: validateWeekFormat,
			message: '请输入正确的格式，如：1, 2-4, 5-17',
			trigger: 'blur'
		});
	}

	return rules;
};

// 表格验证
const onValidate = async (formEl: FormInstance | undefined) => {
	if (state.tableData.data.length <= 0) {
		return ElMessage.warning('请先点击增加一行');
	}
	if (!formEl) {
		return;
	}
	formEl.validate(async (valid) => {
		if (!valid) {
			return ElMessage.warning('表格项必填未填');
		}
		try {

			let a = { courses: state.tableData.data }
			const response = await request({
				url: '/user/sclass/',
				method: 'post',
				data: a
			});

			ElMessage.success('全部验证通过并成功提交');

		} catch (error) {
			ElMessage.error('提交失败');
		}
	});
};

// 新增一行
const onAddRow = () => {
	state.tableData.data.push({
		classname: '',
		weektime: '',
		time: '',
		week: '1-20', // Set default value to "1-20"
		place: '',
		classroom: ''
	});
	tableRef.value.doLayout();
	nextTick(() => {
		tableRef.value.setScrollTop(1000000);
	});
};

// 验证第几周的格式
const validateWeekFormat = (rule: any, value: string, callback: (error?: Error) => void) => {
	if (!value) {
		return callback(); // Allow empty value, it will be defaulted to "1-20"
	}
	const regex = /^([1-9]|1[0-9]|20)(?:-([1-9]|1[0-9]|20))?$/;
	const weeks = value.split(',').map(w => w.trim());
	for (const week of weeks) {
		const match = week.match(regex);
		if (!match) {
			return callback(new Error('请输入正确的格式，如：1, 2-4, 5-17'));
		}
		const startWeek = parseInt(match[1]);
		const endWeek = match[2] ? parseInt(match[2]) : startWeek;
		if (startWeek < 1 || startWeek > 20 || endWeek < 1 || endWeek > 20 || startWeek > endWeek) {
			return callback(new Error('周数必须在1到20之间且不能出现0'));
		}
	}
	return callback();
};
</script>

<style scoped>
/* Add your scoped styles here */
.layout-pd {
	padding: 20px;
}

.module-table-uncollected {
	width: 100%;
}

.color-danger {
	color: red;
}

.pl5 {
	padding-left: 5px;
}

.flex {
	display: flex;
}

.mt15 {
	margin-top: 15px;
}

.flex-margin {
	margin-left: auto;
}
</style>