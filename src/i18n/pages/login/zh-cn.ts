import { buttonGroupContextKey } from "element-plus";
import { placeholderSign } from "element-plus/es/components/table-v2/src/private";
import { register } from "module";

// 定义内容
export default {
	label: {
		one1: '用户名登录',
		two2: '手机号登录',
	},
	link: {
		one3: '第三方登录',
		two4: '友情链接',
	},
	account: {
		accountPlaceholder1: '用户名 admin 或不输均为 common',
		accountPlaceholder2: '密码：123456',
		accountPlaceholder3: '请输入验证码',
		accountBtnText1: '登 录',
		accountBtnText2: '去 注 册',
	},
	mobile: {
		placeholder1: '请输入手机号',
		placeholder2: '请输入验证码',
		codeText: '获取验证码',
		btnText: '登 录',
		msgText: '* 温馨提示：建议使用谷歌、Microsoft Edge，版本 79.0.1072.62 及以上浏览器，360浏览器请使用极速模式',
	},
	register: {
		text: '注册',
		placeholder1: '请输入用户名',
		placeholderEmail: '请输入邮箱',
		sendEmailCode: '发送验证码',
		placeholderPassword: '请输入密码',
		placeholderConfirmPassword: '请确认密码',
		btnText1: '注 册',
		btnText2: '去 登 录',
		msgText: '* 温馨提示：建议使用谷歌、Microsoft Edge，版本 79.0.1072.62 及以上浏览器，360浏览器请使用极速模式',
	},
	scan: {
		text: '打开手机扫一扫，快速登录/注册',
	},
	signInText: '欢迎回来！',
};
