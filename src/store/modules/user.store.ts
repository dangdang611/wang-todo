interface user {
	code: string;
	nickName: string;
	avatarUrl: string;
	phone: string;
}

export default {
	namespaced: true,
	state: {
		userInfo: {}
	},
	mutations: {
		SAVE(state, value) {
			({ nickName: state.userInfo.nickName, avatarUrl: state.userInfo.avatarUrl } = value);
		},
		SAVE_CODE(state, value) {
			state.userInfo.code = value;
		}
	},
	actions: {
		getUserInfo({ commit }, value) {
			uni.showModal({
				title: '温馨提示',
				content: '亲，授权微信登录后才能正常使用小程序功能',
				success(res) {
					// console.log(res);

					//如果用户点击了确定按钮
					if (res.confirm) {
						uni.getUserProfile({
							desc: '获取你的昵称、头像、地区及性别',
							success: res => {
								console.log(res);
								commit('SAVE', res.userInfo);
							},
							fail: res => {
								// console.log(res);

								//拒绝授权
								uni.showToast({
									title: '您拒绝了请求,不能正常使用小程序',
									icon: 'error',
									duration: 2000
								});
								return;
							}
						});
					} else if (res.cancel) {
						//如果用户点击了取消按钮
						uni.showToast({
							title: '您拒绝了请求,不能正常使用小程序',
							icon: 'error',
							duration: 2000
						});
						return;
					}
				}
			});
		},
		saveCode({ commit }, value) {
			commit('SAVE_CODE', value);
		}
	},
	getters: {
		nickName(state) {
			return state.userInfo.nickName;
		},
		avatarUrl(state) {
			return state.userInfo.avatarUrl;
		},
		phone(state) {
			return state.userInfo.phone;
		},
		code(state) {
			return state.userInfo.code;
		}
	}
};
