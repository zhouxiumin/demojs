'use strict';

function BinhaihulianwangCtrl($scope, $interval, Util, $echarts, $rootScope, BinhaihulianwangService) {
    $scope.helloWorld = 'hello';
    let systemDate = new Date();
    $scope.param = {
        time: {
            startTime: systemDate,
            endTime: systemDate - 24 * 60 * 60 * 1000
        }
    };

    $scope.showTime = {
        date: getShowTime('date', systemDate),
        week: getShowTime('week', systemDate),
        time: getShowTime('time', systemDate)
    };

    function getShowTime(type, time) {
        if (type === 'date') {
            return time.getFullYear() + '年' + time.getMonth() + 1 + '月' + time.getDate() + '日';
        } else if (type === 'week') {
            switch (time.getDay()) {
                case 1:
                    return '星期一';
                case 2:
                    return '星期二';
                case 3:
                    return '星期三';
                case 4:
                    return '星期四';
                case 5:
                    return '星期五';
                case 6:
                    return '星期六';
                case 7:
                    return '星期日';
                default:
                    return '未知';
            }
        } else if (type === 'time') {
            return time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
        }
    }


}
app.controller('BinhaihulianwangCtrl', BinhaihulianwangCtrl);

