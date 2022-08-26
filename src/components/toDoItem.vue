<template>
	<uni-transition ref="ani" :show="show">
		<uni-card class="card" ref="todo" :is-shadow="false">
			<delSlideLeft :todoId="props.todo.id">
				<view class="leftSlot"><slot name="leftContent"></slot></view>
				<view class="rightSlot"><slot name="rightContent"></slot></view>
				<label @click="run" style="z-index:99" :class="props.todo.done ? 'done' : 'noDone'" :style="`color:${props.styles.color2}`">
					<radio class="radio" :checked="props.todo.done" :color="props.styles.color1" />
					<text class="name">{{ props.todo.name }}</text>
				</label>
			</delSlideLeft>
		</uni-card>
	</uni-transition>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import delSlideLeft from './delSlideLeft.vue';

const todo = ref(null);
const ani = ref(null);

const props = defineProps(['todo', 'styles']);
const emits = defineEmits(['toggleDone']);

let show = ref(true);

const run = () => {
	// 向下平移100px
	ani.value.step({
		translateY: '10px'
	});
	// 上面的动画执行完成后，等待200毫秒平移到 0px
	ani.value.step(
		{
			translateY: '0px'
		},
		{
			imingFunction: 'liner',
			duration: 200
		}
	);
	// 开始执行动画
	ani.value.run(() => {
		toggle();
	});
};

const toggle = () => {
	emits('toggleDone', props.todo.id);
};

onReady(() => {
	nextTick(() => {
		//存在bug，会不显示
		// ani.value.init({
		// 	duration: 300,
		// 	timingFunction: 'linear',
		// 	transformOrigin: '50% 50%',
		// 	delay: 0
		// });
	});
});
</script>

<style lang="less" scoped>
.card {
	position: relative;
	/deep/.uni-card {
		margin: 0 !important;
		padding: 0 !important;
	}

	.leftSlot {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -99;
	}
	.rightSlot {
		position: absolute;
		top: 0;
		right: 0;
	}
	.radio {
		transform: scale(0.8);
	}

	.done {
		text-decoration: line-through;

		.name {
			color: #bbb !important;
		}
	}

	.noDone {
		.name {
			color: #666 !important;
		}
	}
}
</style>
