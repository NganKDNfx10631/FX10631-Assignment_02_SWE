class EdxId {
   static getID(){
      let id = window.location.pathname.split("/")[5];
      let index = this.getIndex("#sequence-list > li > button", "active");
      return id + "?index=" + index;
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