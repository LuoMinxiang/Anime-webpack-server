import React from 'react'

//预览界面

class Preview extends React.Component{
    constructor(props){
        super(props);
        this.state = {"totalSetter":5,"setters":[{"index":0,"width":100,"height":200,"x":100,"y":200,"color":"rgba(255,0,0,1)","content":"<h1 style='text-align:center;'>hello world</h1>"},{"index":1,"width":500,"height":200,"x":50,"y":380,"color":"rgba(240,16,2,1)","content":"<p style='text-align:center;'>hello world</p>"},{"index":2,"width":150,"height":20,"x":150,"y":400,"color":"rgba(0,77,6,0.5)","content":"<h2>2020.10.7</h2>"},{"index":3,"width":600,"height":80,"x":370,"y":280,"color":"rgba(15,38,64,1)","content":"<h2 style=\"text-align: center;\">\n\t\t\tTinyMCE provides a <span style=\"text-decoration: underline;\">full-featured</span> rich text editing experience, and a featherweight download.\n\t\t  </h2>\n\t\t  <p style=\"text-align: center;\">\n\t\t\t<strong><span style=\"font-size: 14pt;\"><span style=\"color: #7e8c8d; font-weight: 600;\">No matter what you're building, TinyMCE has got you covered.</span></span></strong>\n\t\t  </p>"},{"index":4,"width":200,"height":100,"x":200,"y":100,"color":"rgba(5,255,44,1)","content":"<h4 style='text-align:center;'>Nice to meet you!</h4>"}],"wrate":1.46484375};
    }
    
    componentDidMount(){
        //当预览窗口改变时，按比例改变setter的位置和大小
        window.onresize = function(){
            //画布宽为1024
            let wcanvas = 1024;
            let wwidth = document.body.clientWidth;
            this.setState({wrate : wwidth / wcanvas});
        }.bind(this)
            //初始化预览窗口和画布的宽度比
            let wcanvas = 1024;
            let wwidth = document.body.clientWidth;
            this.setState({wrate : wwidth / wcanvas});
        
        //向后端发出请求，请求所有setter的信息
        /*
        fetch('http://127.0.0.1:8081/setterInfo')
        .then(res => res.json())
        .then(data => {
            console.log(data["totalN"]);
            this.setState({
                totalSetter: data["totalN"],
                setters : data["setters"]
            })
        })
     .catch(e => console.log('错误:', e))
     */
    }
    render(){
        //所有setter的样式数组
        const divStyles = [];
        //使用从后端得到的数据设置所有setter的样式
        for(let i = 0;i < this.state.totalSetter;i++){
            const setter = this.state.setters[i];
            console.log(setter.index);
            const setterStyle = {         
                width: setter.width * this.state.wrate,
                height: setter.height * this.state.wrate,
                left: setter.x * this.state.wrate,
                top: setter.y * this.state.wrate,
                background: setter.color,
                position : "absolute",
                display : "flex",
                flexDirection: 'column',
                justifyContent:'center',
        };
        divStyles.push(setterStyle);
    }
        return (
            //按样式动态生成setter
            <div>
            {this.state.setters.map((item,index) => item === undefined?null:
                <div style={divStyles[index]} dangerouslySetInnerHTML={{__html:this.state.setters[index].content}}></div>)
            }
            </div>
        );
    }
}
export default Preview;