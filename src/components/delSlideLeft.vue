<template>
	<view class="box-slideLeft">
		<view class="touch-item touch-slideLeft " @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :style="data.item_show.txtStyle"><slot /></view>
		<view class="touch-item del-box-touch-slideLeft cf-shuCenter" @click="delItem"><view class="iconfont icon-shanchu"></view></view>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject } from 'vue';

//bug4:变量名取id会是undefined
const props = defineProps({
	todoId: {
		type: String,
		default: 'aaa'
	}
});
const delTodo = inject('delTodo') as Function;

let data = reactive({
	item_show: {
		txtStyle: ''
	}
});
const delBtnWidth = 60; //删除按钮宽度单位（rpx）
let startX = ref('');

//点击删除按钮事件
const delItem = function() {
	delTodo(props.todoId);
};

const touchS = function(e) {
	if (e.touches.length == 1) {
		//设置触摸起始点水平方向位置
		startX.value = e.touches[0].clientX;
	}
};
const touchM = function(e) {
	if (e.touches.length == 1) {
		//手指移动时水平方向位置
		let moveX = e.touches[0].clientX;
		//手指起始点位置与移动期间的差值
		let disX = startX.value - moveX;

		let txtStyle = '';

		if (disX == 0 || disX < 0) {
			//如果移动距离小于等于0，说明向右滑动，文本层位置不变
			txtStyle = 'left:0px';
		} else if (disX > 0) {
			//移动距离大于0，文本层left值等于手指移动距离
			txtStyle = 'left:-' + disX + 'px';

			if (disX >= delBtnWidth) {
				//控制手指移动距离最大值为删除按钮的宽度
				txtStyle = 'left:-' + delBtnWidth + 'px';
			}
		}

		//获取手指触摸的是哪一项
		data.item_show.txtStyle = txtStyle;
	}
};

const touchE = function(e) {
	let that = this;
	if (e.changedTouches.length == 1) {
		//手指移动结束后水平位置
		let endX = e.changedTouches[0].clientX;

		//触摸开始与结束，手指移动的距离
		let disX = startX.value - endX;

		//如果距离小于删除按钮的1/2，不显示删除按钮
		let txtStyle = disX > delBtnWidth / 2 ? 'left:-' + delBtnWidth + 'px' : 'left:0px';

		//获取手指触摸的是哪一项
		data.item_show.txtStyle = txtStyle;
	}
};
</script>

<style lang="scss">
@import '@/static/iconfont.css'; //便于有删除图标

.box-slideLeft {
	view {
		box-sizing: border-box;
	}
	position: relative;
	overflow: hidden;

	.touch-item {
		position: absolute;
		top: 0;
		background-color: #ffffff;
		// border-radius: 10px;
		overflow: hidden;
	}

	.touch-slideLeft {
		position: relative;
		width: 100%;
		z-index: 1;
		transition: left 0.2s ease-in-out;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.del-box-touch-slideLeft {
		z-index: 0;
		right: 0;
		float: left;
		width: 70px;
		height: 100%;
		line-height: 101px;
		background-color: #ea5863;
		border-radius: 0 10px 10px 0;
		color: #fff;
		font-size: 18px;
		font-weight: lighter;
		text-align: center;
	}
	.icon-shanchu {
		font-size: 44upx;
	}

	.cf-shuCenter {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}
</style>
