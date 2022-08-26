<template>
	<view class="container">
		<view class="content">
			<view class="header">
				<uni-icons type="arrow-left" @click="goBack" size="30" color="#1C658C"></uni-icons>
				<view class="nav-title"><text>计划内</text></view>
			</view>
			<view class="nav">
				<view class="select">
					<uni-icons type="bars" size="25" color="#1C658C"></uni-icons>
					<uni-data-select class="selectList" v-model="selectValue" :localdata="selectOptions" @change="changeOptions" :clear="false"></uni-data-select>
				</view>
			</view>
			<view class="list">
				<toDoItem v-for="todo in todoList" :key="todo.id" :todo="todo" :styles="styles" @toggleDone="toggleDone">
					<template v-slot:rightContent>
						<view class="timeInterval" v-if="formatDate.handlerDateDurationCurrent(todo.overTime).length > 0">
							<uni-countdown
								:font-size="10"
								:day="formatDate.handlerDateDurationCurrent(todo.overTime)[0]"
								:hour="formatDate.handlerDateDurationCurrent(todo.overTime)[1]"
								:minute="formatDate.handlerDateDurationCurrent(todo.overTime)[2]"
								:second="0"
							/>
						</view>
						<text v-else style="color:red;font-size: 12px;">已过期</text>
					</template>
				</toDoItem>
			</view>
		</view>
		<view class="footer"><uni-icons @click="addTodo" type="plus" size="65" color="#ffff"></uni-icons></view>
		<uni-popup ref="popup1" type="bottom">
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
			<view class="other">
				<view class="overTime">
					<uni-icons @click="" type="compose" size="22" color="#fff"></uni-icons>
					<text @click="openTimePlane">{{ stopTime }}到期</text>
				</view>
				<view class="noteMe">
					<uni-icons @click="" type="notification" size="25" color="#ccc"></uni-icons>
					<text>提醒我</text>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="popup2" type="center">
			<view class="timePlane">
				<view class="timeShow">
					<uni-section title="截至时间：" type="line"></uni-section>
					<uni-dateformat :date="single" format="yyyy/MM/dd"></uni-dateformat>
				</view>
				<view class="example-body"><uni-datetime-picker returnType="timestamp" :start="start" v-model="single" @change="selectTime($event)" /></view>
			</view>
		</uni-popup>
	</view>
</template>

<!-- http://101.35.194.184:8080/club/img/foreign/584/1661219421768431529176.webp -->
<script setup lang="ts">
import toDoItem from '@/components/toDoItem.vue';
import { useStore } from 'vuex';

