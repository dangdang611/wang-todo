<template>
	<view class="container">
		<image class="bg-img" src="http://101.35.194.184:8080/club/img/foreign/314/1661219421498431529176.webp"></image>
		<view class="content">
			<view class="header">
				<uni-icons type="arrow-left" @click="goBack" size="30" color="#ffff"></uni-icons>
				<view class="nav-title">
					<text>我的一天</text>
					<text>{{ time }}</text>
				</view>
			</view>
			<view class="list"><toDoItem v-for="todo in data.todoList" :key="todo.id" :todo="todo" @toggleDone="toggleDone" /></view>
		</view>
		<view class="footer"><uni-icons @click="addTodo" type="plus" size="65" color="#ffff"></uni-icons></view>
		<uni-popup ref="popup" type="bottom">
			<uni-easyinput
				prefixIcon="vip-filled"
				suffixIcon="arrow-up"
				v-model="todo"
				placeholder="添加任务"
				@iconClick="iconClick"
				@confirm="iconClick"
				trim="both"
				clearable
				focus
			></uni-easyinput>
		</uni-popup>
	</view>
</template>

<!-- http://101.35.194.184:8080/club/img/foreign/584/1661219421768431529176.webp -->
<script setup lang="ts">
import toDoItem from '@/components/toDoItem.vue';

import { reactive, ref, Ref, provide } from 'vue';
import { uuid } from '@/utils/uuid.ts';

interface todoInfo {
	id: string;
	name: string;
	done: boolean;
}

const popup = ref(null);

let todo = ref('');

const date = new Date();
const day = '星期' + '日一二三四五六'.charAt(new Date().getDay());
const time = date.getMonth() + 1 + '月' + date.getDate() + '日 ' + day;
// 返回上一页
const navBack = () => {
	uni.navigateBack();
};

let data = reactive({
	todoList: [
		{
			id: '001',
			name: '炫10个馒头',
			done: false
		},
		{
			id: '002',
			name: '看图解Chrome V8两章',
			done: false
		},
		{
			id: '003',
			name: '看透视Http两章',
			done: false
		},
		{
			id: '004',
			name: 'leetcode刷题十道题',
			done: true
		}
	]
});

const toggleDone = id => {
	let target;
	const newList = data.todoList.filter(el => {
		if (el.id == id) target = el;
		return el.id != id;
	});

	//点击的元素切换状态
	target.done = !target.done;

	//根据元素的状态来决定元素的位置
	if (target.done) {
		newList.push(target);
	} else {
		newList.unshift(target);
	}
	data.todoList = newList;
};

const addTodo = () => {
	// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
	popup.value.open();
};

const delTodo = (id: string) => {
	const newList = data.todoList.filter(el => {
		return el.id !== id;
	});
	data.todoList = newList;
};

//将删除方法暴露给子组件
provide('delTodo', delTodo);

const iconClick = () => {
	if (todo.value != '') {
		popup.value.close();

		let info: todoInfo = {
			id: '',
			name: todo.value,
			done: false
		};
		info.id = uuid();
		data.todoList.unshift(info);
		data.todoList = data.todoList;

		todo.value = '';
	} else {
		uni.showToast({
			title: `任务内容不能为空`,
			icon: 'none'
		});
	}
};

const goBack = () => {
	uni.navigateBack({
		delta: 1 //返回层数，2则上上页
	});
};
</script>

<style lang="less" scoped>
.bg-img {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: -999;
}
.header {
	width: 100%;
	z-index: 999;
	padding-top: var(--status-bar-height);
	padding-left: 40upx;
	padding-right: 40upx;

	.nav-title {
		display: flex;
		flex-direction: column;
		color: #fff;

		text:nth-of-type(1) {
			font-size: 20px;
		}
	}
}

.list {
	margin: 0 auto;
	margin-top: 10px;
	width: 95%;
	border-radius: 5px;
	overflow: auto;
	height: 820rpx;
	background: rgba(255, 255, 255, 0.3);
}
.footer {
	width: 100%;
	position: fixed;
	bottom: 10px;
	text-align: center;
}

//bug3:外面加一层就样式穿透失败
/deep/ .uni-easyinput__content {
	margin-bottom: 10px;
	position: relative;
	height: 60px;
}
</style>
