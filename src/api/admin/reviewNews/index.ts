import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method register 用户注册
 */
export function useReviewNewsApi() {
	return {
		getReviewNewsData: () => {
            return request({
                url: '/user/reviewNews/',
                method: 'get',
            });
		},
        modifyNews: (data: Object) => {
            return request({
                url: '/user/editNews/',
                method: 'post',
                data
            });
        }
	};
}