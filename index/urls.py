# urls.py
from django.conf.urls import url
from .views import *


urlpatterns = [
    url(r'^$', index_views),
    url(r'^login/$', login_views),
    url(r'^register/$', register_views),
]

urlpatterns += [
    
    url(r'^quitlogin/$', quitlogin_views),
    url(r'^check_phone/$', check_phone_views),
    url(r'^check_login/$', check_login_views),
    
]