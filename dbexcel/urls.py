from django.conf.urls import url
from .views import *


urlpatterns = [
    url(r'^excel/$',excel_views),
]


