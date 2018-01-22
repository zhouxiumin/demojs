app.directive("hoursTrend",[
    "Util",
    "$echarts",
    "BinhaihulianwangService",
    function( Util, $echarts, BinhaihulianwangService){
        return{
            restrict:'E',
            scope:{mapParam:'='},
            replace:false,
            template: '<div style="height: 160px;width:100%" echarts="mapChart.id" config="mapChart.config"></div>',
            controller:function ($scope) {
                Object.assign($scope, {
                    // 地图
                    mapChart: {
                        id: Util.uuid(),
                        dimension: '16:2',
                        config: {
                            backgroundColor: 'rgba(0,0,0,0)',
                            grid: {
                                show:false,
                                left: '0.5%',
                                right: '0.5%'
                            },
                            xAxis: {},
                            yAxis: {
                                type: 'value',
                                splitLine: {show: false},
                                splitArea: {"show": false}
                            },
                            series: [{
                                name: '24小时攻击次数告警趋势图',
                                type: 'bar',
                                data: [0]
                            }]
                        },
                        load(param) {
                            let _this = this;
                            // 获取数据
                            BinhaihulianwangService.getMapAlerts(param).then(function (data) {
                                let count = data.count;
                                let time = data.time;

                                let rdata = [];
                                for (let i = 0; i < count.length; i++) {
                                    let item = [time[i], count[i]];
                                    rdata.push(item);
                                }

                                let times = [];
                                for (let t of time) {
                                    times.push({
                                        value: t, textStyle: {
                                            color: 'red'
                                        }
                                    });
                                }
                                let config = {
                                    xAxis: {
                                        // type: 'category',
                                        type: 'time',
                                        splitLine: {show: false},
                                        data: times,
                                        axisLabel: {
                                            textStyle: {
                                                color: '#2996DB'
                                            },
                                            formatter: function (value, index) {
                                                let date = moment(value);
                                                return date.format('H:mm');

                                            }
                                        },
                                        min: function (value) {
                                            return value.min - 60 * 30 * 1000 / 2;
                                        },
                                        max: function (value) {
                                            return value.max + 60 * 30 * 1000 / 2;
                                        }
                                    },
                                    series: [{
                                        name: '24小时攻击次数告警趋势图',
                                        type: 'bar',
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
                                        data: rdata
                                    }]
                                };
                                $echarts.queryEchartsInstance(_this.id).then(function (instance) {
                                    instance.resize();
                                    instance.setOption(config);
                                });

                            });
                        }
                    },
                });
                $scope.mapChart.load($scope.mapParam);
            },
            link:function (scope) {
                console.log(scope);

                scope.$watch('param.time.starTime', function(newVal, oldVal) {
                    scope.mapChart.load(scope.mapParam);
                });
            }
        };
    }]);
