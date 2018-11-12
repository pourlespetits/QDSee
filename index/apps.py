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

