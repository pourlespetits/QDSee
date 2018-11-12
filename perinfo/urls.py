from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^$',info_views),
    url(r'^getinfo/$', getinfo_views),
    url(r'^setpwd/$', setpwd_views),
    url(r'^check_oldpwd/$', check_oldpwd_views),
]