import { reactive, ref, Ref, provide, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { uuid } from '@/utils/uuid';
import formatDate from '@/utils/formatDate';

interface todoInfo {
	id: string;
	name: string;
	done: boolean;
	overTime: string;
}
const styles = {
	color1: '#ffb3b3',
	color2: '#F65A83'
};

const store = useStore();
const popup1 = ref(null);
const popup2 = ref(null);

//添加
let todo = ref('');
let todoList = ref([]);

let isMask = ref(false);

const selectValue = ref(1);
const selectOptions = ref([{ value: 0, text: '过期' }, { value: 1, text: '今天' }, { value: 2, text: '明天' }, { value: 3, text: '本周' }, { value: 4, text: '全部' }]);

let single = ref('');
let stopTime = ref('');
let start = ref('2022-08-26');

// 返回上一页
const navBack = () => {
	uni.navigateBack();
};

//获取元素
const getTodoList = (type: number) => {
	switch (type) {
		case 0: {
			todoList.value = store.getters['plan/pastList'];
			break;
		}
		case 1: {
			todoList.value = store.getters['plan/todayList'];
			break;
		}
		case 2: {
			todoList.value = store.getters['plan/tomorrowList'];
			break;
		}
		case 3: {
			todoList.value = store.getters['plan/weekList'];
			break;
		}
		case 4: {
			todoList.value = store.getters['plan/allList'];
			break;
		}
	}
};

const openTimePlane = () => {
	popup2.value.open();
};

//选择日期
const selectTime = e => {
	//计算日期至今距离多少天
	let day = formatDate.getDaysChaToNow(e);

	switch (day) {
		case 0: {
			stopTime.value = '今天';
			break;
		}
		case 1: {
			stopTime.value = '明天';
			break;
		}
		case 2: {
			stopTime.value = '后天';
			break;
		}
		default: {
			stopTime.value = day + '天后';
		}
	}
};

//切换选项
const changeOptions = e => {
	getTodoList(e);
};

const toggleDone = id => {
	store.dispatch('plan/del', id);
	getTodoList(selectValue.value);
};

const addTodo = () => {
	// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
	popup1.value.open();
};

const delTodo = (id: string) => {
	store.dispatch('plan/del', id);
	getTodoList(selectValue.value);
};

//将删除方法暴露给子组件
provide('delTodo', delTodo);

const iconClick = () => {
	if (todo.value != '') {
		popup1.value.close();

		let info: todoInfo = {
			id: '',
			name: todo.value,
			done: false
		};
		info.id = uuid();
		info.overTime = single.value === '' ? new Date(new Date().toLocaleDateString()).getTime() + 8640000 : single.value;

		store.dispatch('plan/add', info);
		getTodoList(selectValue.value);

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
	getTodoList(selectValue.value);
	start.value = formatDate.toDate(new Date().getTime());
});
</script>

<style lang="less" scoped>
.container {
	// position: relative;
	width: 100%;
	height: 100%;
	z-index: -999;
	background-color: #bdefff;
}

.content {
	.header {
		width: 100%;
		margin-bottom: 20px;
		z-index: 999;
		padding-top: var(--status-bar-height);
		padding-left: 40upx;

		.nav-title {
			display: flex;
			flex-direction: column;
			color: #1c658c;

			.overTime {
				position: relative;
				display: flex;
				align-items: center;
				background: #000;

				.example-body {
					display: none;
				}
			}
			text:nth-of-type(1) {
				font-size: 20px;
			}
		}
	}

	.nav {
		margin-left: 20upx;
		display: flex;
		align-items: center;
		.select {
			padding: 2px 5px;
			display: flex;
			align-items: center;
			width: 100px;
			background-color: rgba(239, 239, 239, 0.4);
			border-radius: 6px;
			.selectList {
				/deep/ .uni-select {
					border: transparent;
				}
				/deep/ .uni-select__input-placeholder,
				/deep/.uni-select__input-text {
					color: #1c658c !important;
				}
			}
		}
	}
	.list {
		margin: 0 auto;
		margin-top: 10px;
		width: 95%;
		border-radius: 5px;
		overflow: auto;
		height: 600rpx;
		background: rgba(255, 255, 255, 0.3);

		.timeInterval {
			/deep/ .uni-countdown__number.data-v-02c75d70 {
				color: #89cffd !important;
			}

			/deep/ .uni-countdown__splitor.data-v-02c75d70 {
				color: #89cffd !important;
			}
		}
	}
}

.footer {
	width: 100%;
	position: fixed;
	bottom: 10px;
	text-align: center;
}

.other {
	padding: 5px 20px;
	display: flex;
	background: #fff;
	color: #666;

	.overTime {
		display: flex;
		align-items: center;
		padding: 5px 7px;
		margin-right: 30px;
		background: #1c658c;
		border-radius: 50px;
		color: #fff;
	}

	.noteMe {
		display: flex;
		align-items: center;

		:hover {
			background: rgba(255, 255, 255, 0.3);
		}
	}

	text {
		margin-left: 5px;
	}
}
//bug3:外面加一层就样式穿透失败
/deep/ .uni-easyinput__content {
	position: relative;
	height: 60px;
}

.timePlane {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 280px;
	height: 120px;
	background: #fff;
	border-radius: 15px;

	/deep/.uni-section .uni-section-header__content .distraction {
		font-size: 18px !important;
	}
	/deep/.uni-section .uni-section-header {
		padding: 11px 0px !important;
	}

	.timeShow {
		display: flex;
		align-items: center;
	}
}
</style>
