class MarkdownReader {
   constructor(src, selector) {
         this.src = src;
         this.container = $(selector);
   }
   async readContentFile()
   {
      const url = chrome.runtime.getURL(this.src);
      let content = "";
      await $.get(url).then(res => {
         content = res;
      });
      return content;
   }
   async init()
   {
      let content = "";
      await this.readContentFile()
      .then(res => {
         content = res;
      });
      // Render markdown to html
      let converter = new showdown.Converter();
      let html = converter.makeHtml(content);
      // Render to page
      this.container.html(html);
   }
}

