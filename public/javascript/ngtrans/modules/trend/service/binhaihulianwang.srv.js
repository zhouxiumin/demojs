'use strict';

/**
 * Created by huangiris on 2018/1/20.
 */

function BinhaihulianwangService($http, $resource, $echarts, Util, $q) {
    let globalOption = $echarts.getEchartsGlobalOption();
    let chartCommonOption = {
        backgroundColor: "transparent",
        loading: {
            maskColor: "#2d2d2d"
        },
        textColor: "#bbbbbb",
        splitLineColor: "#474747",
        splitAreaColor: {
            default: [
                '#2D2D2D', '#2D2D2D'
            ],
            radar: ['#565658', '#504F55']
        }
    };
    let chartCommonConfig = {
        theme: 'g2',
        backgroundColor: 'transparent',
        loading: {
            maskColor: "#2d2d2d",
            color: '#fff'
        },
        textColor: '#d6d4d4',
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        }
    };

    function request(method, url, params) {
        let reqBody = {
            method: method,
            url: url
        };
        method === 'GET'
            ? reqBody.params = params
            : reqBody.data = params;
        return $http(reqBody).then(function (res) {
            return res.data;
        })
    }

    // 模拟数据发送
    function requestMock(method, url, params) {
        let reqBody = {
            method: method,
            url: url
        };
        method === 'GET'
            ? reqBody.params = params
            : reqBody.data = params;
        console.log('begin...');

        let now = new Date();
        let count = [];
        let time = [];

        let start = 1513132488541;
        for (let i=0;i<48;i++){
            let interval= 1000*60*30;
            let rand = Math.floor(20 * Math.random());
            count.push(rand);
            time.push(start + interval * i);
        }

        let res = {
            data:{
                statusCode:0,
                data:{
                    count:count,
                    time:time
                }
            }
        };
        return $q.when(res).then(function (res) {
            return res.data;
        })
    }

    class BinhaihulianwangService {
        getChartCommonOption() {
            return chartCommonOption;
        }

        getChartCommonConfig() {
            return chartCommonConfig;
        }

        // /dashboard/hoursAttackTrend
        getMapAlerts(param) {
            let req = {
                startTime: param.from,
                endTime: param.to
            };

            // let series = [];
            let result = {};//alarm/monitor/alarmAttackMapChartData
            // return request('POST', `/api/node/dashboard/hoursAttackTrend`, req).then(data => {
             return requestMock('POST', `/api/node/dashboard/hoursAttackTrend`, req).then(data => {
                if (data.statusCode !== 0) {
                    Util
                        .msg
                        .error("地图数据请求异常，错误代码：" + data.statusCode);
                } else {

                    return data.data;

                }
            }, error => {
                Util
                    .msg
                    .error("地图数据请求失败，请刷新页面，错误信息：" + error.data);
                return result;
            });
        }

    }
    return new BinhaihulianwangService();
}

app.factory('BinhaihulianwangService', BinhaihulianwangService);

