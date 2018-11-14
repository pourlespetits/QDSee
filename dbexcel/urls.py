from django.conf.urls import url
from .views import *


urlpatterns = [
    url(r'^excel/$', excel_views),
    url(r'^analysis/$', analysis_views),
    url(r'^myoption/$', myoption_views),
    url(r'^load/$', load_views),
    url(r'^get/my_descinfo/$', my_descinfo_views),
    url(r'^get/descinfo/$',get_descinfo_views),
    url(r'^get/sexdata/$', get_sexdata_views),
]


