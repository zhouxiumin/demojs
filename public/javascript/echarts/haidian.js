/**
 * Created by Xiumin on 2017/12/14.
 */
$.get('/server/haidian.json', function (haidianJson) {
// $.get('/server/140300.json', function (haidianJson) {
    echarts.registerMap('haidian', haidianJson);
    var chart = echarts.init(document.getElementById('main'));
    chart.setOption({
        backgroundColor: '#2f6297',
        title : {
            text: '各地区状态统计',
            left: 'left',
            textStyle : {
                color: '#fff'
            }
        },
        series: [{
            type: 'map',
            map: 'haidian'
        }]
    });
});