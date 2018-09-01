$(function(){
	check_login();
});

// 验证是否已登录
function check_login(){
	$.get('/check_login/',function(data){
		var html = '';
		console.log(data.lgStatus);
		if (data.lgStatus == 1) {
			// 已登录
			html = "<a href='/info/' style='margin-right:35px;'>";
				html+= "<img src='/static/img/tx.jpg' style='border-radius:50%;\
				margin-top:17px'>";
			html += "</a>";
			// 改变立即使用的url
			$("#floor_excel>div>a").attr('href','/analizy/exc_analizy/?status=1');
			$("#floor_db>div>a").attr('href','/analizy/db_analizy/?status=1');
			
		}else{
			html = "<a href='/login/' \
			style='margin-right:5px;'>登录</a>";
			html += "|<a href='/register/' \
			style='margin-right:35px'>注册</a>";
			$('#floor_db>div>a').click(function(){
				alert('请先登录')
			});
			$('#floor_excel>div>a').click(function(){
				alert('请先登录')
			});
		}
		$("#navright").html(html);
	},'json');
}

function focusImage(current){
	var imgEle = document.getElementById('focus-img');
	var imgList = imgEle.getElementsByTagName('li');
	var textEle = document.getElementById('focus-text');
	var textList = textEle.getElementsByTagName('li');
	for(var i=0;i<imgList.length;i++){
		if(current == i){
			textList[i].style = 'background:#900;\
          color: #fff;';
			imgList[i].style.display = 'block';
			continue;
		}else{
			imgList[i].style.display = 'none';
			textList[i].removeAttribute('style');
		}

	}
}
//设置点击事件
function setclick(){
	$('#floor_db>div').click(function(){

	});
}

