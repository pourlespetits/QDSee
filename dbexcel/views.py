from django.shortcuts import render, HttpResponse
from .views import *
import json
import pandas as pd
# Create your views here.



def excel_views(request):
    return render(request, 'excel.html')


def analysis_views(request):
    data = json.loads(request.POST.get('data'))
    dic = {}

    for dicobj in data:
        for key, value in dicobj.items():
            try:
                dic[key].append(value)
            except:
                dic[key] = []
                dic[key].append(value)

    # print(dic)
    original = pd.DataFrame(dic)
    desc_info = original.describe()

    filepath = 'media/user_data/' + request.COOKIES.get('uphone') + '.csv'
    desc_info.to_csv(filepath)
    respdata = desc_info.to_dict('split')
    # print(respdatas)
    return HttpResponse(json.dumps(respdata))