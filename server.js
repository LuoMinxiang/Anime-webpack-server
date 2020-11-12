//引入express框架
var express = require('express');
const webpack = require('webpack');
var archiver = require("archiver");
var zipper = require("zip-local");
const config = require('./webpack.config');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'anime'
});

connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
var app = express();


const router = require('./login')
const registerService = require('./register')
app.use('/', router)
app.use('/register', registerService)

// const compiler = webpack(config);


//执行webpack编译
// complier.run((err, stats) => {
// 	console.log(stats.toJson());
// });

app.post('/register', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  let data='';
  console.log('接收到注册请求');
  //接收数据
  req.on('data',function(chunk){
      data+=chunk;
  });
  //接受完毕
  req.on('end',function(){
      // console.log('数据接收完毕:',data);
      //username=jay&age=22&addr=newyork
      var arr=data.split('&');
      let UserID,Password;//保存前端传递来的数据
      arr.forEach(function(item){
          let arr0=item.split('=');
          if(arr0[0]=='UserID'){
              UserID=arr0[1];
          }else if(arr0[0]=='Password'){
              Password=arr0[1];
          }
      });
      console.log(UserID,Password);
      //将数据存入数据库
      saveData(UserID,Password,function(msg){
          res.write(JSON.stringify(msg));
          res.end(JSON.stringify({
            UserID : UserID
          }));
      });
  });
})

//将数据存入数据库
function saveData(UserID, Password,fn){
  /*
  //1.创建链接
  let conn=mysql.createConnection({
      host:'localhost',             //主机名
      user:"root",                  //数据库账户名
      password:"root",              //数据库密码
      database:"anime"              //要连接的数据名称
  });
  //2.建立链接
  conn.connect();
  */

  // let sql="SELECT * FROM student;";;
  let sql=`insert into User (UserID,Password) values ('${UserID}', '${Password}');`;
  //3.操作 (增/删/改/查)insert into 用户信息表 (UserID, Password) values ('${UserID}','${Password}');`
  //参数一：sql语句  参数二:回调函数
  connection.query(sql,function(err,result){
      if(!err){
          console.log('数据库访问成功：',result);
          fn({code:200,msg:"注册成功"});
          //res.end('OK');
      }else{
          console.log('数据库访问失败：',err);
          res.end('NO');
      }
  });
  //4.断开链接
  //connection.end();
}

app.post('/create', function(req, res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader('Content-type',"text/json;charset=utf8");
  let data='';
  console.log('接收到请求');
//将数据存入数据库


  //let sql=`select * from 用户信息表 where UserID='${UserID}' and Password='${Password}';`;
  var sql = 'select * from Project;';
  var str = " ";

  connection.query(sql,function(err,result){
      if(!err){
          str = JSON.stringify(result);
        console.log(result); //数据库查询结果返回到result中
console.log(str);
          res.end(str);
          
      }
      else{
          console.log(err);
      }
  });

  //connection.end(); 
})

app.post('/creatework', function(req, res){
  res.setHeader("Access-Control-Allow-Origin","*");
    let data='';
    console.log('接收到创建请求');
    //接收数据
    req.on('data',function(chunk){
        data+=chunk;
    });
    //接受完毕
    req.on('end',function(){
        // console.log('数据接收完毕:',data);
        //username=jay&age=22&addr=newyork
        var arr=data.split('&');
        let ProName;//保存前端传递来的数据
        arr.forEach(function(item){
            let arr0=item.split('=');
            if(arr0[0]=='ProName'){
                ProName=arr0[1];
            }
        });
        console.log(ProName);
        //将数据存入数据库
        saveWorkData(ProName,function(msg){
            res.write(JSON.stringify(msg));
            res.end();
        });
    });
})


//将数据存入数据库
function saveWorkData(ProName,fn){
  let sql = `insert into Project ( UserID,ProName ) values ('105@qq.com','${ProName}');`;
  
  //3.操作 (增/删/改/查)
  //参数一：sql语句  参数二:回调函数
  connection.query(sql,function(err,result){
      if(!err){
          console.log('数据库访问成功：', result);
          fn({code:200,msg:"创建成功"});
      }else{
          console.log('数据库访问失败：', err);
      }
  });
  //4.断开链接
  //conn.end();
}


var bodyParser = require('body-parser');//用于req.body获取值的
//处理文件上传
var multiparty = require('multiparty');
let fs = require('fs');
let path = require('path');
const { StayCurrentLandscapeRounded } = require('@material-ui/icons');
app.use(bodyParser.json());

// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false }));

//设置跨域访问
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

//设置查找静态文件的地方
app.use(express.static(path.join(__dirname, 'static')));

app.post('/public/image', function(req, res){
    console.log("img uploaded!!!");
    var form = new multiparty.Form({uploadDir: './public/image/'});
    form.parse(req, function(err, fields, files) {
        var inputFile = files.file[0];
        var uploadedPath = inputFile.path;
        var dstPath = './public/image/' + inputFile.originalFilename;
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function (err) {
            if (err) {
                console.log('rename error: ' + err);
                res.send(JSON.stringify({"fileName" : null}))
            } else {
                console.log('rename ok');
                //将文件路径存入数据库
                //将文件路径返回前端
                res.send(JSON.stringify({"fileName" : inputFile.originalFilename}))
            }
        });
        //res.send('upload success');
    });
})

app.post('/public/video', function(req, res){
    console.log("vid uploaded!!!");
    var form = new multiparty.Form({uploadDir: './public/video/'});
    form.parse(req, function(err, fields, files) {
        var inputFile = files.file[0];
        var uploadedPath = inputFile.path;
        var dstPath = './public/video/' + inputFile.originalFilename;
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function (err) {
            if (err) {
                console.log('rename error: ' + err);
                res.send(JSON.stringify({"fileName" : null}))
            } else {
                console.log('rename ok');
                //将文件路径存入数据库
                //将文件路径返回前端
                res.send(JSON.stringify({"fileName" : inputFile.originalFilename}))
            }
        });
    });
})

app.get('/public/image/*', function(req, res){
    const filename = req.url.split('/')[req.url.split('/').length-1];    
    const suffix = req.url.split('.')[req.url.split('.').length-1];   
    console.log("返回图片！！！")     
    res.writeHead(200, {'Content-Type': 'image/'+suffix});        
    res.end(get_file_content(path.join(__dirname, 'public', 'image', filename))); 
})

app.get('/public/video/*', function(req, res){
    const filename = req.url.split('/')[req.url.split('/').length-1];    
    const suffix = req.url.split('.')[req.url.split('.').length-1];   
    console.log("返回视频！！！");
        var file = path.resolve(__dirname,'public', 'video',  filename);
        fs.stat(file, function(err, stats) {
            if (err) {
            if (err.code === 'ENOENT') {
                // 404 Error if file not found
                return res.sendStatus(404);
            }
            res.end(err);
        }
        var range = req.headers.range;
        if (!range) {
            // 416 Wrong range
            return res.sendStatus(416);
        }
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = (end - start) + 1;
        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            'Content-Type': 'video/mp4',
            "Content-Length": chunksize,
            "Accept-Ranges": "bytes",
        });        
        var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
        stream.pipe(res);
        }).on("error", function(err) {
        res.end(err);
        });
})
});

function get_file_content(filepath){    
    return fs.readFileSync(filepath);
}

/****************************************************** 代码下载 *****************************************************/

