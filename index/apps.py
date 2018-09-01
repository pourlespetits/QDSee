from django.apps import AppConfig
import jieba
import wordcloud as wc
from PIL import Image
import numpy as np
import matplotlib.pyplot as mp
import time
import threading as td
import os


class IndexConfig(AppConfig):
    name = 'index'


class WCloud(object):

    def __init__(self, string):
        self.string = string

    def specialDeal(self):
        '''
        return a string
        '''
        newstring = ''
        # 分词处理
        str_list = jieba.cut(self.string, HMM=True)
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
        fname = time.asctime()
        fname = fname[11:].replace(":", "-")
        fname = fname.replace(' ', '-') + ".png"
        w.to_file("media/out_img/" + fname)
        
        return fname

    def wordAnaly(self):
        # 生成词频字典
        word_dict = w.process_text(string)
        xlabel = []
        yvalue = []
        for key, value in word_dict.items():
            xlabel.append(key)
            yvalue.append(value)
        # 绘制词频分析图
        xlabel = np.array(xlabel)
        yvalue = np.array(yvalue)
        # .........
        # 图片名字
        fname = time.asctime()
        fname = fname[11:].replace(":", "-")
        fname = fname.replace(' ', '-') + "plt.png"
        return fname,word_dict

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


class DataSwitPic(object):
    """docstring for DataSwitPic"""
    def __init__(self, chartName='figure.png'):
        self.chartName = chartName
        # 自定义样式
        self.mp.rcParams['font.sans-serif'] = 'SimHei'
        self.mp.rcParams['axes.unicode_minus'] = False
        # 设置axes的背景颜色
        self.mp.rcParams['axes.facecolor'] = '#111A27'
        # 设置坐标轴的标签颜色
        self.mp.rcParams['axes.labelcolor'] = 'white'
        # 设置坐标刻度的颜色
        self.mp.rcParams['ytick.color'] = 'white'
        self.mp.rcParams['xtick.color'] = 'white'
        # 设置figure的文本颜色
        self.mp.rcParams['text.color'] = '#E6DB74'
        # 设置保存图片的背景颜色
        self.mp.rcParams['savefig.facecolor'] = '#111A27'
        # 设置坐标框线不显示
        self.mp.rcParams['axes.spines.top'] = False
        self.mp.rcParams['axes.spines.right'] = False
        self.mp.rcParams['figure.facecolor'] = '#111A27'

    def lineChart(self, xdata, ydata):
        '''
        折线图
        xdata:行数据
        ydata:列数据
        返回图像的名字
        '''
        self.mp.title(self.chartName, fontsize=20)
        self.mp.xlabel('高频词', fontsize=14)
        self.mp.ylabel('出现频率', fontsize=14)
        self.mp.xticks(xdata)
        ax = self.mp.gca()
        ax.spines['left'].set_color('#545551')
        ax.spines['bottom'].set_color('#545551')
        filepath = 'media/out_img/' + self.chartName
        self.mp.savefig(filepath)

    def pieChart(self, xdata, labels):
        '''饼图'''
        pass

    def barChart(self, xdata, ydata, yais):
        '''普通柱图'''
        pass

    def horizBarChart(self, xdata, ydata, yais):
        '''横向柱图'''
        pass

    def scatterChart(self, xdata, ydata, yais):
        '''散点图'''
        # 将lineStyle设置为"o"
        pass

    def bubbleChart(self, xdata, ydata, yais):
        '''气泡图'''
        pass

    def stackPlotChart(self, xdata, ydata, yais):
        # 堆叠图
        pass

    def spanChart(self, xdata, ydata, yais):
        '''双向柱图using span_where'''
        pass

