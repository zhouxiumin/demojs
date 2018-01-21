/**
 * Created by Xiumin on 2018/1/21.
 */
var myChart = echarts.init(document.getElementById('main'));
window.onresize = function () {
    myChart.resize();
};
var dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
var data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
var yMax = 500;
var dataShadow = [];

for (var i = 0; i < data.length; i++) {
    dataShadow.push(yMax);
}
var option = {
    title: {
        text: '特性示例：渐变色 阴影 点击缩放',
        subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
    },
    backgroundColor: 'rgba(0,0,0,0)',
    grid: {
        show:true,
        left: '0.5%',
        right: '0.5%',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    xAxis: {
        data: dataAxis,
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        splitLine:{
            show:false
        },
        z: 10
    },
    yAxis: {
        splitLine:{
            show:false
        },
        axisLabel: {
            textStyle: {
                color: '#999'
            }
        }
    },
    series: [
        { // For shadow
            type: 'bar',
            itemStyle: {
                normal: {color: 'rgba(0,0,0,0)'}
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            animation: false
        },
        {
            type: 'bar',
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#83bff6'},
                            {offset: 0.5, color: '#188df0'},
                            {offset: 1, color: '#188df0'}
                        ]
                    )
                },
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#2378f7'},
                            {offset: 0.7, color: '#2378f7'},
                            {offset: 1, color: '#83bff6'}
                        ]
                    )
                }
            },
            data: data
        }
    ]
};

myChart.setOption(option);