var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

//console.log(Object.keys(http))
if(!port){
  console.log('请指定端口号好不好? \nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var temp = url.parse(request.url, true)
  var path = temp.pathname
  var query = temp.query
  var method = request.method

  //从这里开始看，上面不要看

  if(path === '/'){  // 如果用户请求的是 / 路径
    var string = fs.readFileSync('./index.html', 'utf8')
    var amount = fs.readFileSync('./db','utf-8')
    string = string.replace('&&amount&&',amount)
    response.setHeader('Content-Type', 'text/html;charset=utf-8')  
    response.write(string)
    response.end()  
  }else if(path === '/style.css'){   
    var string = fs.readFileSync('./style.css', 'utf8')
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/main.js'){  
    var string = fs.readFileSync('./main.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/pay'){  
    var amount = fs.readFileSync('./db','utf8')
    var newAmount = amount - 1
    /* if(Math.random()>0.5){ */
      fs.writeFileSync('./db',newAmount)
      response.statusCode = 200
      response.setHeader('Content-Type', 'application/javascript') 
      response.write(`
        ${query.callbackName}.call(undefined,'success')
      `)     
/*     }else{
      response.statusCode = 400
      response.write('fail')
    }*/
    response.end() 
  }else{
    response.statusCode = 400
    response.setHeader('Cotent-Type','text/html;charset=utf-8')
    response.write('找不到对应的路径！')
    response.end()
  }

  // 代码结束，下面不要看
  console.log(method + ' ' + request.url)
})

server.listen(port)
console.log('监听 ' + port + ' 成功，请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)