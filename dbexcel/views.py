from django.shortcuts import render, HttpResponse
from .views import *
import json
# Create your views here.



def excel_views(request):
    return render(request,'excel.html')

