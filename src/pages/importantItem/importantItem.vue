<template>
	<view class="container">
		<view class="content">
			<view class="header">
				<uni-icons type="arrow-left" @click="goBack" size="30" color="#b93160"></uni-icons>
				<view class="nav-title"><text>重要</text></view>
			</view>
			<view class="list">
				<toDoItem v-for="todo in todoList" :key="todo.id" :todo="todo" :styles="styles" @toggleDone="toggleDone">
					<template v-slot:rightContent>
						<uni-icons type="star-filled" size="26" color="#b93160"></uni-icons>
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

import { reactive, ref, Ref, provide } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { uuid } from '@/utils/uuid.ts';

interface todoInfo {
	id: string;
	name: string;
	done: boolean;
}
const styles = {
	color1: '#ffb3b3',
	color2: '#F65A83'
};

const store = useStore();
const popup = ref(null);
//添加
let todo = ref('');
let todoList = ref([]);

// 返回上一页
const navBack = () => {
	uni.navigateBack();
};

const toggleDone = id => {
	store.dispatch('importantItem/del', id);
	todoList.value = store.state.importantItem.todoList;
};

const addTodo = () => {
	// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
	popup.value.open();
};

const delTodo = (id: string) => {
	store.dispatch('importantItem/del', id);
	todoList.value = store.state.importantItem.todoList;
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
		store.dispatch('importantItem/add', info);
		todoList.value = store.state.importantItem.todoList;

		todo.value = '';
	} else {
		uni.showToast({
			title: `任务内容不能为空`,
			icon: 'none'
		});
	}
};

const goBack = () => {
	console.log(11);
	uni.navigateBack({
		delta: 1 //返回层数，2则上上页
	});
};

onLoad(() => {
	todoList.value = store.state.importantItem.todoList;
});
</script>

<style lang="less" scoped>
.container {
	width: 100%;
	height: 100%;
	z-index: -999;
	background-color: #f2d1d1;
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
		color: #b93160;

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
