/**
 * Created by zhouxiumin on 2017/7/9.
 */
var myChart = echarts.init(document.getElementById('main'));
window.onresize = function () {
    myChart.resize();
};
myChart.showLoading();
var normalColor = "#888888";
var highlightColor = "#ea172a";
$.get('/server/energy.json', function (data) {
    myChart.hideLoading();
    var i;
    for (i=0;i< data.links.length;i++) {
        data.links[i].lineStyle = {"normal": {"color": normalColor}};
    }
    for (i=0;i< data.nodes.length;i++) {
        data.nodes[i].itemStyle = {"normal": {"color": normalColor}};
    }

    myChart.setOption(option = {
        title: {
            text: '桑基图'
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'sankey',
                layout: 'none',
                data: data.nodes,
                links: data.links,
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    }
                },
                lineStyle: {
                    normal: {
                        color: 'source',
                        curveness: 0.5
                    }
                },
                silent: false
            }
        ]
    });
});
var pre = null;

myChart.on('click', function (params) {
    if (params.type !== 'click') {
        return;
    }
    var option = myChart.getOption();
    var selectNodes = params.data.name;
    if (!selectNodes) {
        return;
    }
    var nodes = option.series[0].data;
    var links = option.series[0].links;

    if (pre === selectNodes) {
        toggleData(nodes, links, selectNodes, false);
        pre = null;
    } else if (pre ===null){
        toggleData(nodes, links, selectNodes, true);
        pre = selectNodes;
    } else {
        toggleData(nodes, links, pre, false);
        toggleData(nodes, links, selectNodes, true);
        pre = selectNodes;
    }
    myChart.setOption(option);
});

function toggleData(nodes, links, node, toggle) {
    var queue = [];
    queue.unshift(node);
    var i;

    while (queue.length !== 0) {
        var n = queue.pop();
        for (i=0; i < nodes.length; i ++) {
            if (nodes[i].name === n) {
                if (toggle) {
                    nodes[i].itemStyle = {"normal": {"color": highlightColor}};
                } else {
                    nodes[i].itemStyle ={"normal": {"color": normalColor}};
                }

            }
        }
        for (i=0;i< links.length;i++) {
            if (links[i].target === n) {
                if (toggle) {
                    links[i].lineStyle = {"normal": {"color": highlightColor}};
                } else {
                    links[i].lineStyle = {"normal": {"color": normalColor}};
                }
                queue.unshift(links[i].source);
            }
        }
    }
}
