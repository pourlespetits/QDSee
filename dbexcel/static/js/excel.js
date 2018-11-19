$(function(){
    setdsee();
    commitdata();
    loadDesc();
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
        var persons = [];
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
                $('#container').html(resp);

            },'html');

            
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
        // console.log(persons);

    });
}


// 加载班级数据
function loadclass(){
    var select3 = $('input:radio[name="classes"]:checked').val();
    var url = '/dbexcel/get/classdata/?classes='+select3;
    $.get(url, function(resp){
        // console.log('start drawing',resp);
        var series = [];
        resp.data.forEach(function(item,index){
            var items = {
                name:resp.index[index][1],
                type:'bar',
                data:item,
                markPoint:{data:[
                    {type:'max', name:'最大值'},
                    {type:'min',name:'最小值'}
                ]},
            };
            series.push(items);
        });
        var chart = echarts.init(document.getElementById('linebar'));
        var option = {
            title:{text:select3,textStyle:{color:'yellow', fontSize:24}},
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
                data:resp.columns,
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
        // console.log('finish');
        
    },'json');
}
// 加载左边控制栏
function loadDesc(){
    var url = '/dbexcel/get/my_descinfo/'
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
            legend:{show:true,textStyle:{color:'white'}},
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
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            dataZoom: [{
                    startValue: 0,
                    endValue:4,
                    orient:'vertical',
                    // yAxisIndex:[0,4]
                    zoomLock:true
                }, {
                    type: 'inside'
            }],
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
                },
                axisLabel:{fontSize:16}
            }],
            series:series
        };
        chart.setOption(option, true); 
    },'json');

    var select1 = $('input:radio[name="describe"]:checked').val();
    var url = '/dbexcel/myoption/?select='+select1;
    $.get(url, function(resp){
        // var data = JSON.parse(resp);
        // console.log(resp);
        var chart1 = echarts.init(document.getElementById('f0-right'));
        var option1 = {
            title:{text:select1,textStyle:{color:'yellow',fontSize:24}},
            color:'#1858E5',
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
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
            dataZoom: [{
                startValue: 0,
                endValue:10,
            }, {
                type: 'inside'
            }],
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
                    fontSize:16,
                    interval:0,
                    rotate:40,
                },
            }],
            yAxis:[{
                type:'value',
                axisLine: {
                    lineStyle:{
                        color:'yellow',
                        width:1
                    }
                },
                axisLabel:{fontSize:16}
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
        // console.log('finish');
    },'json');

    // 加载班级数据
    loadclass();

    // 加载其他字段数据
    var url = '/dbexcel/get/formheader/';
    $.get(url, function(resp){
        var $contleft = $('#orther-form');
        resp.forEach(function(key, index){
            if(index == 0){
                var html = "<input type='radio' name='orther'checked='checked' value=";

            }else{
                var html = "<input type='radio' name='orther' value=";
                
            }
            html += key+"><label>"+key+"</label><br>";
            $contleft.append(html);
        });
        drawf4();
    },'json');
    setTimeout('ortherform()',2000);

    // 加载饼图数据
    url = '/dbexcel/get/piedata/';
    $.get(url, function(resp){
        // 绘制饼图
        // console.log(resp);
        var data = [];
        resp.data.forEach(function(val,index){
            var item = {value:val,name:resp.columns[index]};
            data.push(item);
        });
        // console.log(data);
        var chart = echarts.init(document.getElementById('circle'));
        var option = {
            title:{text:'班级－信息统计',
                x:'center',
                textStyle:{color:'yellow',fontSize:24}
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:resp.columns,
                textStyle:{color:'white'}
            },
            tooltip:{
                show:true,
                trigger:'tiem',
                formatter: "{b} <br/>{a} : {c}"
                
            },
            toolbox:{
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable:true,
            series:[{
                name:'班级',
                type:'pie',
                radius:[20,110],
                center:['50%','50%'],
                roseType:'area',
                label:{
                    normal:{show:false},
                    emphasis:{show:true,fontSize:15}
                },
                lableLine:{
                    normal:{show:false},
                    emphasis:{show:true}
                },
                data:data,
            }]
        };
        chart.setOption(option, true);


        // 绘制柱状图
        chart = echarts.init(document.getElementById('pie'));
        option = {
            title:{text:'班级',
                textStyle:{color:'yellow',fontSize:24}
            },
            color:'#2EC7C9',
            legend: {
                x : 'center',
                y : 'top',
                data:resp.columns,
                textStyle:{color:'white'}
            },
            toolbox:{
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true,},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            tooltip:{show:true},
            xAxis:{
                type:'category',
                data:resp.columns,
                axisLine:{
                    lineStyle:{color:'yellow',width:1}
                },
                axisLabel:{fontSize:15}
            },
            yAxis:{
                type:'value',
                axisLine:{
                    lineStyle:{color:'yellow',width:1}
                },
                axisLabel:{fontSize:15}
            },
            series:[{
                name:'班级',
                type:'bar',
                data:resp.data,
                itemStyle:{
                        normal:{
                            label:{show:true,
                                position:'top',
                                formatter:function(obj){
                                    // console.log(obj);
                                    return obj.value.toFixed(0);
                                }
                            }
                        }
                    }
            },{
                name:'班级',
                type:'line',
                data:resp.data,
                lineStyle:{color:'yellow'}
            }]
        };
        chart.setOption(option, true);
    },'json');

    // 加载姓名数据
    url = '/dbexcel/get/name/';
    $.get(url, function(resp){
        console.log(resp);
        var $b3div = $('#b3-div');
        resp.forEach(function(name, index){
            if(index==0){
                var html = "<input type='radio' name='name' checked='checked' value=";
            }else{
                var html = "<input type='radio' name='name' value=";
   
            }
            html += name+" id='name"+index+"'><label for='name"+index+"'>";
            html += name+"</label><br>";
            $b3div.append(html);
        });
        // nameform();
        drawf3();
    },'json');
    // console.log("wait to load..");
    setTimeout('nameform()',2000);
}

