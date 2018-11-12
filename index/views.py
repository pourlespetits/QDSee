from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from .models import *
import json
import re
# Create your views here.


def index_views(request):
    return render(request, 'myindex.html')


def register_views(request):
    if request.method == 'GET':
        return render(request, 'Register.html')
    else:
        phone = request.POST['uphone']
        pwd = request.POST['upwd']
        name = request.POST['uname']
        Users.objects.create(uphone=phone, password=pwd, uname=name)
        return render(request, 'myindex.html')


# 验证手机号是否已注册
def check_phone_views(request):
    phone = request.GET.get('uphone')
    plist = Users.objects.filter(uphone=phone)
    if plist:
        # 手机号已被注册
        return HttpResponse("手机号已注册")
    else:
        # 验证成功
        return HttpResponse("验证通过")


def login_views(request):
    
    if request.method == 'GET':
        url = '/index/'
        resp = HttpResponseRedirect(url)
        # 判断用户是否登录过
        if 'uphone' in request.session and 'uid' in request.session:
            print("session中已有登录信息")
            return resp
        else:
            # 用户没有登录过,判断用户是否勾选自动登录
            if 'autolg' in request.COOKIES:
                # 用户选择过自动登录,将登录信息保存到session
                request.session['uid'] = request.COOKIES['uid']
                request.session['uphone'] = request.COOKIES['uphone']
                return resp
            else:
                # 将url保存进cookie
                resp = render(request, 'Login.html')
                resp.set_cookie('url', url)
                return resp
    else:  # 处理POST请求
        phone = request.POST['uphone']
        pwd = request.POST['upwd']
        ulist = Users.objects.filter(uphone=phone, password=pwd)
        # 判断是否能够成功登录
        if ulist:
            # url = request.META.get('HTTP_REFERER', '/')
            url = '/index/'
            # 判断用户是否选择了自动登录
            resp = HttpResponseRedirect(url)
            expries = 60 * 60 * 24 * 365

            # 从cookie中将url删除出去
            if 'url' in request.COOKIES:
                resp.delete_cookie('url')

            request.session['uid'] = ulist[0].id
            request.session['uphone'] = phone
            # print("自动登录："+request.POST['autolg'])
            # if 'autolg' in request.POST:
            resp.set_cookie('uid', ulist[0].id, expries)
            resp.set_cookie('uphone', phone, expries)
            return resp
        else:
            # return render(request, 'login.html')
            return HttpResponse("手机号或密码错误")


def check_login_views(request):
    if 'uid' in request.session and 'uphone' in request.session:
        # 已处于登录状态
        loginStatus = 1
        # 从数据库获取uname
        seid = request.session.get('uid')
        uname = Users.objects.get(id=seid).uname
        dic = {
            "lgStatus": loginStatus,
            "uname": uname
        }
        return HttpResponse(json.dumps(dic))
    else:  # session 中没有登录信息
        # 判断cookie中是否有登录信息
        if 'id' in request.COOKIES and 'uphone' in request.COOKIES:
            # 将cookie中的登录信息存到session中
            request.session['uid'] = request.COOKIES['uid']
            request.session['uphone'] = request.COOKIES['uphone']
            loginStatus = 1
            # 从数据库获取uname
            seid = request.COOKIES.get('uid')
            uname = Users.objects.get(id=seid).uname
            dic = {
                "lgStatus": loginStatus,
                "uname": uname
            }
            return HttpResponse(json.dumps(dic))
        else:
            # session和cookie中都没有登录信息
            dic = {"lgStatus": 0}
            return HttpResponse(json.dumps(dic))


# 处理退出登录的请求
def quitlogin_views(request):
    resp = render(request, 'myindex.html')
    # 删除session中的登录信息
    if 'uid' in request.session and 'uphone' in request.session:
        del request.session['uid']
        del request.session['uphone']
    # 删除cookie中的登录信息
    if 'uid' in request.COOKIES and 'uphone' in request.COOKIES:
        resp.delete_cookie('uid')
        resp.delete_cookie('uphone')
    # 返回首页
    return resp






def db_analizy_views(request):
    return render(request, 'db_analizy.html')


