$(function(){
    loadpage();
    descfun();
});

// 加载页面
function loadpage(){
    url = '/dbexcel/get/descinfo/'
    $.get(url,function(resp){
        // 绘制echarts
        var series = [];
        resp.data.forEach(function(item, subscript){
            var items = {
                name:resp.index[subscript],
                type:'bar',
                stack:'总量',
                data:item,
                itemStyle : { 
                    normal: {
                        label : {
                            show: true, 
                            position: 'insideRight',
                            formatter:function(params){
                                // console.log(params);
                                return params.data.toFixed(1);
                            }
                        },
                },
                },
                emphasis:{label:{
                    barBorderRadius:[0,5,5,0]}},
                
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

    url = '/dbexcel/load/';
    $.get(url,function(resp){
        console.log(resp);
        resp.columns.forEach(function(key,index){
            var block = "<div id='block"+index+"'"+" class='block'>";
              block += "<h2 style='padding-top:18px;'>" + key + "</h2>";
              block += "<input type='text' name='"+key+"'>";
            block +="</div>";
            $('#contleft').append(block);
        });
    },'json');
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

function mybar(xlabel,ylabel=false){

}
