// 异步请求判断手机号是否存在
$(function(){
   check_phone();
});


// 验证手机号是否已注册
function check_phone(){
   $("#unum").blur(function(){
      // 获取用户输入的手机号
      var data = 'uphone='+$('#unum').val();
      console.log(data);
      // 发送异步请求
      $.get('/index/check_phone/',data,function(resText){
         $("#unumber>span").html(resText)
         if (resText.length<=4) {
            $("#unumber>span").css('color', 'green');
         }else{
            $("#unumber>span").css('color', 'red');
         }
      });
   });
}

// 验证注册信息
function validateForm(){
   //获取input对象
   var unumber = document.getElementById('unum');
   var unumberVal = entities(unumber.value);
   var upwd = document.getElementById('upwd');
   var upwdVal = entities(upwd.value);
   var upwd2 = document.getElementById('upwd2');
   var upwd2Val = entities(upwd2.value);
   // window.alert('账号不能为空');
   if(unumberVal.length == 0){
      window.alert('手机号不能为空');
      unumber.focus();
      return false;
   }

   if (upwdVal.length == 0) {
      window.alert('密码不能为空');
      upwd.focus();
      return false;
   }else if (upwdVal.length < 6) {
      window.alert("密码过于简单");
      //让用户名文本框获取焦点
      upwd.focus();
      // 让提交按钮失效
      return false;
   }

   if (upwd2Val != upwdVal) {
      window.alert("密码不一致");
      upwd2.focus();
      return false;
   }
   var regEle = document.getElementById('register');
   var protoEle = document.getElementById('proto');
   if (protoEle.checked){
      console.log("按键已启用");
      regEle.disabled = false;
      return true;
   }else{
      console.log("按键已禁用");
      return false;
   }

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