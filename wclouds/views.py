from django.shortcuts import render, HttpResponse
from .apps import *
import json

# Create your views here.

def wordcloud_views(request):
    if request.method == 'GET':
        return render(request, 'word_cloud.html')
    else:
        file = request.POST.get('file')
        shape = request.POST.get('shape')
        analy_word = request.POST.get('analy_word')
        # 生成的词云图片
        wcloud = WCloud(file)
        fname, wordict = wcloud.transTopic(shape)
        pic_url = "/media/out_img/" + fname

        wordict = sorted(wordict.items(), key=lambda x:x[1], reverse=True)[:15]
        print(wordict)
        # 获取程序生成的词云图片
        picMsg = {'pic_url': pic_url, 'wordict': wordict}
        wcloud.delPic(fname)
        return HttpResponse(json.dumps(picMsg))
        