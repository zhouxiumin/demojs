/**
 * Created by Xiumin on 2018/1/21.
 */
var app = angular.module('myApp', ['echarts-ng']);
app.controller('myCtrl', function ($scope, $echarts) {
    $scope.DISTRIBUTION_ID = $echarts.generateInstanceIdentity();

    var count = [];
    var time = [];

    var start = 1513132488541;
    for (var i = 0; i < 48; i++) {
        var interval = 1000 * 60 * 30;
        var rand = Math.floor(20 * Math.random());
        count.push(rand);
        time.push(start + interval * i);
    }

    var rdata = [];
    for (i = 0; i < count.length; i++) {
        var item = [time[i], count[i]];
        rdata.push(item);
    }

    var times = [];
    for (i = 0; i < time.length; i++) {
        var t = time[i];
        times.push({
            value: t, textStyle: {
                color: 'red'
            }
        });
    }

    $scope.distribution = {
        "theme": "macarons",
        "driftPalette": false,
        "notMerge": true,
        "emptyMask": {"text": "未查询到数据"},
        "loading": {"maskColor": "rgba(255, 255, 255, 1)"},
        "backgroundColor": "rgba(0,0,0,0)",
        "color": ["#00b3df", "#06d3bf", "#95c85a", "#ddb850", "#f5764b", "#df3c51", "#74d9ed", "#f8a13f", "#dae342", "#8d7be3", "#a4e59b", "#54becc", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553", "#c14089"],
        "graph": {"color": ["#00b3df", "#06d3bf", "#95c85a", "#ddb850", "#f5764b", "#df3c51", "#74d9ed", "#f8a13f", "#dae342", "#8d7be3", "#a4e59b", "#54becc"]},
        "nullColor": "#b2b2b2",
        "alarmLevelColor": {"0": "#FFD640", "1": "#FF6C04", "2": "#E61728", "3": "#CC007D"},
        "vulLevelColor": {"0": "#00BFF1", "1": "#FFD640", "2": "#FF6C04", "3": "#E61728"},
        "eventLevelColor": {
            "emergent": "#FC4D51",
            "serious": "#F59739",
            "important": "#F1C53A",
            "alarm": "#48AAF1",
            "info": "#64C545",
            "default": "#54becc"
        },
        "alarmStageColor": {
            "investigation": "#5b5b5b",
            "delivery": "#37586b",
            "use": "#1e5e83",
            "install": "#017abf",
            "control": "#00a6e2",
            "attack": "#85ddfd"
        },
        "alarmManageStatusColor": {"treating": "#ffd700", "done": "#52c3f1", "overdue": "#f77b6b"},
        "categoryAxis": {
            "axisLine": {"lineStyle": {"color": "#008acd"}},
            "splitLine": {"lineStyle": {"color": ["#eee"]}}
        },
        "valueAxis": {
            "axisLine": {"lineStyle": {"color": "#008acd"}},
            "splitArea": {"show": true, "areaStyle": {"color": ["rgba(250,250,250,0.1)", "rgba(200,200,200,0.1)"]}},
            "splitLine": {"lineStyle": {"color": ["#eee"]}}
        },
        "line": {"smooth": true, "symbol": "emptyCircle", "symbolSize": 3},
        "candlestick": {
            "itemStyle": {
                "normal": {
                    "color": "#d87a80",
                    "color0": "#2ec7c9",
                    "lineStyle": {"color": "#d87a80", "color0": "#2ec7c9"}
                }
            }
        },
        "scatter": {"symbol": "circle", "symbolSize": 4},
        "map": {
            "label": {"normal": {"textStyle": {"color": "#d87a80"}}},
            "itemStyle": {"normal": {"borderColor": "#eee", "areaColor": "#ddd"}, "emphasis": {"areaColor": "#fe994e"}}
        },
        "gauge": {
            "axisLine": {
                "lineStyle": {
                    "color": [[0.2, "#2ec7c9"], [0.8, "#5ab1ef"], [1, "#d87a80"]],
                    "width": 10
                }
            },
            "axisTick": {"splitNumber": 10, "length": 15, "lineStyle": {"color": "auto"}},
            "splitLine": {"length": 22, "lineStyle": {"color": "auto"}},
            "pointer": {"width": 5}
        },
        "textStyle": {"fontFamily": "Microsoft YaHei", "fontSize": 12, "fontStyle": "normal", "fontWeight": "normal"},
        "animation": "auto",
        "animationDuration": 1000,
        "animationDurationUpdate": 300,
        "animationEasing": "exponentialOut",
        "animationEasingUpdate": "cubicOut",
        "animationThreshold": 2000,
        "progressiveThreshold": 3000,
        "progressive": 400,
        "hoverLayerThreshold": 3000,
        "useUTC": false,
        "title": [{
            "left": "center",
            "top": "top",
            "padding": [20, 10, 10, 10],
            "textStyle": {"fontWeight": "normal", "color": "#008acd", "fontSize": 18},
            "zlevel": 0,
            "z": 6,
            "show": true,
            "text": "",
            "target": "blank",
            "subtext": "",
            "subtarget": "blank",
            "backgroundColor": "rgba(0,0,0,0)",
            "borderColor": "#ccc",
            "borderWidth": 0,
            "itemGap": 10,
            "subtextStyle": {"color": "#aaa"},
            "right": null,
            "bottom": null
        }],
        "axisPointer": [{
            "show": "auto",
            "triggerOn": null,
            "zlevel": 0,
            "z": 50,
            "type": "line",
            "snap": false,
            "triggerTooltip": true,
            "value": null,
            "status": null,
            "link": [],
            "animation": null,
            "animationDurationUpdate": 200,
            "lineStyle": {"color": "#aaa", "width": 1, "type": "solid"},
            "shadowStyle": {"color": "rgba(150,150,150,0.3)"},
            "label": {
                "show": true,
                "formatter": null,
                "precision": "auto",
                "margin": 3,
                "color": "#fff",
                "padding": [5, 7, 5, 7],
                "backgroundColor": "auto",
                "borderColor": null,
                "borderWidth": 0,
                "shadowBlur": 3,
                "shadowColor": "#aaa"
            },
            "handle": {
                "show": false,
                "icon": "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z",
                "size": 45,
                "margin": 50,
                "color": "#333",
                "shadowBlur": 3,
                "shadowColor": "#aaa",
                "shadowOffsetX": 0,
                "shadowOffsetY": 2,
                "throttle": 40
            }
        }],
        "tooltip": [{
            "trigger": "axis",
            "axisPointer": {
                "type": "shadow",
                "lineStyle": {"color": "#008acd"},
                "crossStyle": {"color": "#008acd", "width": 1, "type": "dashed", "textStyle": {}},
                "shadowStyle": {"color": "rgba(200,200,200,0.2)"},
                "axis": "auto",
                "animation": "auto",
                "animationDurationUpdate": 200,
                "animationEasingUpdate": "exponentialOut"
            },
            "backgroundColor": "rgba(50,50,50,0.5)",
            "zlevel": 0,
            "z": 8,
            "show": true,
            "showContent": true,
            "triggerOn": "mousemove|click",
            "alwaysShowContent": false,
            "displayMode": "single",
            "confine": false,
            "showDelay": 0,
            "hideDelay": 100,
            "transitionDuration": 0.4,
            "enterable": false,
            "borderColor": "#333",
            "borderRadius": 4,
            "borderWidth": 0,
            "padding": 5,
            "extraCssText": "",
            "textStyle": {"color": "#fff", "fontSize": 14}
        }],
        "yAxis": [{
            "type": "value",
            "splitLine": {"show": false, "lineStyle": {"color": ["#eee"], "width": 1, "type": "solid"}},
            "axisLine": {
                "lineStyle": {"color": "#008acd", "width": 1, "type": "solid"},
                "show": true,
                "onZero": true,
                "onZeroAxisIndex": null
            },
            "splitArea": {"show": true, "areaStyle": {"color": ["rgba(250,250,250,0.1)", "rgba(200,200,200,0.1)"]}},
            "boundaryGap": [0, 0],
            "splitNumber": 5,
            "show": true,
            "zlevel": 0,
            "z": 0,
            "inverse": false,
            "name": "",
            "nameLocation": "end",
            "nameRotate": null,
            "nameTruncate": {"maxWidth": null, "ellipsis": "...", "placeholder": "."},
            "nameTextStyle": {},
            "nameGap": 15,
            "silent": false,
            "triggerEvent": false,
            "tooltip": {"show": false},
            "axisPointer": {},
            "axisTick": {"show": true, "inside": false, "length": 5, "lineStyle": {"width": 1}},
            "axisLabel": {
                "show": true,
                "inside": false,
                "rotate": 0,
                "showMinLabel": null,
                "showMaxLabel": null,
                "margin": 8,
                "fontSize": 12
            },
            "offset": 0,
            "rangeEnd": null,
            "rangeStart": null
        }],
        "xAxis": [{
            "axisLine": {
                "lineStyle": {"color": "#008acd", "width": 1, "type": "solid"},
                "show": true,
                "onZero": true,
                "onZeroAxisIndex": null
            },
            "splitArea": {"show": true, "areaStyle": {"color": ["rgba(250,250,250,0.1)", "rgba(200,200,200,0.1)"]}},
            "splitLine": {"lineStyle": {"color": ["#eee"], "width": 1, "type": "solid"}, "show": true},
            "boundaryGap": [0, 0],
            "splitNumber": 5,
            "show": true,
            "zlevel": 0,
            "z": 0,
            "inverse": false,
            "name": "",
            "nameLocation": "end",
            "nameRotate": null,
            "nameTruncate": {"maxWidth": null, "ellipsis": "...", "placeholder": "."},
            "nameTextStyle": {},
            "nameGap": 15,
            "silent": false,
            "triggerEvent": false,
            "tooltip": {"show": false},
            "axisPointer": {"status": "hide", "value": 1},
            "axisTick": {"show": true, "inside": false, "length": 5, "lineStyle": {"width": 1}},
            "axisLabel": {
                "show": true,
                "inside": false,
                "rotate": 0,
                "showMinLabel": null,
                "showMaxLabel": null,
                "margin": 8,
                "fontSize": 12
            },
            "offset": 0,
            "type": "time",
            "data": time,
            min: function (value) {
                return value.min - 60 * 30 * 1000 / 2;
            },
            max: function (value) {
                return value.max + 60 * 30 * 1000 / 2;
            },
            "rangeEnd": null,
            "rangeStart": null
        }],
        "grid": [{
            "top": "15%",
            "left": "0.5%",
            "right": "0.5%",
            "bottom": "5%",
            "containLabel": true,
            "show": false,
            "borderColor": "#eee",
            "zlevel": 0,
            "z": 0,
            "backgroundColor": "rgba(0,0,0,0)",
            "borderWidth": 1
        }],
        "series": [{
            "name": "24小时攻击次数告警趋势图",
            "type": "bar",
            "data": rdata,
            "zlevel": 0,
            "z": 2,
            "coordinateSystem": "cartesian2d",
            "legendHoverLink": true,
            "barMinHeight": 0,
            "barMinAngle": 0,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#FFFFFF'
                    }, {
                        offset: 0.25,
                        color: '#2996DB'
                    }, {
                        offset: 1,
                        color: '#2C5485'
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    shadowBlur: 20
                }
            },
        }],
        "markArea": [{
            "zlevel": 0,
            "z": 1,
            "tooltip": {"trigger": "item"},
            "animation": false,
            "label": {"normal": {"show": true, "position": "top"}, "emphasis": {"show": true, "position": "top"}},
            "itemStyle": {"normal": {"borderWidth": 0}}
        }],
        "markLine": [{
            "zlevel": 0,
            "z": 5,
            "symbol": ["circle", "arrow"],
            "symbolSize": [8, 16],
            "precision": 2,
            "tooltip": {"trigger": "item"},
            "label": {"normal": {"show": true, "position": "end"}, "emphasis": {"show": true}},
            "lineStyle": {"normal": {"type": "dashed"}, "emphasis": {"width": 3}},
            "animationEasing": "linear"
        }],
        "markPoint": [{
            "zlevel": 0,
            "z": 5,
            "symbol": "pin",
            "symbolSize": 50,
            "tooltip": {"trigger": "item"},
            "label": {"normal": {"show": true, "position": "inside"}, "emphasis": {"show": true}},
            "itemStyle": {"normal": {"borderWidth": 2}}
        }],
        "marker": [],
        "visualMap": [],
        "dataZoom": [],
        "brush": [],
        "legend": [{
            "left": "center",
            "top": "top",
            "padding": [20, 10, 10, 10],
            "zlevel": 0,
            "z": 4,
            "show": true,
            "orient": "horizontal",
            "align": "auto",
            "backgroundColor": "rgba(0,0,0,0)",
            "borderColor": "#ccc",
            "borderRadius": 0,
            "borderWidth": 0,
            "itemGap": 10,
            "itemWidth": 25,
            "itemHeight": 14,
            "inactiveColor": "#ccc",
            "textStyle": {"color": "#333"},
            "selectedMode": true,
            "tooltip": {"show": false},
            "right": null,
            "bottom": null,
            "selected": {}
        }]
    };

    $scope.click = function () {

    }

});