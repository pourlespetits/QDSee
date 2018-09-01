from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from .models import *
from .apps import WCloud
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
        url = request.META.get('HTTP_REFERER', '/')
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
            url = request.META.get('HTTP_REFERER', '/')
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


def wordcloud_views(request):
    if request.method == 'GET':
        return render(request, 'word_cloud.html')
    else:
        file = request.POST.get('file')
        shape = request.POST.get('shape')
        analy_word = request.POST.get('analy_word')
        # print(type(analy_word))
        # 判断用户是否要进行词频分析
        if analy_word == '1':
            pass
            return HttpResponse('正在分析中')
        else:
            # 生成的词云图片
            wcloud = WCloud(file)
            fname = wcloud.transTopic(shape)
            pic_url = "/media/out_img/" + fname
            # 获取程序生成的词云图片
            picMsg = {'pic_url': pic_url}
            wcloud.delPic(fname)
            return HttpResponse(json.dumps(picMsg))


def check_info(request):
    uphone = request.POST["uphone"]
    uname = request.POST['uname']
    uemail = request.POST['uemail']
    birthday = request.POST['birthday']
    navplace = request.POST['navplace']
    # 检查手机号是否合法
    if len(uphone) != 11:
        return 1
    # 检测名字是否合法
    matchl = re.findall(r'[^@#$%&*0-9]*', uname)
    if len(uname) == 0:
        pass
    elif matchl[0] != uname:
        return 2
    # 检测email是否合法
    matchl = re.findall(r'^[^@]*@\w*\.[^@]*$', uemail)
    print(matchl)
    if len(uemail) == 0:
        pass
    elif not matchl:
        return 3
    # 检测出生日期是否合法
    matchl = re.findall(
        r'(19[0-9][0-9]|200[0-9])-(0?[1-9]|1[0-9])-(0?[1-9]|[1-2][0-9]|3[0-1])', birthday)
    if len(birthday) == 0:
        pass
    elif not matchl:
        return 4
    elif 1799 < int(birthday[:4]) < 3000:
        if 0 < int(birthday[5:7]) < 12:
            if 0 < int(birthday[8:]) < 31:
                pass
            else:
                return 4
        else:
            return 4
    else:
        return 4
    # 检测籍贯是否合法
    if len(navplace) > 50:
        return 5


# 处理个人中心的页面请求
def info_views(request):
    if request.method == 'GET':
        uid = request.session.get('uid')
        # print(uid)
        user = Users.objects.get(id=uid)
        uphone = user.uphone
        sex = user.usex
        uname = user.uname
        uemail = user.uemail
        birthday = user.birthday
        navplace = user.navplace
        return render(request, 'info.html', locals())
    else:
        checkresult = check_info(request)
        if checkresult == 1:
            dic = {'status': 0, 'text': "手机号不合法"}
            return HttpResponse(json.dumps(dic))
        elif checkresult == 2:
            dic = {'status': 0, 'text': "名字不合法"}
            return HttpResponse(json.dumps(dic))
        elif checkresult == 3:
            dic = {'status': 0, 'text': "邮箱不合法"}
            return HttpResponse(json.dumps(dic))
        elif checkresult == 4:
            dic = {'status': 0, 'text': "日期不合法"}
            return HttpResponse(json.dumps(dic))
        elif checkresult == 5:
            dic = {'status': 0, 'text': "长度超出范围"}
            return HttpResponse(json.dumps(dic))
        else:
            phone = request.COOKIES['uphone']
            uid = request.COOKIES['uid']
            user = Users.objects.get(uphone=phone, id=uid)
            user.uphone = request.POST["uphone"]
            user.uname = request.POST['uname']
            user.uemail = request.POST['uemail']
            user.birthday = request.POST['birthday'] or "1990-01-01"
            user.navplace = request.POST['navplace']
            user.save()
            dic = {'status': 1}
            return HttpResponse(json.dumps(dic))


# 处理修改个人信息的异步请求
def getinfo_views(request):
    uphone = request.session['uphone']
    user = Users.objects.get(uphone=uphone)
    print(user.uphone)
    dic = {
        "uphone": uphone,
        "sex": user.usex,
        "uname": user.uname,
        "uemail": user.uemail,
        "birthday": user.birthday,
        "navplace": user.navplace
    }

    return render(request, 'setinfo.html',dic)


# 处理修改密码的请求
def setpwd_views(request):
    if request.method == 'GET':
        return render(request, 'setpwd.html')
    else:
        newpwd = request.POST['newpwd']
        uphone = request.POST['uphone']
        try:
            user = Users.objects.get(uphone=uphone)
            user.password = newpwd
            user.save()
            return HttpResponse('ok')
        except:
            print("手机号不存在")
            return HttpResponse('no')


# 修改密码中的验证旧密码的请求
def check_oldpwd_views(request):
    oldpwd = request.POST.get("oldpwd")
    uphone = request.POST.get("uphone")
    # print(oldpwd, uphone)
    ulist = Users.objects.filter(uphone=uphone, password=oldpwd)
    if ulist:
        # 旧密码输入正确
        dic = {
            'status': 1,
            'resText': "密码正确"
        }
        return HttpResponse(json.dumps(dic))
    else:
        dic = {
            'status': 0,
            'resText': "密码错误"
        }
        return HttpResponse(json.dumps(dic))


def db_analizy_views(request):
    return render(request, 'db_analizy.html')


