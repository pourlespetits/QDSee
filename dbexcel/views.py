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
            if '号' in key:
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

    filepath = 'media/user_data/' + request.COOKIES.get('uphone') + '_descinfo.csv'
    desc_info = numdata.describe()
    # print(desc_info)
    desc_info.to_csv(filepath)
    respdata = desc_info.to_dict('split')
    # print(respdatas)
    return HttpResponse(json.dumps(respdata))


def option_views(request):
    select = request.GET.get('select')
    fname = 'media/user_data/' + request.COOKIES['uphone'] + '_descinfo.csv'
    info_data = pd.read_csv(fname, index_col=0)

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


