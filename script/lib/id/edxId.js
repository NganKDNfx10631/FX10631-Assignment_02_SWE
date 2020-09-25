class EdxId {
   static getID(){
		const id = window.location.pathname.split("/")[2].split("@")[2];
      return id;
   }
   static getIndex(domSelector, activeClass) {
		let list = $(domSelector);
	   for(let i = 0; i < list.length; i++)
	   {
	      if($(list[i]).hasClass(activeClass)) return i;
	   }
	   return -1;
	}
}
