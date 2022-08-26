<template>
	<view class="container">
		<view class="content">
			<view class="header">
				<uni-icons type="arrow-left" @click="goBack" size="30" color="#557C55"></uni-icons>
				<view class="nav-title"><text>任务</text></view>
			</view>
			<view class="list">
				<toDoItem class="item" v-for="todo in todoList" :key="todo.id" :todo="todo" :styles="styles" @toggleDone="toggleDone">
					<template v-slot:leftContent>
						<view class="proccessBox"><view class="proccess" :style="`width:${todo.proccess * 0.01 * proccessWidth}px;`"></view></view>
					</template>
					<template v-slot:rightContent>
						<view class="right">
							<text style="color:#42855B;font-size: 10px;">{{ todo.proccess }}%</text>
							<uni-icons v-show="!todo.done" type="right" size="25" color="#42855B" @click="addProccess(todo.id)"></uni-icons>
						</view>
					</template>
				</toDoItem>
			</view>
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
import { useStore } from 'vuex';

import { reactive, ref, Ref, provide, getCurrentInstance, nextTick } from 'vue';
import { uuid } from '@/utils/uuid.ts';
import { onLoad } from '@dcloudio/uni-app';

interface todoInfo {
	id: string;
	name: string;
	proccess: number;
	done: boolean;
}
const styles = {
	color1: '#82A284',
	color2: '#243D25'
};

const store = useStore();
const popup = ref(null);
//添加
let todo = ref('');

//进度条盒子的长度
const proccessWidth = ref(0);
let todoList = ref([]);

// 返回上一页
const navBack = () => {
	uni.navigateBack();
};

const toggleDone = id => {
	store.dispatch('task/toggle', id);
	todoList.value = store.state.task.todoList;
};

const addProccess = id => {
	console.log(id);
	store.dispatch('task/addProccess', id);
	todoList.value = store.state.task.todoList;
};
const addTodo = () => {
	// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
	popup.value.open();
};

const delTodo = (id: string) => {
	store.dispatch('task/del', id);
	todoList.value = store.state.task.todoList;
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
		info.proccess = 0;
		store.dispatch('task/add', info);
		todoList.value = store.state.task.todoList;

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

onLoad(() => {
	todoList.value = store.state.task.todoList;
	const instance = getCurrentInstance(); //获取组件实例

	nextTick(() => {
		// #ifdef MP
		const query = uni.createSelectorQuery().in(instance);

		query
			.select('.proccessBox')
			.boundingClientRect(data => {
				proccessWidth.value = data.right;
				console.log(data);
			})
			.exec();
		// #endif

		// #ifdef H5
		proccessWidth.value = document.querySelector('.proccessBox').offsetWidth;
		console.log(proccessWidth.value);
		// #endif
	});
});
</script>

<style lang="less" scoped>
.container {
	width: 100%;
	height: 100%;
	z-index: -999;
	background-color: rgba(176, 224, 168, 0.9);
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
		color: #557c55;

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
	background: rgba(206, 229, 208, 0.3);

	.item {
		position: relative;
		.proccessBox {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: 10px;
			overflow: hidden;

			.proccess {
				height: 100%;
				background: rgba(252, 249, 198, 0.9);
				border-radius: 10px;
				transition: 0.5s linear;
			}
		}

		.right {
			display: flex;
			align-items: center;
		}
	}
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
