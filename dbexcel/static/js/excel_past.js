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
// 横向柱状图
function drawhbar(element_id,xdata,ydata,series,title='test'){
    var chart = echarts.init(document.getElementById(element_id));
    var option = {
        title:{text:title,textStyle:{color:'yellow',fontSize:24}},
        legend:{
            show:true,
            // top:'center',
            // data:['平均值','标准差','最大值','最小值'],
            textStyle:{color:'white'}
        },
        tooltip:{
            show:true,
            trigger:'axis',
            axisPointer:{show:'shadow'},formatter: function(param){
            // console.log(param);
            var res = '<h3>'+param[0].name+'</h3>';
            param.forEach(function(obj, index){
                res +=obj.seriesName+':'+obj.value.toFixed(2)+'<br/>';
            });
            return res;
        },
        },
        toolbox:{
            show:true,
            feature:{
                dataView:{show:true},
                restore:{show:true},
                saveAsImage:{show:true},
            }
        },
        xAxis:{
            type:'value',
            axisLine:{
                lineStyle:{color:'yellow',width:1}
            },
        },
        yAxis:{
            type:'category',
            data:ydata,
            axisLine:{
                lineStyle:{color:'yellow',width:1}
            },axisLabel:{fontSize:14}
        },
        series:series
    };
    chart.setOption(option, true);
}
function draw_two_bar(element_id,xdata,ydata,series,title='test'){
    var chart = echarts.init(document.getElementById(element_id));
    var option = {
        title:{text:title,textStyle:{color:'yellow', fontSize:24}},
        legend:{show:true,textStyle:{color:'white'}},
        tooltip:{
            show: true,
            trigger: 'axis',
            axisPointer:{show:'shadow'},
            formatter: function(param){
                // console.log(param);
                var res = '<h3>'+param[0].name+'</h3>';
                param.forEach(function(obj, index){
                    res +=obj.seriesName+':'+obj.value.toFixed(2)+'<br/>';
                });
                return res;
            },
        },
        toolbox:{
            show:true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable:true,
        dataZoom:[{
            startValue: 0,
            endValue:5,
        }, {
            type: 'inside'
        }],
        xAxis:{
            type:'category',
            data:xdata,
            axisLabel:{
                fontSize:15,
                interval:0,
                rotate:40,
            },
            axisLine:{lineStyle:{color:'yellow',width:1}}
        },
        yAxis:{
            type:'value',
            axisLine:{lineStyle:{color:'yellow',width:1}}
        },
        series:series
    };
    chart.setOption(option, true);
}
// 玫瑰图
function mynathrose(element_id,data,legend,title='test'){
    var chart = echarts.init(document.getElementById(element_id));
    var option = {
        title:{text:title,
            x:'center',
            textStyle:{
            color:'yellow',
            fontSize:24}},
        backgroundColor:'#111a27',
        legend:{show:true,
            x : 'center',
            y : 'bottom',
            textStyle:{color:'white'},
            data:legend
        },
        tooltip:{
            show:true,
            trigger:'item',
            axisPointer:{show:'shadow'},
            formatter: "{b} <br/>{a} : {c}"
        },
        toolbox:{
            show:true,
            feature:{
                dataView:{show:true},
                magicType:{show:true,type:['pie','funnel']},
                restore:{show:true},
                saveAsImage:{show:true},
            }
        },

        calculable:true,

        series:[{
            name:'数值',
            type:'pie',
            data:data,
            radius:[20,110],
            center:['50%','50%'],
            roseType:'area',
            label: {
                normal: {show: false},
                emphasis: {show: true,fontSize:20}
            },
            lableLine: {
                normal: {show: false},
                emphasis: {show: true}
            },
            data:data
        }]
    };
    chart.setOption(option, true);
}
// 漏斗图
function funnel(element_id,data,title='test'){
    chart = echarts.init(document.getElementById(element_id));
    option = {
        title:{text:title,
            x:'center',
            textStyle:{color:'yellow',fontSize:24}},
        // legend:{show:true},
        tooltip:{
            show:true,
            trigger:'item',
            formatter:'{b} <br>{a}: {c}'
        },
        calculable:true,
        toolbox:{
            show:true,
            feature:{
                dataView:{show:true},
                restore:{show:true},
                magicType:{show:true},
                saveAsImage:{show:true},
            }
        },
        series:[{
            name:'数值',
            type:'funnel',
            width:'60%',
            data:data,
        }]
    };
    chart.setOption(option, true);
}
// 普通柱状图
function mybar(element_id,xlabel,data,title='test',color='#1858E5'){
    var chart = echarts.init(document.getElementById(element_id));
    var option = {
        title:{text:title,textStyle:{color:'yellow',fontSize:24}},
        backgroundColor:'#111a27',
        color:color,
        // legend:{show:true,textStyle:'white'},
        tooltip:{
            show:true,
            trigger:'axis',
            axisPointer:{show:'shadow'},
            formatter:function(params){
                var res = '<h3>'+params[0].name+'</h3>';
                params.forEach(function(obj,index){
                    res +=obj.seriesName+':'+obj.value.toFixed(1)+'<br/>';
                });
                return res;
            },
        },
        toolbox:{
            show:true,
            feature:{
                dataView:{show:true},
                magicType:{show:true,type:['line','bar']},
                restore:{show:true},
                saveAsImage:{show:true},
            }
        },
        dataZoom:[{
                startValue:0,
                endValue:10,
            },{type:'inside'
        }],
        calculable:true,
        xAxis:{
            type:'category',
            data:xlabel,
            axisLine:{
                lineStyle:{color:'yellow',width:1},
            },
            axisLabel:{
                fontSize:15,
                interval:0,
                rotate:40,
            }
        },
        yAxis:{
            type:'value',
            axisLine:{
                lineStyle:{color:'yellow',width:1},
            },
        },
        series:[{
            name:'数值',
            type:'bar',
            data:data,
            itemStyle:{
                normal:{
                    label:{show:true,
                        position:'top',
                        color:'white',
                        formatter:function(obj){
                            // console.log(obj);
                            return obj.value.toFixed(2);
                        }
                    }
                }
            }
        }]
    };
    chart.setOption(option, true);
}

// 初始化图表
function init(tuple, index){
    var value = $("input:radio[name='form"+index+"']:checked").val();
    console.log('form'+index,value);
    var url = '/dbexcel/form/change/?'+tuple[0]+'='+value;
    tl = tuple[1].length;
    if(tl==2){
        $.get(url, function(resp){
            console.log(resp);
            var series = [];
            var legends = ['人数','平均值','标准差','最大值','最小值'];
            resp.data.forEach(function(item,index){
                var items = {
                    name:legends[index],
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
                };
                series.push(items);
            });
            title = value+'-描述信息';
            drawhbar('f1-right','',resp.columns,series,title);
            // console.log('finish');
        },'json');
    }else if (tl>2&&tl<6) {
        $.get(url, function(resp){
            console.log(resp);
            // 图１
            var series = [];
            resp.result1.data.forEach(function(item,index){
                var items = {
                    name:resp.result1.index[index][1],
                    type:'bar',
                    data:item,
                    markPoint:{data:[
                        {type:'max', name:'最大值'},
                        {type:'min',name:'最小值'}
                    ]},
                };
                series.push(items);
            });
            ele_id = 'r'+index+'-1'+tl;
            xdata = resp.result1.columns;
            console.log('xdata:',xdata);
            draw_two_bar(ele_id,xdata,'',series,value);
            
            // 图２
            ele_id = 'r'+index+'-2'+tl;
            legend = resp.result2.columns;
            data = [];
            resp.result2.data.forEach(function(val,idx){
                var item = {value:val,name:legend[idx]};
                data.push(item);
            });
            mynathrose(ele_id,data,legend,tuple[0]);
            
            // 图３
            ele_id = 'r'+index+'-3'+tl;
            funnel(ele_id,data,tuple[0]+'漏斗');
        },'json');
    }else if (tuple[0]=='其他字段') {
        $.get(url, function(resp){
            console.log(resp);
            ele_id = 'r'+index+'-1'+tl;
            xlabel = [];
            data = [];
            resp.result1.data.forEach(function(list, index){
                xlabel.push(list[0]);
                data.push(list[1]);
            });
            title = resp.result1.columns[0]+'-'+resp.result1.columns[1];
            mybar(ele_id,xlabel,data,title);

            // var series = [];
            xdata = [];
            mean = [];
            max = [];
            resp.result2.data.forEach(function(item,index){
                if (index%2==0) {
                    mean.push(item[0]);
                    xdata.push(resp.result2.index[index][0]);
                }else{
                    max.push(item[0]);
                }
            });

            var series = [{
                name:'平均值',
                type:'bar',
                data:mean,
                markPoint:{data:[
                    {type:'max', name:'最大值'},
                    {type:'min',name:'最小值'}
                ]},
            },{
                name:'最大值',
                type:'bar',
                data:max,
                markPoint:{data:[
                    {type:'max', name:'最大值'},
                    {type:'min',name:'最小值'}
                ]},
            }];

            ele_id = 'r'+index+'-2'+tl;
            title = resp.result2.columns[0];
            
            draw_two_bar(ele_id,xdata,'',series,title);
        },'json');
    }else {
        $.get(url, function(resp){
            console.log(resp);
            // 图1
            ele_id = 'r'+index+'-1'+tl;
            xlabel = resp.columns;
            data = resp.data[0];
            mybar(ele_id,xlabel,data,value);
            //图２
            ele_id = 'r'+index+'-2'+tl;
            da = [];
            data.forEach(function(val,idx){
                var item = {value:val,name:xlabel[idx]};
                da.push(item);
            });
            funnel(ele_id,da,value+'漏斗');
        },'json');
    }
}

// 单选框的监控
function descfun(num){
    // 表单１
    $('#desc-form>input').change(function(){
        drawf1();
    });
    // console.log(num);
    num.forEach(function(tuple, index){
        tl = tuple[1].length
        if(tl>10){
            var id = '#form-div'+index+'>input';
            var $formid = $(id);
        }else{
            var $formid = $('#form'+index+'>input');
        }
        init(tuple, index)
        $formid.change(function(){
            init(tuple, index);
            
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
