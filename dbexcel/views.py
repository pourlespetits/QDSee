from django.shortcuts import render, HttpResponse
from .views import *
import json
import pandas as pd
# Create your views here.



def excel_views(request):
    return render(request, 'excel.html')


def analysis_views(request):
    data = json.loads(request.POST.get('data'))
    numdic, chardic = {}, {}
    # print(pd.DataFrame(data))
    for dicobj in data:
        for key, value in dicobj.items():
            if '号' in key: # 处理不可序列化的列
                try:
                    chardic[key].append(value)
                except:
                    chardic[key] = []
                    chardic[key].append(value)
                continue
            if type(value) == str:
                try:
                    chardic[key].append(value)
                except:
                    chardic[key] = []
                    chardic[key].append(value)
            else:
                try:
                    numdic[key].append(value)
                except:
                    numdic[key] = []
                    numdic[key].append(value) 


    filepath = 'media/user_data/' + request.COOKIES.get('uphone') + '_num.csv'
    numdata = pd.DataFrame(numdic)
    numdata.to_csv(filepath)

    filepath = 'media/user_data/' + request.COOKIES.get('uphone') + '_char.csv'
    chardata = pd.DataFrame(chardic)
    chardata.to_csv(filepath)

    filepath = 'media/user_data/' + request.COOKIES.get('uphone') + '_origin.csv'
    origindata = pd.concat([chardata,numdata], axis=1)
    origindata.to_csv(filepath)

    filepath = 'media/user_data/' + request.COOKIES.get('uphone') + '_descinfo.csv'
    desc_info = numdata.describe()
    # print(desc_info)
    desc_info.to_csv(filepath)
    return render(request, 'excel_past.html')

# 获取表头字段
def get_formheader_views(request):
    fname = 'media/user_data/16620876274_num.csv' 
    data = pd.read_csv(fname, index_col=0)
    result = data.columns
    return HttpResponse(json.dumps(list(result)))

def get_descinfo_views(request):
    filepath = 'media/user_data/' + request.COOKIES.get('uphone') + '_descinfo.csv'
    data = pd.read_csv(filepath, index_col=0)
    print(data)
    resp = data.to_dict('split')
    print(resp)
    return HttpResponse(json.dumps(resp))

# 获取性别数据
def get_sexdata_views(request):
    select = request.GET.get('sex')
    # 读取源数据
    fname = 'media/user_data/16620876274_origin.csv'
    data = pd.read_csv(fname, index_col=0)
    numname = 'media/user_data/16620876274_num.csv'
    numdata = pd.read_csv(numname, index_col=0)

    condition = list(numdata.columns)
    print(condition)
    row_condition = [(select,'count'),(select,'mean'),(select,'std'),(select,'max'),(select,'min')]
    # 条件筛选
    data = data.groupby(by='性别')
    result = data.describe().loc[row_condition, condition]
    result = result.to_dict('split')
    print(result)
    try:
        return HttpResponse(json.dumps(result))
    except TypeError as e:
        print(e)
        return HttpResponse(json.dumps(e))

# 获取班级数据
def get_classdata_views(request):
    select = request.GET.get('classes')
    fname = 'media/user_data/16620876274_origin.csv'
    data = pd.read_csv(fname, index_col=0)
    # 筛选条件
    numname = 'media/user_data/16620876274_num.csv'
    numdata = pd.read_csv(numname, index_col=0)
    condition = list(numdata.columns)
    print(condition)

    row_condition = [(select,'mean'),(select,'max')]

    data = data.groupby(by='班级').describe()
    result = data.loc[row_condition,condition]
    result = result.to_dict('split')
    print(result)
    return HttpResponse(json.dumps(result))

# 获取姓名数据
def get_name_views(request):
    fname = 'media/user_data/16620876274_char.csv'
    data = pd.read_csv(fname, index_col=0)
    data = data['姓名']
    return HttpResponse(json.dumps(list(data)))

def name_change_views(request):
    name = request.GET.get('name')
    fname = 'media/user_data/16620876274_origin.csv'
    data = pd.read_csv(fname, index_col=0)

    fname = 'media/user_data/16620876274_num.csv'
    col_condition = pd.read_csv(fname,index_col=0).columns

    data = data[data['姓名']==name].loc[:,col_condition]
    result = data.to_dict('split')
    print(result)
    result.pop('index')
    return HttpResponse(json.dumps(result))


def orther_change_views(request):
    field = request.GET.get('orther')
    fname = 'media/user_data/16620876274_origin.csv'
    data = pd.read_csv(fname, index_col=0)
    # 图表f4-left的数据
    data1 = data.loc[:,['姓名',field]]
    # print(data)
    result1 = data1.to_dict('split')

    # 图表f4-right的数据

    data2 = data.groupby(by='班级').describe()
    row_condition = []
    for key1 in ['物联网1班','物联网2班','物联网3班']:
        for key2 in ['mean','max']:
            item = (key1,key2)
            row_condition.append(item)

    result2 = data2.loc[row_condition, [field]]
    # print("result2:",result2)
    try:
        result1 = json.dumps(result1)
    except TypeError as e:
        print(e)
        result1.pop('index')
    result2 = result2.to_dict('split')
    print(result1,result2,end='\n')
    result2['columns'] = ['物联网3班','物联网2班','物联网1班']
    result = {'result1':result1,'result2':result2}
    return HttpResponse(json.dumps(result))

# 获取饼图数据
def get_peidata_views(request):
    fname = 'media/user_data/16620876274_origin.csv'
    data = pd.read_csv(fname, index_col=0)
    data = data.groupby(by='班级').count()
    result = data.iloc[:,0]
    result = result.to_dict()
    columns, values = [], []
    for key, val in result.items():
        columns.append(key)
        values.append(int(val))
    result = {'columns':columns, 'data':values}
    return HttpResponse(json.dumps(result))

def my_descinfo_views(request):
    fname = 'media/user_data/16620876274_descinfo.csv'
    info_data = pd.read_csv(fname, index_col=0)
    info_data = info_data.loc[['count','mean','std','max','min'],:]
    info_data = info_data.to_dict('split')
    return HttpResponse(json.dumps(info_data))

def myoption_views(request):
    select = request.GET.get('select')
    fname = 'media/user_data/16620876274_descinfo.csv'
    info_data = pd.read_csv(fname, index_col=0)
    if select == 'all':
        result = info_data.to_dict('split')
        return HttpResponse(json.dumps(result))

    result = info_data.loc[select, :]
    try:
        result = result.to_dict('split')
    except:
        result = result.to_dict()
    # print(result)
    keys, values = [], []
    for key, val in result.items():
        keys.append(key)
        values.append(val)
    result = {'index': keys,
     'values': values}
    return HttpResponse(json.dumps(result))


def load_views(request):
    # 返回数据格式{'col1':[,,,,,,],'col2':[,,,,],.....}
    fname = 'media/user_data/' + request.COOKIES.get('uphone')\
     + '_char.csv'
    data = pd.read_csv(fname,index_col=0)
    # print(data)
    columns = data.columns
    result = {}
    for column in columns:
        # 去重
        result[column] = list(set(data[column].tolist()))
    result['columns'] = list(columns)
    # print(result)
    return HttpResponse(json.dumps(result))


