let http=require('http');//导入http模块
let mysql=require('mysql');//导入mysql模块

//注册，链接数据库
http.createServer(function(req,res){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader('Content-type',"text/json;charset=utf8");
    let data='';
    console.log('接收到请求');
  
  console.log('服务器启动.......');

//将数据存入数据库

    
    //1.创建链接
    let conn=mysql.createConnection({
        host:'localhost',             //主机名
        user:"root",                  //数据库账户名
        password:"root",              //数据库密码
        database:"anime"              //要连接的数据名称
    });
    //2.建立链接
    conn.connect();


    //let sql=`select * from 用户信息表 where UserID='${UserID}' and Password='${Password}';`;
    var sql = 'select * from Project;';
    var str = " ";
 
    conn.query(sql,function(err,result){
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

    conn.end(); 
    //res.end();


    // res.write('hello world');
    
}).listen(9008);//监听端口号9008