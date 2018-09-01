$(function(){
    check_login();
    setbtnclick();
});

// 验证是否已登录
function check_login(){
    $.get('/check_login/',function(data){
        var html = '';
        // console.log(data.lgStatus);
        if (data.lgStatus == 1) {
            // 已登录
            html = "<a href='/info/' style='margin-right:35px;'>";
                html+= "<img src='/static/img/tx.jpg' style='border-radius:50%;\
                '>";
            html += "</a>";
            var $a = $('div[class="nav"] a');
            // console.log($a[0]); 
            $("#excel").attr("href","/analizy/exc_analizy/");
            $("#db").attr('href', '/analizy/db_analizy/')
        }else{
            html = "<a href='/login/' \
            style='margin-right:5px;'>登录</a>";
            html += "｜<a href='/register/' \
            style='margin-right:35px'>注册</a>";
        }
        $("#navright").html(html);
    },'json');
}

// 设置上传按钮的点击事件
function setbtnclick(){
    //上传文件的点击事件
    $("#submit").click(function(){
        getfileor_text();
    });
    //生成词云按钮的点击事件
    $("#startaly").click(function(){
        getfileor_text();
    });
    // 样式选择的点击事件
    $("#content ul>#1").click(function(){
        console.log(1);
        getfileor_text(1);
    });
    $("#content ul>#2").click(function(){
        console.log(2);
        getfileor_text(2);
    });
    $("#content ul>#3").click(function(){
        console.log(3);
        getfileor_text(3);
    });
    $("#content ul>#4").click(function(){
        console.log(4);
        getfileor_text(4);
    });
    $("#wordfreq>button").click(function(){
        getfileor_text(3,1);
    });
}

function getfileor_text(shape=3,analy_word=0){
    //获取上传的文本数据
    var reader = new FileReader();
    //获取到文件列表
    var files = $('#fbutton').prop('files');
    // 获取文本内容
    var $longtext = $("#longtext").val();
    // console.log($longtext);
    if ($longtext.length != 0) {
        if ($longtext.length<50) {
            alert("字数太少");
        }
        data = {
            'csrfmiddlewaretoken': $.cookie('csrftoken'),
            'file': $longtext,
            'shape':shape,
            'analy_word':analy_word,
        }
        $.post('/wordcloud/',data,function(resp){
            $("#wcloud>img").attr('src', resp.pic_url);
        },'json');
    }else if (files.length != 0){
        //读取文件
        reader.readAsText(files[0], "UTF-8");
        //读取完文件之后会回来这里
        reader.onload = function(evt){ 
            file =  evt.target.result; // 读取文件内容
            data = {
                'csrfmiddlewaretoken': $.cookie('csrftoken'),
                'file': file,
                'shape':shape,
                'analy_word':analy_word,
            }
            $.post('/wordcloud/',data,function(resp){
                // console.log(resp.pic_url);
                $("#wcloud>img").attr('src', resp.pic_url);
            },'json');
        }
    }else{
        alert("请选择文件或输入长文本");
    }
}

