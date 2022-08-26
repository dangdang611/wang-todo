import { h } from 'vue';

export default class FormatDate {
	static toDate(timestamp: string | number): string {
		var newDate = new Date(timestamp);

		//在Date对象的原型上添加一个方法
		Date.prototype.format = function(format: string) {
			var date = {
				'M+': this.getMonth() + 1,
				'd+': this.getDate(),
				'h+': this.getHours(),
				'm+': this.getMinutes(),
				's+': this.getSeconds(),
				'q+': Math.floor((this.getMonth() + 3) / 3),
				'S+': this.getMilliseconds()
			};
			if (/(y+)/i.test(format)) {
				format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
			}
			for (var k in date) {
				if (new RegExp('(' + k + ')').test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
				}
			}
			return format;
		};

		return newDate.format('yyyy-MM-dd h:m');
	}

	static handlerDateDurationCurrent(time: string | number): number[] {
		let d1 = new Date(time);
		let d2 = new Date();

		let cha = d1.getTime() - d2.getTime();

		if (cha > 0) {
			let days = Math.floor(cha / (24 * 60 * 60 * 1000));
			let hours = Math.floor((cha % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
			let mins = Math.floor((cha % (60 * 60 * 1000)) / (60 * 1000));

			if (days) {
				return [days, hours, mins];
			} else if (hours) {
				return [0, hours, mins];
			} else {
				return [0, 0, mins];
			}
		}
		return [];
	}

	static getDaysChaToNow(overTime: string | number): number {
		let cha = this.handlerDateDurationCurrent(overTime);

		if (cha.length > 0) {
			console.log(`相差${cha[0]}天${cha[1]}小时${cha[2]}分钟`);

			//计算相差的天数
			cha[1] = cha[1] + (new Date().getMinutes() + cha[2] > 60 ? 1 : 0);
			cha[0] = cha[0] + (new Date().getHours() + cha[1] > 24 ? 1 : 0);

			console.log(`可以在${cha[0]}天完成`);
			return cha[0];
		} else {
			return -1;
		}
	}
}
