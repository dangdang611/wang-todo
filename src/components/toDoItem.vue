<template>
	<uni-transition ref="ani" :show="show">
		<uni-card class="card" ref="todo" :is-shadow="false" :class="status ? 'done' : ''">
			<delSlideLeft :todoId="props.todo.id">
				<label @click="run">
					<radio :checked="status" color="#9C9EFE" />
					<text class="name">{{ props.todo.name }}</text>
				</label>
			</delSlideLeft>
		</uni-card>
	</uni-transition>
</template>

<script setup lang="ts">
import delSlideLeft from './delSlideLeft.vue';

import { ref, reactive, nextTick } from 'vue';
import { onReady } from '@dcloudio/uni-app';

const todo = ref(null);
const ani = ref(null);

const props = defineProps(['todo']);
const emits = defineEmits(['toggleDone']);

let status = ref(false);
let show = ref(true);

status.value = props.todo.done;

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
	status.value = !status.value;
	emits('toggleDone', props.todo.id);
};

onReady(() => {
	nextTick(() => {
		ani.value.init({
			duration: 300,
			timingFunction: 'linear',
			transformOrigin: '50% 50%',
			delay: 0
		});
	});
});
</script>

<style lang="less">
.card {
	/deep/.uni-card {
		margin: 0 !important;
		padding: 0 !important;
	}
}

.radio {
	transform: scale(0.7);
}

.done {
	text-decoration: line-through;
	color: #a66cff;

	.name {
		color: #bbb !important;
	}
}
</style>
