var tplEngine = require("./string-base-tpl.js")

var html = tplEngine("hi, my name is <% name %>, i am <% age %> years old.", {name: "toplan", age: "26"})
console.log(html)

var tplStr = '<% for(var i = 0; i < this.posts.length; i++) {' +　
    'var post = posts[i]; %>' +
    '<% if(!post.expert){ %>' +
        '<span>post is null</span>' +
    '<% } else { %>' +
        '<a href="#"><% post.expert %> at <% post.time %></a>' +
    '<% } %>' +
'<% } %>';
var tplData = {
    "posts": [
      {
        "expert": "content 1",
        "time": "yesterday"
      },
      {
        "expert": "content 2",
        "time": "today"
      },
      {
        "expert": "content 3",
        "time": "tomorrow"
      },
      {
        "expert": "",
        "time": "eee"
      }
    ]
};
var html2 = tplEngine(tplStr, tplData)
console.log(html2)
