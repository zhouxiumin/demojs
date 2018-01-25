app.directive('riskScoreMake', [
    'Util',
    '$echarts',
    '$rootScope',
    'BinhaihulianwangService',
    function (Util, $echarts, $rootScope, BinhaihulianwangService) {
        return {
            restrict: 'E',
            template: '<div style="height: 100%; width: 100%;" class="global-map" echarts="mapChart.id" config="mapChart.config" ec-resize></div>',
            scope: {
                param: '='
            },
            controller: function($scope, $element) {
                Object.assign($scope, {
                    // 地图
                    mapChart: {
                        id: Util.uuid(),
                        config:{
                            theme: 'g2',
                            backgroundColor: 'transparent',
                            loading: {
                                maskColor: "transparent",
                                color: 'rgba(0,0,0,0)'
                            },
                            textColor: '#d6d4d4',
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            title: {
                                "subtext": '整体风险评分',
                                "x": '46%',
                                "y": '29%',
                                textAlign: "center",
                                "textStyle": {
                                    "fontWeight": 'bold',
                                    "fontSize": 30,
                                    "color": '#fff'
                                },
                                "subtextStyle": {
                                    "fontWeight": 'bold',
                                    "fontSize": 12,
                                    "color": '#fff'
                                }
                            },
                            series: [
                                {
                                    "name": ' ',
                                    "type": 'pie',
                                    "radius": ['50%', '70%'],
                                    "avoidLabelOverlap": false,
                                    "startAngle": 225,
                                    "color": [new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [{
                                        offset: 0,
                                        color: '#FFFFFF'
                                    }, {
                                        offset: 0.5,
                                        color: '#2996DB'
                                    }, {
                                        offset: 0.75,
                                        color: '#508DFF'
                                    }],false), "transparent"],
                                    "hoverAnimation": false,
                                    "legendHoverLink": false,
                                    "label": {
                                        "normal": {
                                            "show": false,
                                            "position": 'center'
                                        },
                                        "emphasis": {
                                            "show": true,
                                            "textStyle": {
                                                "fontSize": '30',
                                                "fontWeight": 'bold'
                                            }
                                        }
                                    },
                                    "labelLine": {
                                        "normal": {
                                            "show": false
                                        }
                                    },
                                    "data": [{
                                        "value": 75,
                                        "name": '1'
                                    }, {
                                        "value": 25,
                                        "name": '2'
                                    }]
                                },
                                {
                                    "name": '',
                                    "type": 'pie',
                                    "radius": ['50%', '70%'],
                                    "avoidLabelOverlap": false,
                                    "startAngle": 315,
                                    "color": ["#757575", "transparent"],
                                    "hoverAnimation": false,
                                    "legendHoverLink": false,
                                    "clockwise": false,
                                    "itemStyle":{
                                        "normal":{
                                            "borderColor":"transparent",
                                        },
                                        "emphasis":{
                                            "borderColor":"transparent",
                                        }
                                    }
                                    ,
                                    "z":10,
                                    "label": {
                                        "normal": {
                                            "show": false,
                                            "position": 'center'
                                        },
                                        "emphasis": {
                                            "show": true,
                                            "textStyle": {
                                                "fontSize": '30',
                                                "fontWeight": 'bold'
                                            }
                                        }
                                    },
                                    "labelLine": {
                                        "normal": {
                                            "show": false
                                        }
                                    },
                                    "data": [{
                                        // "value": (100 - value1) * 266 / 360,
                                        "name": ''
                                    }, {
                                        // "value": 100 - (100 - value1) * 266 / 360,
                                        "name": ''
                                    }
                                    ]
                                }

                            ],
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            }
                        },
                        load(param) {
                            let _this = this;
                            let value = 70,
                                value_ = (100 - value) * 270 / 360;
                            _this.config.title.text = value;
                            _this.config.series[1].data[0].value = value_;
                            _this.config.series[1].data[1].value = 100 - value_;

                            $echarts.queryEchartsInstance(_this.id).then(function (instance) {
                                instance.resize();
                                instance.setOption(_this.config);
                            });

                        }
                    }
                });
                // $scope.mapChart.load($scope.param);
            },
            link:function (scope) {
                scope.mapChart.load(scope.param);
            }
        }
    }
]);
