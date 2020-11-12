let http=require('http');//导入http模块
let mysql = require('mysql');//导入mysql模块

//注册，链接数据库
http.createServer(function(req,res){
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
        saveData(ProName,function(msg){
            res.write(JSON.stringify(msg));
            res.end();
        });
    });

   
}).listen(9091
    );//监听端口号9030


console.log('服务器启动.......');

//将数据存入数据库
function saveData(ProName,fn){
    //1.创建链接
    let conn=mysql.createConnection({
        host:'localhost',             //主机名
        user:"root",                  //数据库账户名
        password:"root",              //数据库密码
        database:"anime"              //要连接的数据名称
    });
    
    //2.建立链接
    conn.connect();
    let sql = `insert into 项目信息表 ( UserID,ProName ) values ('self','${ProName}');`;
    
    //3.操作 (增/删/改/查)
    //参数一：sql语句  参数二:回调函数
    conn.query(sql,function(err,result){
        if(!err){
            console.log('数据库访问成功：', result);
            fn({code:200,msg:"创建成功"});
        }else{
            console.log('数据库访问失败：', err);
        }
    });
    //4.断开链接
    conn.end();
}
