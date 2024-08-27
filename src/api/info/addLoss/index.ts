import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method addLoss 添加失物信息
 */
export function useAddLossApi() {
	return {
		addLoss: (data: object) => {
            return request({
                url: '/user/addLoss/',
                method: 'post',
                data,
            });
		},
	};
}