$(function(){
    save_info();
})

function save_info(){
    $("#subtn").click(function(){
        var info={
            "csrfmiddlewaretoken":$.cookie("csrftoken"),
            "uphone":$("input[name='uphone']").val(),
            "uname":$("input[name='uname']").val(),
            "sex":$("input[name='sex']").val(),
            "uemail":$("input[name='uemail']").val(),
            "birthday":$("input[name='birthday']").val(),
            "navplace":$("input[name='navplace']").val(),
        }
        console.log(info);
        $.post('/perinfo/',info,function(data){
            if (data.status == 0) {
                alert(data.text);
            }else{
                window.location.reload();
            }
        },'json');
    });
}

