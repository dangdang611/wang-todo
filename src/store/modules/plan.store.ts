import formatDate from '@/utils/formatDate';
interface todo {
	id: string;
	name: string;
	done: boolean;
	overTime: string;
}

export default {
	namespaced: true,
	state: {
		todoList: [
			{
				id: '367cff34-0eed-498a-879c-8d38880a94be',
				name: '看剧10集',
				done: false,
				overTime: 1661451840000
			}
		]
	},
	mutations: {
		ADD(state, value: todo) {
			if (value.done) {
				state.todoList.push(value);
			} else {
				state.todoList.unshift(value);
			}
		},
		DEL(state, value: string) {
			const newList = state.todoList.filter(el => {
				return el.id !== value;
			});
			state.todoList = newList;
		},
		REFRESH(state, value: todo[]) {
			state.todoList = value;
		}
	},
	actions: {
		add(context, value: todo) {
			context.commit('ADD', value);
		},
		del(context, value: string) {
			context.commit('DEL', value);
		},
		toggle(context, value: string) {
			let target;
			const newList = context.state.todoList.filter(el => {
				if (el.id === value) target = el;
				return el.id != value;
			});

			//点击的元素切换状态
			target.done = !target.done;
			target.proccess = target.done ? 100 : 0;

			context.commit('REFRESH', newList);
			//根据元素的状态来决定元素的位置
			context.commit('ADD', target);
		}
	},
	getters: {
		pastList(state) {
			const result = state.todoList.filter(el => {
				return formatDate.getDaysChaToNow(el.overTime) === -1;
			});

			return result;
		},
		todayList(state) {
			const result = state.todoList.filter(el => {
				return formatDate.getDaysChaToNow(el.overTime) === 0;
			});

			return result;
		},
		tomorrowList(state) {
			const result = state.todoList.filter(el => {
				return formatDate.getDaysChaToNow(el.overTime) === 1;
			});

			return result;
		},
		weekList(state) {
			const result = state.todoList.filter(el => {
				return formatDate.getDaysChaToNow(el.overTime) > 1;
			});

			return result;
		},
		allList(state) {
			return state.todoList;
		}
	}
};
