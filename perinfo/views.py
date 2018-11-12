from django.shortcuts import render, HttpResponse
from .views import *
from index.models import *
import json
import re

# Create your views here.




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
        print(uid)
        user = Users.objects.get(id=uid)
        uphone = ' ' if user.uphone == None else user.uphone
        sex = ' ' if user.usex == None else user.usex
        uname = ' ' if user.uname == None else user.uname
        uemail = ' ' if user.uemail == None else user.uemail
        birthday = ' ' if user.birthday == None else user.birthday
        navplace = ' ' if user.navplace == None else user.navplace
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
        "sex": ' ' if user.usex == None else user.usex,
        "uname": ' ' if user.uname == None else user.uname,
        "uemail": ' ' if user.uemail == None else user.uemail,
        "birthday": ' ' if user.birthday == None else user.birthday,
        "navplace": ' ' if user.navplace == None else user.navplace
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

