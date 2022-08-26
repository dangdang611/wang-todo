<template>
	<view class="content">
		<ui-row class="header">
			<view class="left"><uni-icons custom-prefix="t-icon" type="t-icon-gerenzhongxin" size="30"></uni-icons></view>
			<view class="right">
				<text>当当</text>
				<text>1861393****</text>
			</view>
		</ui-row>
		<uni-list class="list">
			<uni-list-item @click="goList('../oneDay/oneDay')" link :show-extra-icon="true" :extra-icon="extraIcon1" title="我的一天"></uni-list-item>
			<uni-list-item @click="goList('../importantItem/importantItem')" link :show-extra-icon="true" :extra-icon="extraIcon2" title="重要"></uni-list-item>
			<uni-list-item @click="goList('../task/task')" link :show-extra-icon="true" :extra-icon="extraIcon3" title="任务"></uni-list-item>
			<uni-list-item @click="goList('../plan/plan')" link :show-extra-icon="true" :extra-icon="extraIcon4" title="计划内"></uni-list-item>
		</uni-list>

		<view class="footer">
			<view class="tools">
				<view class="left">
					<uni-icons class="right" type="plusempty" size="32" color="#003865"></uni-icons>
					<text>新建列表</text>
				</view>
				<uni-icons type="folder-add" size="32" color="#003865"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const extraIcon1 = ref({ type: 'checkbox', color: '#B2A4FF', size: '25' });
const extraIcon2 = ref({ type: 'star', color: '#FD5D5D', size: '25' });
const extraIcon3 = ref({ type: 'calendar', color: '#4E944F', size: '25' });
const extraIcon4 = ref({ type: 'compose', color: '#73A9AD', size: '25' });

const goList = path => {
	//在起始页面跳转到test.vue页面并传递参数
	uni.navigateTo({
		url: path
	});
};
</script>

<style lang="less" scoped>
.content {
	height: 100%;
	padding: 10px;
	box-sizing: border-box;

	.header {
		margin-bottom: 10px;
		display: flex;
		align-items: center;

		.left {
			margin-right: 5px;
			.t-icon {
				vertical-align: middle;
				width: 36px;
				height: 36px;
			}
		}
		.right {
			display: flex;
			flex-direction: column;

			text:nth-child(1) {
				font-size: 18px;
			}

			text:nth-child(2) {
				font-size: 14px;
				color: #999;
			}
		}
	}

	.list {
		/deep/ .uni-list-item__content-title {
			font-size: 16px;
		}
	}

	/* bug2:使用定位+width:100%,盒子会溢出父盒子，box-sizing失效 */
	.footer {
		position: fixed;
		bottom: 10px;
		right: 10px;
		left: 10px;

		.tools {
			display: flex;
			justify-content: space-between;
			font-size: 16px;
			color: #003865;

			.left {
				display: flex;
				align-items: center;

				uni-icons {
					margin-right: 5px;
				}
			}
		}
	}
}
</style>