//demo: 替换变量
const totalSetter = 2;
const setters = [
  {
    "totalN": 2,
    "index": 0,
    "width": 320,
    "height": 200,
    "x": 175,
    "y": 366,
    "pic": "",
    "vid": "",
    "color": {
      "r": 245,
      "g": 166,
      "b": 35,
      "a": 1
    },
    "content": "",
    "animeInfo": {
      "reveal": "",
      "setMarquee": false,
      "changingContentArr": [],
      "changingInterval": 0,
      "trailingContentArr": [
        {
          "name": "内容0",
          "activeKeyColor": {
            "r": 184,
            "g": 233,
            "b": 134,
            "a": 1
          },
          "activeKeyContent": "",
          "activeKeyPic": ""
        }
      ],
      "trailingInterval": 0,
      "trailerWidth": 100,
      "trailerHeight": 100,
      "hoverScalePicOnly": false,
      "hoverScale": 1,
      "hoverContentArr": [],
      "startScrollTop": 0,
      "endScrollTop": 0,
      "startXY": {
        "x": 175,
        "y": 366
      },
      "endXY": {
        "x": 375,
        "y": 566
      },
      "deltaX": null,
      "deltaY": null,
      "startSize": {
        "width": 320,
        "height": 200
      },
      "endSize": {
        "width": 320,
        "height": 200
      },
      "deltaWidth": null,
      "deltaHeight": null,
      "hasScrollEffect": false
    }
  },
  {
    "totalN": 2,
    "index": 1,
    "width": 320,
    "height": 200,
    "x": 385,
    "y": 119,
    "pic": "",
    "vid": "",
    "color": {
      "r": 74,
      "g": 144,
      "b": 226,
      "a": 1
    },
    "content": "",
    "animeInfo": {
      "reveal": "",
      "setMarquee": false,
      "changingContentArr": [
        {
          "name": "内容0",
          "activeKeyColor": {
            "r": 74,
            "g": 144,
            "b": 226,
            "a": 1
          },
          "activeKeyContent": "",
          "activeKeyPic": ""
        },
        {
          "name": "内容1",
          "activeKeyColor": {
            "r": 208,
            "g": 2,
            "b": 27,
            "a": 1
          },
          "activeKeyContent": "",
          "activeKeyPic": ""
        }
      ],
      "changingInterval": 7,
      "trailingContentArr": [],
      "trailingInterval": 0,
      "trailerWidth": 0,
      "trailerHeight": 0,
      "hoverScalePicOnly": false,
      "hoverScale": 1,
      "hoverContentArr": [],
      "startScrollTop": 0,
      "endScrollTop": 0,
      "startXY": {
        "x": 385,
        "y": 119
      },
      "endXY": {
        "x": 585,
        "y": 319
      },
      "deltaX": null,
      "deltaY": null,
      "startSize": {
        "width": 320,
        "height": 200
      },
      "endSize": {
        "width": 320,
        "height": 200
      },
      "deltaWidth": null,
      "deltaHeight": null,
      "hasScrollEffect": false
    }
  }
];

const downloadCanvasInfo = {
  "trailingContentArr": [],
  "trailingInterval": 0,
  "trailerWidth": 100,
  "trailerHeight": 100
};

const canvasHeight = 712;

//下载代码接口：传入项目id，下载做好网页的压缩包
app.get('/download', function(req, res){
  //前端传来的项目id
  projectId = req.query.id;
  //TODO：在数据库中根据项目id查询出项目的json数据：totalSetter，setters，canvasInfo，canvasHeight
  //其中totalSetter和setters从setterInfo字段的json字符串中拆分出
  //canvasInfo从canvasInfo字段中取出，canvasHeight从canvasHeight字段中取出
  
	// 1. 先做替换
  var data = fs.readFileSync("./src/Preview/Preview-template.js","utf-8");

	var result = data.replace(/__totalSetter__/g, JSON.stringify(totalSetter)).replace(/__setters__/g, JSON.stringify(setters)).replace(/__canvasInfo__/g, JSON.stringify(downloadCanvasInfo)).replace(/__canvasHeight__/g, JSON.stringify(canvasHeight));

	fs.writeFileSync("./src/Preview/Preview.js",result, "utf-8")

	// 2. 在node中直接使用webpack
	const complier = webpack(config);

	console.log('start to webpack preview')
	//执行webpack编译
	complier.run((err, stats) => {
		if (err) {
			console.log('webpack had err!!!')
			console.log(err);
			res.writeHead(200, {
				'Content-Type' : 'application/text',
			  })
			res.end('webpack failed')
			return;
		}
		console.log('webpack success!!!')

		var name = 'h5.zip'
		var path = './' + name
		
		zipper.sync.zip("./dist").compress().save(path);

		var size = fs.statSync(path).size;
		var f = fs.createReadStream(path);
	
		res.writeHead(200, {
			'Content-Type' : 'application/force-download',
			'Content-Disposition' : 'attachment; filename=' + name,
			'Content-Length' : size
		})
		f.pipe(res)
	});
})

// setter 假数据
var setting = {
    "setterInfo": {
      "totalN": 0,
      "setters": []
    }
  };

//setter的信息 , 返回假数据
app.get('/setterInfo/:id', function(req, res){
    //获取项目id
    const projectId = req.params.id;
    //使用项目id从数据库项目表中的setterInfo字段读出字符串类型的数据setterInfo赋给setting.setterInfo
    let sql=`select setterInfo from Project where ProID='${projectId}';`;
    connection.query(sql,function(err,result){
      if(!err){
          if(result.length !== 0){
          //有已保存的设计：返回查询结果
             setting.setterInfo = result[0];
          }
          console.log('setterInfo - get 数据库访问成功：',result);
          res.write(JSON.stringify({code:200,msg:"setterInfo成功"}));
          //res.end(JSON.stringify(setting.setterInfo))
          res.end(setting.setterInfo);
          //res.end('OK');
      }else{
          console.log('数据库访问失败：',err);
          res.end('NO');
      }
  });
    


    //res.writeHead(200, {'content-type': 'application/json'});
    //res.end(JSON.stringify(setting.setterInfo))
    //res.end(setting.setterInfo);
});

