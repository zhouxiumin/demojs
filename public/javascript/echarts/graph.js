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
                console.log(callback);
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