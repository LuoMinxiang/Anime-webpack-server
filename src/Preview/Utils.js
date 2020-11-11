//TODO：按预览窗口宽度和画布宽度比例缩放字号大小

/**
 * <h2 style="text-align: center;">
  TinyMCE provides a <span style="text-decoration: underline;">full-featured</span> rich text editing experience, and a featherweight download.
</h2>
<p style="text-align: center;">
  <strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;">No matter what you're building, TinyMCE has got you covered.</span></span></strong>
</p>`
 */
function Utils(rate, htmlStr){
    //缩放系数rate
    //在字符串htmlStr中将<h2，<p等全部替换成<div
    //[\u0000-\u00ff]
    let divHtmlStr = htmlStr.replace(/<h2/g,'<div style="font-size: 24px"') //
                            .replace(/<\/h2/g,'</div')
                            .replace(/<p/g, '<div style="font-size: 18px"')
                            .replace(/<\/p/g,'</div')
    /**
     * 前面的style会完全覆盖后面的style
     * <div style="font-size: 24px" style="text-align: center;">TinyMCE provides a <span style="text-decoration: underline;">full-featured</span> rich text editing experience, and a featherweight download.</div><div style="font-size: 18px" style="text-align: center;"><strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;">No matter what you're building, TinyMCE has got you covered.</span></span></strong></div
     */
                            .replace(/<h2/g,"<div")
                            .replace(/<h3/g,"<div")
                            .replace(/<h4/g,"<div")
                            .replace(/<h5/g,"<div")
                            .replace(/<h6/g,"<div")
                            .replace(/<p/g,"<div");
}