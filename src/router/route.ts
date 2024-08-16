import { RouteRecordRaw } from 'vue-router';

/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
declare module 'vue-router' {
	interface RouteMeta {
		title?: string;
		isLink?: string;
		isHide?: boolean;
		isKeepAlive?: boolean;
		isAffix?: boolean;
		isIframe?: boolean;
		roles?: string[];
		icon?: string;
	}
}

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `/@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('/@/views/home/index.vue'),
				meta: {
					title: 'message.router.home',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-shouye',
				},
			},
			// {
			// 	path: '/system',
			// 	name: 'system',
			// 	component: () => import('/@/layout/routerView/parent.vue'),
			// 	redirect: '/system/menu',
			// 	meta: {
			// 		title: 'message.router.system',
			// 		isLink: '',
			// 		isHide: false,
			// 		isKeepAlive: true,
			// 		isAffix: false,
			// 		isIframe: false,
			// 		roles: ['admin'],
			// 		icon: 'iconfont icon-xitongshezhi',
			// 	},
			// 	children: [
			// 		{
			// 			path: '/system/menu',
			// 			name: 'systemMenu',
			// 			component: () => import('/@/views/system/menu/index.vue'),
			// 			meta: {
			// 				title: 'message.router.systemMenu',
			// 				isLink: '',
			// 				isHide: false,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'iconfont icon-caidan',
			// 			},
			// 		},
			// 		{
			// 			path: '/system/role',
			// 			name: 'systemRole',
			// 			component: () => import('/@/views/system/role/index.vue'),
			// 			meta: {
			// 				title: 'message.router.systemRole',
			// 				isLink: '',
			// 				isHide: false,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'ele-ColdDrink',
			// 			},
			// 		},
			// 		{
			// 			path: '/system/user',
			// 			name: 'systemUser',
			// 			component: () => import('/@/views/system/user/index.vue'),
			// 			meta: {
			// 				title: 'message.router.systemUser',
			// 				isLink: '',
			// 				isHide: false,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'iconfont icon-icon-',
			// 			},
			// 		},
			// 		{
			// 			path: '/system/dept',
			// 			name: 'systemDept',
			// 			component: () => import('/@/views/system/dept/index.vue'),
			// 			meta: {
			// 				title: 'message.router.systemDept',
			// 				isLink: '',
			// 				isHide: false,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'ele-OfficeBuilding',
			// 			},
			// 		},
			// 		{
			// 			path: '/system/dic',
			// 			name: 'systemDic',
			// 			component: () => import('/@/views/system/dic/index.vue'),
			// 			meta: {
			// 				title: 'message.router.systemDic',
			// 				isLink: '',
			// 				isHide: false,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'ele-SetUp',
			// 			},
			// 		},
			// 	],
			// },
			// {
			// 	path: '/limits',
			// 	name: 'limits',
			// 	component: () => import('/@/layout/routerView/parent.vue'),
			// 	redirect: '/limits/frontEnd',
			// 	meta: {
			// 		title: 'message.router.limits',
			// 		isLink: '',
			// 		isHide: false,
			// 		isKeepAlive: true,
			// 		isAffix: false,
			// 		isIframe: false,
			// 		roles: ['admin', 'common'],
			// 		icon: 'iconfont icon-quanxian',
			// 	},
			// 	children: [
			// 		{
			// 			path: '/limits/frontEnd',
			// 			name: 'limitsFrontEnd',
			// 			component: () => import('/@/layout/routerView/parent.vue'),
			// 			redirect: '/limits/frontEnd/page',
			// 			meta: {
			// 				title: 'message.router.limitsFrontEnd',
			// 				isLink: '',
			// 				isHide: false,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin', 'common'],
			// 				icon: '',
			// 			},
			// 			children: [
			// 				{
			// 					path: '/limits/frontEnd/page',
			// 					name: 'limitsFrontEndPage',
			// 					component: () => import('/@/views/limits/frontEnd/page/index.vue'),
			// 					meta: {
			// 						title: 'message.router.limitsFrontEndPage',
			// 						isLink: '',
			// 						isHide: false,
			// 						isKeepAlive: true,
			// 						isAffix: false,
			// 						isIframe: false,
			// 						roles: ['admin', 'common'],
			// 						icon: '',
			// 					},
			// 				},
			// 				{
			// 					path: '/limits/frontEnd/btn',
			// 					name: 'limitsFrontEndBtn',
			// 					component: () => import('/@/views/limits/frontEnd/btn/index.vue'),
			// 					meta: {
			// 						title: 'message.router.limitsFrontEndBtn',
			// 						isLink: '',
			// 						isHide: false,
			// 						isKeepAlive: true,
			// 						isAffix: false,
			// 						isIframe: false,
			// 						roles: ['admin', 'common'],
			// 						icon: '',
			// 					},
			// 				},
			// 			],
			// 		},
			// 		{
			// 			path: '/limits/backEnd',
			// 			name: 'limitsBackEnd',
			// 			component: () => import('/@/layout/routerView/parent.vue'),
			// 			meta: {
			// 				title: 'message.router.limitsBackEnd',
			// 				isLink: '',
			// 				isHide: false,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin', 'common'],
			// 				icon: '',
			// 			},
			// 			children: [
			// 				{
			// 					path: '/limits/backEnd/page',
			// 					name: 'limitsBackEndEndPage',
			// 					component: () => import('/@/views/limits/backEnd/page/index.vue'),
			// 					meta: {
			// 						title: 'message.router.limitsBackEndEndPage',
			// 						isLink: '',
			// 						isHide: false,
			// 						isKeepAlive: true,
			// 						isAffix: false,
			// 						isIframe: false,
			// 						roles: ['admin', 'common'],
			// 						icon: '',
			// 					},
			// 				},
			// 			],
			// 		},
			// 	],
			// },
			{
				path: '/fun',
				name: 'funIndex',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/fun/tagsView',
				meta: {
					// title的内容在国际化里
					title: 'message.router.funIndex',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-crew_feature',
				},
				children: [
					{
						path: '/fun/addTimeTable',
						name: 'funAddTimeTable',
						component: () => import('/@/views/fun/addTimeTable/index.vue'),
						meta: {
							title: 'message.router.funAddTimeTable',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'ele-Pointer',
						},
					},
					// {
					// 	path: '/fun/tagsView',
					// 	name: 'funTagsView',
					// 	component: () => import('/@/views/fun/tagsView/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funTagsView',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'ele-Pointer',
					// 	},
					// },
					// {
					// 	path: '/fun/countup',
					// 	name: 'funCountup',
					// 	component: () => import('/@/views/fun/countup/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funCountup',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'ele-Odometer',
					// 	},
					// },
					// {
					// 	path: '/fun/wangEditor',
					// 	name: 'funWangEditor',
					// 	component: () => import('/@/views/fun/wangEditor/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funWangEditor',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'iconfont icon-fuwenbenkuang',
					// 	},
					// },
					// {
					// 	path: '/fun/cropper',
					// 	name: 'funCropper',
					// 	component: () => import('/@/views/fun/cropper/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funCropper',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'iconfont icon-caijian',
					// 	},
					// },
					// {
					// 	path: '/fun/qrcode',
					// 	name: 'funQrcode',
					// 	component: () => import('/@/views/fun/qrcode/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funQrcode',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'iconfont icon-ico',
					// 	},
					// },
					// {
					// 	path: '/fun/echartsMap',
					// 	name: 'funEchartsMap',
					// 	component: () => import('/@/views/fun/echartsMap/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funEchartsMap',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'iconfont icon-ditu',
					// 	},
					// },
					// {
					// 	path: '/fun/openLayerMap',
					// 	name: 'funOpenLayerMap',
					// 	component: () => import('/@/views/fun/openLayerMap/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funOpenLayerMap',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'iconfont icon-ditu',
					// 	},
					// },
					// {
					// 	path: '/fun/arcgisMap',
					// 	name: 'funArcgisMap',
					// 	component: () => import('/@/views/fun/arcgisMap/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funArcgisMap',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'iconfont icon-ditu',
					// 	},
					// },
					// {
					// 	path: '/fun/arcgisMap1',
					// 	name: 'funArcgisMap1',
					// 	component: () => import('/@/views/fun/arcgisMap1/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funArcgisMap1',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: false,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'iconfont icon-ditu',
					// 	},
					// },
					// {
					// 	path: '/fun/printJs',
					// 	name: 'funPrintJs',
					// 	component: () => import('/@/views/fun/printJs/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funPrintJs',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'ele-Printer',
					// 	},
					// },
					// {
					// 	path: '/fun/clipboard',
					// 	name: 'funClipboard',
					// 	component: () => import('/@/views/fun/clipboard/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funClipboard',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'ele-DocumentCopy',
					// 	},
					// },
					// {
					// 	path: '/fun/gridLayout',
					// 	name: 'funGridLayout',
					// 	component: () => import('/@/views/fun/gridLayout/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funGridLayout',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'iconfont icon-tuodong',
					// 	},
					// },
					// {
					// 	path: '/fun/splitpanes',
					// 	name: 'funSplitpanes',
					// 	component: () => import('/@/views/fun/splitpanes/index.vue'),
					// 	meta: {
					// 		title: 'message.router.funSplitpanes',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin', 'common'],
					// 		icon: 'iconfont icon--chaifenlie',
					// 	},
					// },
					{
						path: '/fun/timeTable',
						name: 'funTimeTable',
						component: () => import('/@/views/fun/timeTable/index.vue'),
						meta: {
							title: 'message.router.funTimeTable',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'iconfont icon--chaifenlie',
						},
					},
				],
			},
			{
				path: '/params',
				name: 'paramsIndex',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/params/common',
				meta: {
					title: 'message.router.paramsIndex',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-zhongduancanshu',
				},
				children: [
					{
						path: '/params/common',
						name: 'paramsCommon',
						component: () => import('/@/views/params/common/index.vue'),
						meta: {
							title: 'message.router.paramsCommon',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-putong',
						},
					},
					{
						path: '/params/common/details',
						name: 'paramsCommonDetails',
						component: () => import('/@/views/params/common/details.vue'),
						meta: {
							title: 'message.router.paramsCommonDetails',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-Comment',
						},
					},
					{
						path: '/params/dynamic',
						name: 'paramsDynamic',
						component: () => import('/@/views/params/dynamic/index.vue'),
						meta: {
							title: 'message.router.paramsDynamic',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-dongtai',
						},
					},
					/**
					 * tagsViewName 为要设置不同的 "tagsView 名称" 字段
					 * 如若需设置不同 "tagsView 名称"，tagsViewName 字段必须要有
					 */
					{
						path: '/params/dynamic/details/:t/:id/:tagsViewName',
						name: 'paramsDynamicDetails',
						component: () => import('/@/views/params/dynamic/details.vue'),
						meta: {
							title: 'message.router.paramsDynamicDetails',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-Lightning',
						},
					},
				],
			},

			{
				path: '/info',
				name: 'infoIndex',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/info/news',
				meta: {
					title: 'message.router.infoIndex',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-biaodan',
				},
				children: [
					{
						path: '/info/news',
						name: 'infoNews',
						component: () => import('/@/views/info/news/index.vue'),	
						meta: {
							title: 'message.router.infoNews',
							isLink: '',
							isHide: false,	
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'fa fa-file-o',
						},
					},
					{
						path: '/info/addNews',
						name: 'infoAddNews',
						component: () => import('/@/views/info/addNews/index.vue'),	
						meta: {
							title: 'message.router.infoAddNews',
							isLink: '',
							isHide: false,	
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'fa fa-file-o',
						},
					},
				],
			},

			{
				path: '/admin',
				name: 'adminIndex',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/admin/reviewNews',
				meta: {
					title: 'message.router.adminIndex',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-zhongduancanshu',
				},
				children: [
					{
						path: '/admin/reviewNews',
						name: 'adminReviewNews',
						component: () => import('/@/views/admin/reviewNews/index.vue'),
						meta: {
							title: 'message.router.adminReviewNews',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'iconfont icon-putong',
						},
					},
				],
			},
			{
				path: '/personal',
				name: 'personal',
				component: () => import('/@/views/personal/index.vue'),
				meta: {
					title: 'message.router.personal',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-gerenzhongxin',
				},
			},
		],
	},
];

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			title: 'message.staticRoutes.notFound',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			title: 'message.staticRoutes.noPower',
			isHide: true,
		},
	},
];

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端添加路由的话，请在 `dynamicRoutes 数组` 中添加
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
	{
		path: '/register',
		name: 'register',
		component: () => import('/@/views/register/index.vue'),
		meta: {
			title: '注册',
		},
	},
	/** 
	 * 提示：写在这里的为全屏界面，不建议写在这里
	 * 请写在 `dynamicRoutes` 路由数组中
	 */
	// {
	// 	path: '/visualizingDemo1',
	// 	name: 'visualizingDemo1',
	// 	component: () => import('/@/views/visualizing/demo1.vue'),
	// 	meta: {
	// 		title: 'message.router.visualizingLinkDemo1',
	// 	},
	// },
	// {
	// 	path: '/visualizingDemo2',
	// 	name: 'visualizingDemo2',
	// 	component: () => import('/@/views/visualizing/demo2.vue'),
	// 	meta: {
	// 		title: 'message.router.visualizingLinkDemo2',
	// 	},
	// },
];
