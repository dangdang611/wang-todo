interface todo {
	id: string;
	name: string;
	done: boolean;
}

export default {
	namespaced: true,
	state: {
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
	},
	mutations: {
		ADD(state, value) {
			if (value.done) {
				state.todoList.push(value);
			} else {
				state.todoList.unshift(value);
			}
		},
		DEL(state, value) {
			const newList = state.todoList.filter(el => {
				return el.id !== value;
			});
			state.todoList = newList;
		},
		REFRESH(state, value) {
			state.todoList = value;
		}
	},
	actions: {
		add(context, value) {
			console.log('添加数据');
			context.commit('ADD', value);
		},
		del(context, value) {
			context.commit('DEL', value);
		},
		toggle(context, value) {
			let target;
			const newList = context.state.todoList.filter(el => {
				if (el.id == value) target = el;
				return el.id != value;
			});

			//点击的元素切换状态
			target.done = !target.done;

			context.commit('REFRESH', newList);
			//根据元素的状态来决定元素的位置
			context.commit('ADD', target);
		}
	}
};
