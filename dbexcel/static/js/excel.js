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
                    // console.log(fromTo);
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }

            // console.log(persons);
            var senddata = {
                'csrfmiddlewaretoken': $.cookie('csrftoken'),
                'data':JSON.stringify(persons),
            };
            // console.log(senddata);
            $.post('/dbexcel/analysis/',senddata,function(resp){
                
                // 绘制echarts
                var series = [];
                resp.data.forEach(function(item, subscript){
                    var items = {
                        name:resp.index[subscript],
                        type:'bar',
                        stack:'总量',
                        itemStyle : { 
                            normal: {
                                label : {
                                    show: true, 
                                    position: 'insideRight',
                                    formatter:function(params){
                                        // console.log(params);
                                        return params.data.toFixed(1);
                                    }
                            }},
                            emphasis:{
                                barBorderRadius:[0,5,5,0]
                            }
                        },
                        data:item,
                    };
                    series.push(items);
                });
                // console.log(series);
                var chart = echarts.init(document.getElementById('f1-right'));
                var option = {
                    title:{text:'描述性统计信息',textStyle:{color:'yellow',fontSize:20}},
                    legend:{show:true},
                    tooltip:{
                        show:true,
                        trigger:'axis',
                        axisPointer:{
                            type:'shadow'
                        },
                        formatter: function(param){
                            // console.log(param);
                            var res = '<h3>'+param[0].name+'</h3>';
                            param.forEach(function(obj, index){
                                res +=obj.seriesName+':'+obj.value.toFixed(2)+'<br/>';
                            });
                            return res;
                        },  
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    backgroundColor:"#111a27",
                    xAxis:[{
                        type:'value',
                        data:resp.index,
                        axisLine: {
                            lineStyle:{
                                color:'yellow',
                                width:1
                            }
                        }
                    }],
                    yAxis:[{
                        type:'category',
                        data:resp.columns,
                        axisLine: {
                            lineStyle:{
                                color:'yellow',
                                width:1
                            }
                        }
                    }],
                    series:series
                };
                chart.setOption(option);
            },'json');
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
        
    });
}

// 描述信息的js,单选框的监控
function descfun(){
    $('#desc-form>input').change(function(){
        var select = $('input:radio:checked').val();
        var url = '/dbexcel/option/?select='+select;
        $.get(url, function(resp){
            // var data = JSON.parse(resp);
            console.log(resp);
            var chart1 = echarts.init(document.getElementById('f1-right'));
            var option1 = {
                title:{text:select,textStyle:{color:'yellow',fontSize:24}},
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                tooltip:{
                    show:true,
                    trigger:'axis',
                    axisPointer:{
                        type:'shadow'
                    },
                    formatter: function(param){
                        // console.log(param);
                        var res = '<h3>'+param[0].name+'</h3>';
                        param.forEach(function(obj, index){
                            res +=obj.axisValue+':'+obj.value.toFixed(2)+'<br/>';
                        });
                        return res;
                    },  
                },
                backgroundColor:"#111a27",
                xAxis:[{
                    type:'category',
                    data:resp.index,
                    axisLine: {
                        lineStyle:{
                            color:'yellow',
                            width:1
                        }
                    },
                    axisLabel:{
                        interval:0,
                        rotate:40,
                    }
                }],
                yAxis:[{
                    type:'value',
                    axisLine: {
                        lineStyle:{
                            color:'yellow',
                            width:1
                        }
                    }
                }],
                series:[{
                    type:'bar',
                    data:resp.values,
                    itemStyle:{
                        normal:{
                            label:{show:true,
                                position:'top',
                                formatter:function(obj){
                                    // console.log(obj);
                                    return obj.value.toFixed(2);
                                }
                            }
                        }
                    }
                }]
            };  
            chart1.setOption(option1, true);
        },'json');
    });


}