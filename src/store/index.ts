import { createStore } from 'vuex';
import oneDay from '@/store/modules/oneDay.store';
import importantItem from '@/store/modules/importantItem.store';
import task from '@/store/modules/task.store';
import plan from '@/store/modules/plan.store';
import user from '@/store/modules/user.store';

export default createStore({
	modules: {
		oneDay,
		importantItem,
		task,
		plan,
		user
	}
});
