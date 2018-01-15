/**
 * Created by Xiumin on 2018/1/14.
 */

function bits2vector(margins, width, height) {
    var names = {
        0: '汉沽分局',
        1: '生态城分局',
        2: '塘沽分局', // 复杂
        3: '保税分局1',
        4: '高新分局1',
        5: '保税分局2',
        6: '开发分局',
        7: '高新分局2',
        8: '高新分局3',
        9: '开发分局1',
        10: '天津港公安局',
        11: '南疆治安分局',
        12: '天津港公安局(长条)',
        13: '天津港公安局(心型)',
        14: '大港分局', // 复杂
        15: '港中分局',
        16: '开发分局2',
        17: '南港分局'
    };
    var mapInfo = {};
    for (var i = 0; i < margins.length; i++) {
        // if (i === 2 || i === 14) {
        if (false) {
            //复杂地图
        } else {

            var coordinates = margin2coordinates(margins[i], width, height);
            mapInfo[i] = {
                name: names[i],
                coordinates: coordinates
            };
        }
    }
    return mapInfo;
}

function margin2coordinates(margin, width, height) {
    var i, j;
    var ids;

    var ret = [];
    var flags = new Array(height);
    for (i = 0; i < height; i++) {
        flags[i] = new Array(width);
        for (j = 0; j < width; j++) {
            flags[i][j] = false;
        }
    }
    var cors = [];
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            ids = j + i * width;
            if (margin[ids] !== 0 && !flags[i][j]) {
                traverse(margin, flags, width, height, i, j, cors);
                cors.push([cors[0][0],cors[0][1]]);
                var p1,p2,p3;
                var simplyCors = [];
                p1 = cors[0];
                p2 = cors[1];
                for (var k =2;k<cors.length;k++){
                    p3 = cors[k];

                    var isSameLine = false;
                    var dx12 = p2[0] - p1[0];
                    var dy12 = p2[1] - p1[1];

                    var dx23 = p3[0] - p2[0];
                    var dy23 = p3[1] - p2[1];
                    isSameLine = dx12 * dy23 === dx23 * dy12;

                    if (isSameLine){
                        p2 = p3;
                    }else {
                        simplyCors.push(p1);
                        p1 = p2;
                        p2 = p3
                    }
                }
                simplyCors.push(p3);
                // console.log(simplyCors);

                for (var si = 0;si<simplyCors.length;si++) {
                    simplyCors[si][0]  = simplyCors[si][0]/1000 * 1.3+ 10;
                    simplyCors[si][1] = simplyCors[si][1]/(-1000) - 10;
                }
                ret.push(simplyCors);
                cors = [];
            }
        }
    }
    return ret;
}
function traverse(margin, flags, width, height, i, j, cors) {
    // var dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    var dirs = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]];
    cors.push([j, i]);
    flags[i][j] = true;
    var di, dj, dir, ids;
    for (var k = 0; k < dirs.length; k++) {
        dir = dirs[k];
        di = i + dir[0];
        dj = j + dir[1];
        ids = dj + di * width;
        if (di >= 0 && dj >= 0 && di < height && dj < width && margin[ids] !== 0 && !flags[di][dj]) {
            traverse(margin, flags, width, height, di, dj, cors);
        }
    }
}

function converMapInfoToJson(mapInfo) {

    var geojson = {
        "type": "FeatureCollection",
        "features": []
    };
    var count = 120000;
    for (var key in mapInfo) {
        var value = mapInfo[key];
        var item = {
            "type": "Feature",
            "properties": {
                "id": ''+ count,
                "name": value.name,
                "childNum": 1
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": value.coordinates
            }
        };
        geojson.features.push(item);
        count ++;
    }

    return geojson;
}