$(function(){
    setdsee();
    commitdata();
    descfun();
});

// 设置已登录状态
function setdsee(){
    html = "<a href='/info/' style='margin-right:35px;'>";
        html+= "<img src='/static/img/tx.jpg' style='border-radius:50%;\
        margin-top:17px'>";
    html += "</a>";

    $("#navright").html(html);
}

//上传数据
function commitdata(){
    $('#submit').click(function(){
        console.log('hello');
        // var files = e.target.files;

        var files = $('#fbutton').prop('files');
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
            try {
                var data = ev.target.result,
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    }), // 以二进制流方式读取得到整份excel表格对象
                    persons = []; // 存储获取到的数据
            } catch (e) {
                console.log('文件类型不正确');
                return;
            }

            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    console.log(fromTo);
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }

            console.log(persons);
            senddata = {
                'csrfmiddlewaretoken': $.cookie('csrftoken'),
                data:persons,
            }
            $.post('/dbexcel/excel/analysis',senddata,function(resp){
                json_data = JSON.parse(resp);
                console.log(resp, json_data);
            });
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
        
    });
}

// 描述信息的js,单选框的监控
function descfun(){
    $('#desc-form>input').change(function(){
        var select = $('input:radio:checked').val();
        var url = '/dbexcel/excel/?select='+select;
        $.get(url, function(resp){
            var data = JSON.parse(resp);
            console.log(data);
        });
    });

}