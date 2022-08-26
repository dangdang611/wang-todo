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
				name: '打陈文超',
				done: false
			},
			{
				id: '002',
				name: '打周贵新',
				done: false
			},
			{
				id: '003',
				name: '打贵贵',
				done: false
			}
		]
	},
	mutations: {
		ADD(state, value) {
			state.todoList.unshift(value);
		},
		DEL(state, value) {
			const newList = state.todoList.filter(el => {
				return el.id !== value;
			});
			state.todoList = newList;
		}
	},
	actions: {
		add(context, value) {
			context.commit('ADD', value);
		},
		del(context, value) {
			context.commit('DEL', value);
		}
	}
};
