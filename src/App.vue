<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import store from '@/store';
onLaunch(() => {
	//获取code
	uni.login({
		provider: 'weixin',
		success(res) {
			store.dispatch('user/saveCode', res.code);
		}
	});
	wxGetUserInfo();
});
onShow(() => {
	console.log('App Show');
});
onHide(() => {
	console.log('App Hide');
});

// 获取用户信息
function wxGetUserInfo() {
	store.dispatch('user/getUserInfo');
}
</script>

<style lang="scss">
@import '@/static/iconfont-weapp-icon.css';

page {
	width: 100%;
	height: 100%;
}
</style>
