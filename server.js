//引入express框架
var express = require('express');
const webpack = require('webpack');
var archiver = require("archiver");
var zipper = require("zip-local");
const config = require('./webpack.config');
// const compiler = webpack(config);
var app = express();

//执行webpack编译
// complier.run((err, stats) => {
// 	console.log(stats.toJson());
// });

var bodyParser = require('body-parser');//用于req.body获取值的
//处理文件上传
var multiparty = require('multiparty');
let fs = require('fs');
let path = require('path');
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
app.use(express.static('static'));

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
      "totalN": 1,
      "setters": [
        {
          "totalN": 1,
          "index": 0,
          "width": 320,
          "height": 200,
          "x": 208,
          "y": 108,
          "pic": "http://127.0.0.1:8081/public/image/a.jpg",
          "vid": "",
          "color": "transparent",
          "content": "",
          "animeInfo": {
            "reveal": "Zoom",
            "setMarquee": false,
            "changingContentArr": [],
            "changingInterval": 0,
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
              "x": 208,
              "y": 108
            },
            "endXY": {
              "x": 0,
              "y": 0
            },
            "deltaX": null,
            "deltaY": null,
            "startSize": {
              "width": 320,
              "height": 200
            },
            "endSize": {
              "width": 0,
              "height": 0
            },
            "deltaWidth": null,
            "deltaHeight": null,
            "hasScrollEffect": false
          }
        }
      ]
    }
  };

//setter的信息 , 返回假数据
app.get('/setterInfo/:id', function(req, res){
    //获取项目id
    const projectId = req.params.id;
    //TODO：使用项目id从数据库项目表中的setterInfo字段读出字符串类型的数据setterInfo赋给setting.setterInfo
    //setting.setterInfo = 读出字符串转换为json格式


    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(setting.setterInfo))
});

//前端上传用于给preview显示的layoutSetter信息
app.post('/setterInfo/:id', function(req, res){
  //获取项目id
  const projectId = req.params.id;
  //TODO：使用项目id将字符串类型的数据setterInfo存入数据库项目表中对应id的setterInfo字段

  //demo
  console.log("setterInfo - post - req.body.totalN = " + req.body.totalN);
  //虽然在前端进行过json文件的字符串化，但是后端接到的是json格式而非字符串格式
  setting.setterInfo = req.body;
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
    //canvasInfo.canvasInfo = 读出字符串转换为json格式

    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(canvasInfo.canvasInfo))
});

//前端上传全局跟随信息
app.post('/canvasInfo/:id', function(req, res){
  //获取项目id
  const projectId = req.params.id;
  //TODO：使用项目id将字符串类型的数据setterInfo存入数据库项目表中对应id的setterInfo字段

  //demo
  console.log("canvasInfo - post - req.body = " + req.body);
  canvasInfo.canvasInfo = req.body
})

var canvasLenght = {
    "canvasLength": {
    "canvasHeight": 712
    }
  };

//canvasLength的信息 , 返回假数据
app.get('/canvasLength/:id', function(req, res){
    //获取项目id
    const projectId = req.params.id;
    //TODO：使用项目id从数据库项目表中的canvasLength字段读出字符串类型的数据canvasLength赋给 canvasLength.canvasLength
    //canvasLength.canvasLength = 读出字符串转换为json格式

    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(canvasLenght.canvasLength))
})

//canvasLength的信息 , 返回假数据
app.post('/canvasLength/:id', function(req, res){
  //获取项目id
  const projectId = req.params.id;
  //TODO：使用项目id将字符串类型的数据canvasLength存入数据库项目表中对应id的 canvasLength 字段

  //demo
  console.log("canvasLength - post - req.body = " + req.body);
  canvasLength.canvasLength = req.body
})

var webcanvasInfo = {
  "webcanvasInfo": {
    "LayoutSetterArray": [
      1,
      1,
      1
    ],
    "setterColorArray": [
      {
        "r": 245,
        "g": 166,
        "b": 35,
        "a": 1
      },
      {
        "r": 74,
        "g": 144,
        "b": 226,
        "a": 1
      },
      "transparent"
    ],
    "setterContentArray": [],
    "setterPicArray": [
      "",
      "",
      "http://127.0.0.1:8081/public/image/tokyo.jpg"
    ],
    "setterVidArray": [
      "",
      "",
      ""
    ],
    "setterAniInfoArray": [
      {
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
      },
      {
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
      },
      {
        "reveal": "",
        "setMarquee": false,
        "changingContentArr": [],
        "changingInterval": 0,
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
          "x": 0,
          "y": 0
        },
        "endXY": {
          "x": -1,
          "y": -1
        },
        "deltaX": 0,
        "deltaY": 0,
        "startSize": {
          "width": 0,
          "height": 0
        },
        "endSize": {
          "width": -1,
          "height": -1
        },
        "deltaWidth": 0,
        "deltaHeight": 0,
        "hasScrollEffect": false
      }
    ],
    "setterPosSizeArray": [
      {
        "x": 175,
        "y": 366,
        "width": 320,
        "height": 200
      },
      {
        "x": 385,
        "y": 119,
        "width": 320,
        "height": 200
      },
      {
        "x": 775,
        "y": 77,
        "width": 320,
        "height": 200
      }
    ]
  }
}

//webcanvasInfo 的信息 , 返回假数据
app.get('/webcanvasInfo/:id', function(req, res){
  //获取项目id
  const projectId = req.params.id;
  //TODO：使用项目id从数据库项目表中的 webcanvasInfo 字段读出字符串类型的数据 webcanvasInfo 赋给 webcanvasInfo.webcanvasInfo
  //webcanvasInfo.webcanvasInfo = 读出字符串转换为json格式

  res.writeHead(200, {'content-type': 'application/json'});
  res.end(JSON.stringify(webcanvasInfo.webcanvasInfo))
})

//webcanvasInfo 的信息 , 返回假数据
app.post('/webcanvasInfo/:id', function(req, res){
//获取项目id
const projectId = req.params.id;
//TODO：使用项目id将字符串类型的数据canvasLength存入数据库项目表中对应id的 canvasLength 字段

//demo
console.log("webcanvasInfo - post - req.body = " + req.body);
webcanvasInfo.webcanvasInfo = req.body
})


var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
