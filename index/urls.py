# urls.py
from django.conf.urls import url
from .views import *


urlpatterns = [
    url(r'^$', index_views),
    url(r'^login/$', login_views),
    url(r'^register/$', register_views),
    url(r'^wordcloud/$', wordcloud_views),
    url(r'^info/$', info_views),
    url(r'^analizy/db_analizy/$', db_analizy_views),
    url(r'^analizy/exc_analizy/$', db_analizy_views),
]

urlpatterns += [
    url(r'^getinfo/$', getinfo_views),
    url(r'^setpwd/$', setpwd_views),
    url(r'^quitlogin/$', quitlogin_views),
    url(r'^check_phone/$', check_phone_views),
    url(r'^check_login/$', check_login_views),
    url(r'^check_oldpwd/$', check_oldpwd_views),
    
]