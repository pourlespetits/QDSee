$(function(){
    loadpage();
    load();
    
    
});

// 加载页面
function loadpage(){
    drawf1();

    drawf2();
    // url = '/dbexcel/load/';
    // $.get(url,function(resp){
    //     console.log(resp);
    //     resp.columns.forEach(function(key,index){
    //         var block = "<div id='block"+index+"'"+" class='block'>";
    //           block += "<h2 style='padding-top:18px;'>" + key + "</h2>";
    //           block += "<input type='text' name='"+key+"'>";
    //         block +="</div>";
    //         $('#contleft').append(block);
    //     });
    // },'json');
}
function drawf2() {
    url = '/dbexcel/get/descinfo/';
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
        var chart = echarts.init(document.getElementById('f2-right'));
        var option = {
            title:{text:'描述性统计信息',textStyle:{color:'yellow',fontSize:20}},
            legend:{show:true,
                x:'center',
                y:'bottom',
                textStyle:{color:'white'}},
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
}
function drawf1() {
    var select = $('input:radio:checked').val();
    // console.log('select:',select);
    var url = '/dbexcel/option/?select='+select;
    $.get(url, function(resp){
        // var data = JSON.parse(resp);
        // console.log(resp);
        var chart1 = echarts.init(document.getElementById('f1-right'));
        var option1 = {
            title:{text:select,textStyle:{color:'yellow',fontSize:24}},
            color:"#1858E5",
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
            dataZoom:[{
                startValue:0,
                endValue:8,
                
            },{type:'inside'}],
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
                    fontSize:14,
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
}
// 单选框的监控
function descfun(num){
    // 表单１
    $('#desc-form>input').change(function(){
        drawf1();
    });
    // console.log(num);
    num.forEach(function(tuple, index){
        if(tuple[1].length>10){
            var id = '#form-div'+index+'>input';
            var $formid = $(id);
        }else{
            var $formid = $('#form'+index+'>input');
        }
        $formid.change(function(){

            var value = $("input:radio[name='form"+index+"']:checked").val();
            // console.log('form'+index,value);
        });
    });
}
function load(){
    var form_num = 2;
    var url = '/dbexcel/loadleft/';
    $.ajaxSetup({async:false});
    $.get(url, function(resp){
        // console.log(resp);
        resp.forEach(function(value,index){
            var $leftparent = $('#contleft');
            var $rightparent = $('#contright');
            // 加载左界面
            var html = "<div id='lblock"+index+"' class='lblock'>";
            html += "<h2 style='padding-top:18px;margin-left:50px;'>"+value[0]+"</h2>";
            html +="<form style='padding-bottom:18px;' id='form"+index+"'>";
            if(value[1].length>10){
                html +="<div id='form-div"+index+"' style='height:380px;overflow-x:hidden;overflow-y:auto'>";
            }
            value[1].forEach(function(key,idx){
                html += "<input type='radio' name='form"+index+"'";
                if(idx==0){
                    html +=" checked='checked' id="+key;
                }else{
                    html +=" id="+key;
                }
                html +=" value="+key+"><label for="+key+">";
                html +=key+"</label><br>";
            });
            if (value[1].length>10) {
                html += "</div>";
            }
            html +="</form>";
            html +="</div>";
            $leftparent.append(html);
            // 加载右界面
            vl = value[1].length;
            html = '';
            if(vl<3){
                console.log('跳过');
            }else if (vl>=3&&vl<10) {
                html = "<div id='rblock"+index+"' style='margin-top:20px;'>";
                 html += "<div id='r"+index+"-1"+vl+"' class='img-block' ";
                    html+= "style='width:613px;height:370px;'></div>";
                 html += "<div id='r"+index+"-2"+vl+"' class='img-block' ";
                    html+= "style='width:425px;height:370px;'></div>";
                 html += "<div id='r"+index+"-3"+vl+"' class='img-block' ";
                    html+= "style='width:425px;height:370px;'></div>";
                 html += "<div style='clear:both'></div>";
                html += "</div>";
            }else{
                html = "<div id='rblock"+index+"' style='margin-top:20px;'>";
                 html += "<div id='r"+index+"-1"+vl+"' class='img-block' ";
                    html+= "style='width:906px;'></div>";
                 html += "<div id='r"+index+"-2"+vl+"' class='img-block' ";
                    html+= "style='width:576px;'></div>";
                 html += "<div style='clear:both'></div>";
                html += "</div>";
            }
            $rightparent.append(html);
            form_num = resp;
        });
    },'json');
    // console.log(form_num);
    descfun(form_num);
}