//前端上传用于给preview显示的layoutSetter信息
app.post('/setterInfo/:id', function(req, res){
  //获取项目id
  const projectId = req.params.id;
  const jsonString = JSON.stringify(req.body);
  //使用项目id将字符串类型的数据setterInfo存入数据库项目表中对应id的setterInfo字段
  let sql = `UPDATE Project SET setterInfo = '${jsonString}' WHERE ProID='${projectId}';`;
  //let sql=`select setterInfo from Project where ProID='${projectId}';`;
    connection.query(sql,function(err,result){
      if(!err){
          //setting.setterInfo = result;
          console.log('setterInfo - post 数据库访问成功：',result);
          res.write(JSON.stringify({code:200,msg:"setterInfo成功"}));
          //res.end('OK');
      }else{
          console.log('数据库访问失败：',err);
          res.end('NO');
      }
  });

  //demo
  console.log("setterInfo - post - req.body.totalN = " + req.body.totalN);
  //虽然在前端进行过json文件的字符串化，但是后端接到的是json格式而非字符串格式
  //setting.setterInfo = req.body;
})

var canvasInfo = {
    "canvasInfo": {
    "trailingContentArr": [],
    "trailingInterval": 0,
    "trailerWidth": 100,
    "trailerHeight": 100
    }
  };

//canvasInfo的信息 , 返回假数据
app.get('/canvasInfo/:id', function(req, res){
    //获取项目id
    const projectId = req.params.id;
    //TODO：使用项目id从数据库项目表中的canvasInfo字段读出字符串类型的数据canvasInfo赋给canvasInfo.canvasInfo
    let sql=`select canvasInfo from Project where ProID='${projectId}';`;
    connection.query(sql,function(err,result){
      if(!err){
        if(result.length !== 0){
          //有已保存的设计：返回查询结果
          canvasInfo.canvasInfo = result[0];
          }
          console.log('canvasInfo - get 数据库访问成功：',result);
          res.write(JSON.stringify({code:200,msg:"canvasInfo成功"}));
          res.end(JSON.stringify(canvasInfo.canvasInfo))
          //res.end('OK');
      }else{
          console.log('数据库访问失败：',err);
          res.end('NO');
      }
  });

    //canvasInfo.canvasInfo = 读出字符串转换为json格式

    //res.writeHead(200, {'content-type': 'application/json'});
    //res.end(JSON.stringify(canvasInfo.canvasInfo))
    //res.end(canvasInfo.canvasInfo);
});

//前端上传全局跟随信息
app.post('/canvasInfo/:id', function(req, res){
  //获取项目id
  const projectId = req.params.id;
  //TODO：使用项目id将字符串类型的数据canvasInfo存入数据库项目表中对应id的canvasInfo字段
  //let sql=`select canvasInfo from Project where ProID='${projectId}';`;
  const jsonString = JSON.stringify(req.body);
  let sql = `UPDATE Project SET canvasInfo = '${jsonString}' WHERE ProID='${projectId}';`;
    connection.query(sql,function(err,result){
      if(!err){
          canvasInfo.canvasInfo = result;
          console.log('canvasInfo - post 数据库访问成功：',result);
          res.write(JSON.stringify({code:200,msg:"canvasInfo成功"}));
          //res.end('OK');
      }else{
          console.log('数据库访问失败：',err);
          res.end('NO');
      }
  });


  //demo
  console.log("canvasInfo - post - req.body = " + req.body);
  //canvasInfo.canvasInfo = req.body
})

var canvasLength = {
    "canvasLength": {
    "canvasHeight": 712
    }
  };

