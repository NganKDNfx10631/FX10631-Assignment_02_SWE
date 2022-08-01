class EdxId {
	static getID() {
		if (window.location.pathname !== undefined) {
			const subId = window.location.pathname.split('/')[2];
			if (subId !== undefined) {
				const id = subId.split('@')[2];
				return id;
			}
		}
		return '';
	}
	static getIndex(domSelector, activeClass) {
		let list = $(domSelector);
		for (let i = 0; i < list.length; i++) {
			if ($(list[i]).hasClass(activeClass)) return i;
		}
		return -1;
	}
}
