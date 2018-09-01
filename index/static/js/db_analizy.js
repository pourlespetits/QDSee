$(function(){
    setdsee();
});

// 设置已登录状态
function setdsee(){
    html = "<a href='/info/' style='margin-right:35px;'>";
        html+= "<img src='/static/img/tx.jpg' style='border-radius:50%;\
        margin-top:17px'>";
    html += "</a>";

    $("#navright").html(html);
}