function drawf4() {
    var value = $('input:radio[name="orther"]:checked').val();
    var url = '/dbexcel/orther/change/?orther=' + value;
    // console.log(value);
    $.get(url, function(resp){
        // console.log(resp);
        // 绘制f4inner-left区域
        var data1 = resp.result1;
        var y = [];
        var x = [];
        data1.data.forEach(function(list){
            x.push(list[0]);
            y.push(list[1]);
        });
        var chart = echarts.init(document.getElementById('f4inner-left'));
        var option = {
            title:{
                text:value+'－名字',
                x:'center',
                textStyle:{color:'yellow',fontSize:24}},
            // legend:{show:true},
            color:'#61A0A8',
            tooltip:{
                show:true,
                trigger:'axis',

            },
            toolbox:{
                show:true,
                feature:{
                    dataView:{show:true},
                    restore:{show:true},
                    magicType : {show: true, type: ['line', 'bar']},
                    saveAsImage:{show:true},
                }
            },
            dataZoom:[{
                startValue:0,
                endValue:10,
            },{type:'inside',}],
            xAxis:{
                type:'category',
                data:x,
                axisLine:{
                    lineStyle:{color:'yellow',width:1}
                },
                axisLabel:{fontSize:15,interval:0,rotate:40}
            },
            yAxis:{
                type:'value',
                axisLine:{
                    lineStyle:{color:'yellow',width:1}
                },
                axisLabel:{fontSize:15,}
            },
            series:[{
                type:'bar',
                name:value,
                data:y,
                markPoint:{data:[
                    {type:'max', name:'最大值'},
                    {type:'min',name:'最小值'}
                ]},
            }]
        };
        chart.setOption(option, true);

        // 填充f4inner-right区域
        var data2 = resp.result2;
        console.log(data2);
        var series = [];
        var mean = [];
        var max = [];
        data2.data.forEach(function(item,index){
            if(index%2==0){
                mean.push(item[0]);
            }else{max.push(item[0]);}
        });
        // console.log(mean,max);
        var chart = echarts.init(document.getElementById('f4inner-right'));
        var option = {
            title:{text:value+'－班级',textStyle:{color:'yellow', fontSize:24}},
            legend:{show:true,textStyle:{color:'white'}},
            tooltip:{
                show: true,
                trigger: 'axis',
                axisPointer:{show:'shadow'},
                formatter: function(param){
                    // console.log(param);
                    var res = '<h3>'+param[0].name+'</h3>';
                    param.forEach(function(obj, index){
                        res +=obj.seriesName+':'+obj.value.toFixed(1)+'<br/>';
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
            
            xAxis:{
                type:'category',
                data:data2.columns,
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
            series:[{
                name:'平均值',
                type:'bar',
                data:mean,
                itemStyle:{
                    normal:{
                        label:{show:true,
                            color:'white',
                            position:'top',
                            formatter:function(obj){
                                // console.log(obj);
                                return obj.value.toFixed(2);
                            }
                        }
                    }
                }
            },
            {
                name:'最大值',
                type:'bar',
                data:max,
                itemStyle:{
                    normal:{
                        label:{show:true,
                            color:'white',
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
        chart.setOption(option, true);
    },'json');
}
function drawf3(){
    var value = $('input:radio[name="name"]:checked').val();
    console.log(value);
    url = "/dbexcel/name/change/?name="+value;
    $.get(url,function(resp){
        // 条形图
        // console.log(resp);
        var chart = echarts.init(document.getElementById('f3inner-left'));
        var option = {
            title:{
                text:value+'－课程',
                x:'center',
                textStyle:{color:'yellow',fontSize:24}},
            // legend:{show:true},
            color:'#1858E5',
            tooltip:{
                show:true,
                trigger:'axis',

            },
            toolbox:{
                show:true,
                feature:{
                    dataView:{show:true},
                    restore:{show:true},
                    magicType : {show: true, type: ['line', 'bar']},
                    saveAsImage:{show:true},
                }
            },
            dataZoom:[{
                startValue:0,
                endValue:5,
            },{type:'inside',}],
            xAxis:{
                type:'category',
                data:resp.columns,
                axisLine:{
                    lineStyle:{color:'yellow',width:1}
                },
                axisLabel:{fontSize:15,interval:0,rotate:40}
            },
            yAxis:{
                type:'value',
                axisLine:{
                    lineStyle:{color:'yellow',width:1}
                },
                axisLabel:{fontSize:15,}
            },
            series:[{
                type:'bar',
                name:'分数',
                data:resp.data[0],
                markPoint:{data:[
                    {type:'max', name:'最大值'},
                    {type:'min',name:'最小值'}
                ]},
            }]
        };
        chart.setOption(option, true);

        var data = [];
        resp.columns.forEach(function(key,index){
            var item = {name:key,value:resp.data[0][index]};
            data.push(item);
        });
        // 漏斗图
        chart = echarts.init(document.getElementById('f3inner-right'));
        option = {
            title:{text:value+'－课程',
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
                name:'分数',
                type:'funnel',
                width:'50%',
                data:data,
            }]
        };
        chart.setOption(option, true);
    },'json');
}
function nameform(){
    // 姓名表单
    $("#b3-div>input").change(function(){
        // console.log('fuck');
        drawf3();
    });
}
function ortherform(){
    // 其他表单
    $('#orther-form>input').change(function(){
        drawf4();
    });
}

// 描述信息的js,单选框的监控
function descfun(){
    // 描述信息表单
    $('#desc-form>input').change(function(){
        var select = $('input:radio[name="describe"]:checked').val();

        var url = '/dbexcel/myoption/?select='+select;
        $.get(url, function(resp){
            // var data = JSON.parse(resp);
            console.log(resp);
            var chart1 = echarts.init(document.getElementById('f0-right'));
            var option1 = {
                title:{text:select,textStyle:{color:'yellow',fontSize:24}},
                color:'#1858E5',
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
                dataZoom: [{
                    startValue: 0,
                    endValue:10,
                }, {
                    type: 'inside'
                }],
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

    //　性别表单
    $('#b1-form>input').change(function(){
        var value = $('input:radio[name="sexes"]:checked').val();
        var url = '/dbexcel/get/sexdata/?sex='+value;
        // console.log(value);
        $.get(url, function(resp){
            // console.log(resp);
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
            var chart = echarts.init(document.getElementById("f0-right"));
            var option = {
                title:{text:value+'-描述信息',textStyle:{color:'yellow',fontSize:24}},
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
                    data:resp.columns,
                    axisLine:{
                        lineStyle:{color:'yellow',width:1}
                    }
                },
                series:series
            };
            chart.setOption(option, true);
        },'json');
    });

    //班级表单
    $('#b2-form>input').change(function(){
        // console.log(start);
        loadclass();
    });

    
}
