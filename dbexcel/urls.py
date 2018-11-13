from django.conf.urls import url
from .views import *


urlpatterns = [
    url(r'^excel/$', excel_views),
    url(r'^analysis/$', analysis_views),
    url(r'^option/$',option_views),
]


