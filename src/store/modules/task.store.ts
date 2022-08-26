interface todo {
	id: string;
	name: string;
	proccess: number;
	done: boolean;
}

export default {
	namespaced: true,
	state: {
		todoList: [
			{
				id: '001',
				name: '炫1个馒头',
				proccess: 10,
				done: false
			},
			{
				id: '002',
				name: '炫2个馒头',
				proccess: 40,
				done: false
			},
			{
				id: '003',
				name: '炫3个馒头',
				proccess: 50,
				done: false
			},
			{
				id: '004',
				name: '炫4个馒头',
				proccess: 100,
				done: true
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
		ADDPROCCESS(state, value: string) {
			for (let i = 0; i < state.todoList.length; i++) {
				if (state.todoList[i].id === value) {
					if (state.todoList[i].proccess !== 100) {
						state.todoList[i].proccess += 10;
					}
					if (state.todoList[i].proccess === 100) {
						state.todoList[i].done = true;
					}
					return;
				}
			}
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
		addProccess(context, value: string) {
			context.commit('ADDPROCCESS', value);
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
	}
};
