
$(function(){
    $("#setinfo").css({
        "background":'#3497db',
        "color":'white',
    });
    setclick();


});


//设置按钮的点击事件
function setclick(){
    // 设置个人信息按钮的点击事件
    var $aclick = $("a[data-parent='#accordion]'");
    $aclick.click(function(){
        $aclick.css('text-decoration', 'none');
    });
    // 设置修改个人信息的点击事件
    var $setinfo = $("#setinfo");
    $setinfo.click(function(){
        $.get('/getinfo/',function(data){
            // $("#uphone").val($.cookie('uphone'));
            $("#setinfo").css({
                "background":'#3497db',
                "color":'white',
            });
            $("#setpwd").css({
                "background":'#F5F5F5',
                "color":'#868686',
            });
            $("#contright").html(data);
        },'html');
    });
    //设置修改密码的点击事件
    $("#setpwd").click(function(){
        $.get('/setpwd/',function(data){
            $("#contright").html(data);
            $("#setpwd").css({
                "background":'#3497DB',
                "color":'white',
            });
            $("#setinfo").css({
                "background":'#F5F5F5',
                "color":'#868686',
            });
        },'html');
    });
}