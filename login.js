let http=require('http');//导入http模块
let mysql=require('mysql');//导入mysql模块

const express = require('express');
const Router = express.Router();

Router.post('/login', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader('Content-type',"text/json;charset=utf8");
    let data='';
    console.log('接收到登录请求');
    //接收数据
    req.on('data',function(chunk){
        data+=chunk;
    });
    //接受完毕
    req.on('end',function(){
        // console.log('数据接收完毕:',data);
        //username=jay&age=22&addr=newyork
        var arr=data.split('&');
        let UserID, Password;//保存前端传递来的数据
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
        saveData(UserID, Password,function(msg){
            //res.write(JSON.stringify(msg));
            //res.end();
        });
    });
//将数据存入数据库
function saveData(UserID,Password,fn){
    //1.创建链接
    let conn=mysql.createConnection({
        host:'localhost',             //主机名
        user:"root",                  //数据库账户名
        password:"root",              //数据库密码
        database:"anime"              //要连接的数据名称
    });
    //2.建立链接
    conn.connect();


    let sql=`select * from User where UserID='${UserID}' and Password='${Password}';`;
  
    conn.query(sql,[UserID,Password],function(err,result){
        if(!err){
            if(result.length==0){
                //res.json(0);
               console.log("f!");
               res.end('NO');
              }else{
                //res.json(1)
                console.log("s!");
                res.end('OK');
              }
        }
        else{
            console.log(err);
        }
    });

    conn.end(); 
}
})

module.exports = Router