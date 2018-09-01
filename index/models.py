from django.db import models

# Create your models here.


class Users(models.Model):
    uname = models.CharField(max_length=20, verbose_name='用户名')
    password = models.CharField(max_length=20, verbose_name='密码')
    uphone = models.CharField(max_length=11, verbose_name='手机号', unique=True)
    usex = models.BooleanField(default=1, verbose_name="性别")
    uemail = models.EmailField(null=True, verbose_name='邮箱')
    birthday = models.DateField(null=True, verbose_name='生日')
    navplace = models.CharField(max_length=30, null=True, verbose_name='籍贯')

    def __str__(self):
        return self.account

    def to_dict(self):
        dic = {
            "id": self.id,
            "uname": self.uname,
            "uphone": self.uphone,
            "usex": self.usex,
            "uemial": self.uemil,
            "birthday": self.birthday,
            "navplace": self.navplace
        }
        return dic

    class Meta:
        db_table = 'users'
        verbose_name = '所有用户'
        verbose_name_plural = verbose_name
