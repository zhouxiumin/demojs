/**
 * Created by zhouxiumin on 2017/7/9.
 */

var myChart = echarts.init(document.getElementById('main'));
window.onresize = function () {
    myChart.resize();
};
myChart.showLoading();
myChart.showLoading();
$.getJSON('/server/npmdepgraph.min10.json', function (json) {
    myChart.hideLoading();
    myChart.setOption(option = {
        title: {
            text: 'NPM Dependencies'
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        tooltip: {
            showDelay: 1000,
            formatter:function(params, ticket, callback){
                $.get('/server/npmdepgraph.min10.json', function (content) {
                    callback(ticket, "i:" + Math.random()*100);
                });
                return 'loading';
            }
        },
        series : [
            {
                type: 'graph',
                layout: 'none',
                // progressiveThreshold: 700,
                data: json.nodes.map(function (node) {
                    return {
                        x: node.x,
                        y: node.y,
                        id: node.id,
                        name: node.label,
                        symbolSize: node.size,
                        itemStyle: {
                            normal: {
                                color: node.color
                            }
                        }
                    };
                }),
                edges: json.edges.map(function (edge) {
                    return {
                        source: edge.sourceID,
                        target: edge.targetID
                    };
                }),
                label: {
                    emphasis: {
                        position: 'right',
                        show: true
                    }
                },
                roam: true,
                focusNodeAdjacency: true,
                lineStyle: {
                    normal: {
                        width: 0.5,
                        curveness: 0.3,
                        opacity: 0.7
                    }
                }
            }
        ]
    }, true);
});
var preDataIndex = null;

myChart.on('click', function (params) {
    if (!params.dataType || params.dataType !== 'node') {
        return;
    }
    console.log(params);
    var option = myChart.getOption();
    var series = option.series;
    console.log(series);
    if (preDataIndex === null) {
        series[0].focusNodeAdjacency = false;
        myChart.setOption({
            series: series
        });
        console.log(myChart);
        focusNode(myChart, params);


        preDataIndex = params.dataIndex;
    } else if (preDataIndex === params.dataIndex) {
        series[0].focusNodeAdjacency = true;
        myChart.setOption({
            series: series
        });


        preDataIndex = null;
    }
});

// **********************************************
// ****************核心代码***********************
// **********************************************
// **********************************************
var nodeOpacityPath = ['itemStyle', 'normal', 'opacity'];
var lineOpacityPath = ['lineStyle', 'normal', 'opacity'];
function getItemOpacity(item, opacityPath) {
    return item.getVisual('opacity') || item.getModel().get(opacityPath);
}
function focusNode(ec, payload) {
    var model = ec.getModel();
    var seriesModel = model.getSeriesByIndex(0);
    var data = seriesModel.getData();
    var dataIndex = payload.dataIndex;

    var el = data.getItemGraphicEl(dataIndex);
    console.log(el);

    if (!el) {
        return;
    }

    var graph = data.graph;
    var dataType = el.dataType;

    function fadeOutItem(item, opacityPath) {
        var opacity = getItemOpacity(item, opacityPath);
        var el = item.getGraphicEl();
        if (opacity === null) {
            opacity = 1;
        }

        el.traverse(function (child) {
            child.trigger('normal');
            if (child.type !== 'group') {
                child.setStyle('opacity', opacity * 0.1);
            }
        });
    }

    function fadeInItem(item, opacityPath) {
        var opacity = getItemOpacity(item, opacityPath);
        var el = item.getGraphicEl();

        el.traverse(function (child) {
            child.trigger('emphasis');
            if (child.type !== 'group') {
                child.setStyle('opacity', opacity);
            }
        });
    }

    if (dataIndex !== null && dataType !== 'edge') {
        graph.eachNode(function (node) {
            fadeOutItem(node, nodeOpacityPath);
        });
        graph.eachEdge(function (edge) {
            fadeOutItem(edge, lineOpacityPath);
        });

        var node = graph.getNodeByIndex(dataIndex);
        fadeInItem(node, nodeOpacityPath);

    }


}