from django.contrib import admin
from .models import *
# Register your models here.


class UsersAdmin(admin.ModelAdmin):
    list_display = ['uname', 'uphone']
    fields = ['uphone', 'password', 'uname']


admin.site.register(Users, UsersAdmin)