//canvasLength的信息 , 返回假数据
app.get('/canvasLength/:id', function(req, res){
    //获取项目id
    const projectId = req.params.id;
    //使用项目id从数据库项目表中的canvasLength字段读出字符串类型的数据canvasLength赋给 canvasLength.canvasLength
    let sql=`select canvasLength from Project where ProID='${projectId}';`;
    connection.query(sql,function(err,result){
      if(!err){
        if(result.length !== 0){
          //有已保存的设计：返回查询结果
          canvasLength.canvasLength = result[0];
          }
          console.log('canvasLength - get 数据库访问成功：',result);
          res.write(JSON.stringify({code:200,msg:"canvasLength成功"}));
          res.end(JSON.stringify(canvasLenght.canvasLength))
          //res.end('OK');
      }else{
          console.log('数据库访问失败：',err);
          res.end('NO');
      }
  });
    //canvasLength.canvasLength = 读出字符串转换为json格式

    //res.writeHead(200, {'content-type': 'application/json'});
    //res.end(JSON.stringify(canvasLenght.canvasLength))
    //res.end(canvasLength.canvasLength);
})

//canvasLength的信息 , 返回假数据
app.post('/canvasLength/:id', function(req, res){
  //获取项目id
  const projectId = req.params.id;
  //TODO：使用项目id将字符串类型的数据canvasLength存入数据库项目表中对应id的 canvasLength 字段
  const jsonString = JSON.stringify(req.body);
  let sql = `UPDATE Project SET canvasInfo = '${jsonString}' WHERE ProID='${projectId}';`;
  //let sql=`select canvasLength from Project where ProID='${projectId}';`;
    connection.query(sql,function(err,result){
      if(!err){
          //setting.setterInfo = result;
          console.log('canvasLength - post 数据库访问成功：',result);
          res.write(JSON.stringify({code:200,msg:"canvasLength成功"}));
          //res.end('OK');
      }else{
          console.log('数据库访问失败：',err);
          res.end('NO');
      }
  });
  //demo
  console.log("canvasLength - post - req.body = " + req.body);
  //canvasLength.canvasLength = req.body
})

var webcanvasInfo = {
  "webcanvasInfo": {
    "LayoutSetterArray": [],
    "setterColorArray": [],
    "setterContentArray": [],
    "setterPicArray": [],
    "setterVidArray": [],
    "setterAniInfoArray": [],
    "setterPosSizeArray": []
  }
}

//webcanvasInfo 的信息 , 返回假数据
app.get('/webcanvasInfo/:id', function(req, res){
  //获取项目id
  const projectId = req.params.id;
  //TODO：使用项目id从数据库项目表中的 webcanvasInfo 字段读出字符串类型的数据 webcanvasInfo 赋给 webcanvasInfo.webcanvasInfo
  let sql=`select webcanvasInfo from Project where ProID='${projectId}';`;
    connection.query(sql,function(err,result){
      if(!err){
        if(result.length !== 0){
          //有已保存的设计：返回查询结果
          webcanvasInfo.webcanvasInfo = result[0];
          }
          console.log('webcanvasInfo - get 数据库访问成功：',result);
          //res.write(JSON.stringify({code:200,msg:"webcanvasInfo成功"}));
          res.writeHead(200, {'content-type': 'application/json'});
          res.end(JSON.stringify(webcanvasInfo.webcanvasInfo))
          //res.end('OK');
      }else{
          console.log('数据库访问失败：',err);
          res.end('NO');
      }
  });
  //webcanvasInfo.webcanvasInfo = 读出字符串转换为json格式

  //res.writeHead(200, {'content-type': 'application/json'});
  //res.end(JSON.stringify(webcanvasInfo.webcanvasInfo))
  //res.end(webcanvasInfo.webcanvasInfo);
})

//webcanvasInfo 的信息 , 返回假数据
app.post('/webcanvasInfo/:id', function(req, res){
//获取项目id
const projectId = req.params.id;
//TODO：使用项目id将字符串类型的数据canvasLength存入数据库项目表中对应id的 canvasLength 字段
//let sql=`select webcanvasInfo from Project where ProID='${projectId}';`;
const jsonString = JSON.stringify(req.body);
let sql = `UPDATE Project SET canvasInfo = '${jsonString}' WHERE ProID='${projectId}';`;
    connection.query(sql,function(err,result){
      if(!err){
          //setting.setterInfo = result;
          console.log('webcanvasInfo - post 数据库访问成功：',result);
          res.write(JSON.stringify({code:200,msg:"webcanvasInfo成功"}));
          //res.end('OK');
      }else{
          console.log('数据库访问失败：',err);
          res.end('NO');
      }
  });
//demo
console.log("webcanvasInfo - post - req.body = " + req.body);
//webcanvasInfo.webcanvasInfo = req.body
})


var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
