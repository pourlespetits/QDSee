$(function(){
    check_oldpwd();
    confirm_pwd();
    
})
//　验证旧密码
function check_oldpwd(){

    var $oldpwd = $("#oldpwd");
    $oldpwd.blur(function(){
        if ($oldpwd.val().length == 0) {
            $("#hint").html("密码不能为空");
            $("#hint").css('color', 'red');
            return
        }
        var data = {
            "csrfmiddlewaretoken": $.cookie("csrftoken"),
            "oldpwd": $oldpwd.val(),
            "uphone": $.cookie('uphone')
        };
        // console.log($.cookie('uphone'));
        $.post('/check_oldpwd/',data,function(resd){
            $("#hint").html(resd.resText);
            if (resd.status == 1) {
                // 密码正确，字体颜色设置为绿色
                $("#hint").css("color",'green');
            }else{
                // 密码错误，字体颜色设置为红色
                $("#hint").css("color",'red');
                $("#subtn").attr("disabled","false");
            }
        },'json');
    });    
}   

// 确认密码是否一致
function confirm_pwd(){
    $("#confpwd").keyup(function(){
       if ($('#newpwd').val() == $("#confpwd").val()) {
            // console.log("密码一致");
            $("#pwderr").html("");
            $("#subtn").removeAttr('disabled');
            // 保存密码
            save_pwd();
        }else{
            // console.log("密码不一致")
            $("#pwderr").html("密码不一致");
            $("#subtn").attr("disabled","false");
            
        } 
    });
    
}

// 保存密码
function save_pwd(){
    var pwd = entities($("#newpwd").val());
    $("#subtn").click(function(){
        // console.log('已执行');
        dic = {
            'csrfmiddlewaretoken': $.cookie("csrftoken"),
            'newpwd': pwd,
            'uphone': $.cookie("uphone"),
        }
        $.post('/setpwd/',dic,function(data){
            if (data == 'ok') {
                alert("保存成功");
                window.location.href="/info/";
            }else{
                alert("保存失败");
            }
        },'text');

    });
}

//将用户名/密码和确认密码中的特殊符号替换为对应的html实体，
//以防止SQL注入的产生
function entities(str){
   //这条语句必须放在第一个
   str.replace(/&/g, '&amp;');
   str.replace(/'/g, '&#39;');
   str.replace(/"/g, '&quot;');
   str.replace(/>/g, '&gt;');
   str.replace(/</g, '&lt;');
   str.replace(/ /g, '&nbsp;');
   return str;
}