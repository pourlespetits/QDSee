from django.conf.urls import url
from .views import *


urlpatterns = [
    url(r'^excel/$', excel_views),
    url(r'^analysis/$', analysis_views),
    url(r'^myoption/$', myoption_views),
    url(r'^load/$', load_views),
    url(r'^get/formheader/$', get_formheader_views),
    url(r'^get/my_descinfo/$', my_descinfo_views),
    url(r'^get/descinfo/$',get_descinfo_views),
    url(r'^get/sexdata/$', get_sexdata_views),
    url(r'^get/classdata/$', get_classdata_views),
    url(r'^get/name/$', get_name_views),
    url(r'^get/piedata/$', get_peidata_views),
    url(r'^name/change/$', name_change_views),
]


