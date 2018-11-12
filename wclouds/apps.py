from django.apps import AppConfig
import wordcloud as wc
import time
import jieba
import numpy as np
from PIL import Image
import threading as td
import os

class WCloud(object):

    def __init__(self, string):
        self.string = string

    def specialDeal(self):
        '''
        return a string
        '''
        newstring = ''
        # 分词处理
        str_list = jieba.cut(self.string)
        # 去除标点符号
        fuhao = """，。？‘“”’：,?<'">()（）/!*\n 　12345678910１２３４５６７８９"""
        for word in str_list:
            if word not in fuhao:
                newstring += word + ' '
        return newstring

    def transTopic(self, shape):
        '''
        返回图像名称，词频字典
        '''
        # 本例的font_path是linux下的字体格式，如果是在windows
        # 下运行，font_path需改成windows下的字体
        string = self.specialDeal()
        if shape == '1':
            w = wc.WordCloud(width=600, height=450,
                 max_words=5000,
                 font_path='NotoSansCJK.ttc',
                 background_color='white')
        elif shape == '2':
            x,y = np.ogrid[:300,:300]
            alice_mask = (x-150) ** 2 + (y-150) ** 2 > 130 ** 2
            alice_mask = 255 * alice_mask.astype(int)
            w = wc.WordCloud(width=600, height=450,
                 max_words=5000,
                 font_path='NotoSansCJK.ttc',
                 mask=alice_mask,
                 repeat=True,
                 background_color='white')
        elif shape == '3':
            alice_mask = np.array(Image.open("media/girl.png"))
            w = wc.WordCloud(width=600, height=450,
                 max_words=5000,
                 font_path='NotoSansCJK.ttc',
                 mask=alice_mask,
                 contour_width=3,
                 contour_color='steelblue',
                 background_color='white')
        elif shape == '4':
            alice_mask = np.array(
                Image.open("media/chinamap.jpg"))
            w = wc.WordCloud(width=600, height=450,
                 max_words=5000,
                 font_path='NotoSansCJK.ttc',
                 mask=alice_mask,
                 background_color='white')
        w.generate(string)
        # 生成词频字典
        word_dict = w.process_text(string)
        fname = time.asctime()
        fname = fname[11:].replace(":", "-")
        fname = fname.replace(' ', '-') + ".png"
        w.to_file("media/out_img/" + fname)

        return fname, word_dict

    # 定时清理生成的图片
    def delPic(self, filename=None):
        def delaction(filename):
            time.sleep(60)
            try:
                os.remove('media/out_img/' + filename)
            except Exception as e:
                print('图片删除失败', e)
                return False
            print("图片删除成功")
            return True

        t = td.Thread(target=delaction, args=(filename,))
        t.setDaemon(True)
        t.start()

