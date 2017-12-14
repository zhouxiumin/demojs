function recoImg(cvsIn, resname, debug) {
    var context = cvsIn.getContext('2d');
    var canvasData = context.getImageData(0, 0, cvsIn.width, cvsIn.height);
    var width = canvasData.width;
    var height = canvasData.height;
    //灰度化
    grayProcessing(canvasData);


    var sobelData = Sobel(canvasData);
    var sobelImageData = sobelData.toImageData();
    var canvas,ctx;
    if (debug) {
        canvas = document.getElementById('test1');
        ctx = canvas.getContext('2d');
        ctx.putImageData(sobelImageData, 0, 0);
    }

    var algo11 = OTSUAlgorithm(sobelImageData);//存储结果
    sobelImageData = algo11[0];

    // 处理阴影
    var searchSobel = BFSearch(sobelImageData);
    var clusterSobel = searchSobel[0];
    var seqSobel = searchSobel[1];
    var setsSobel = genSets(clusterSobel,seqSobel,width,height);
    setsSobel.filterSobelSimple();
    if(setsSobel.length<=2){
        if(setsSobel.length<=1){
            $(resname).text("unable to parse Image");
            return;
        }
        console.log("finish filter sobel");
    }else{
        console.log("continue filter sobel");
        setsSobel.SelectAreaSobel()
    }

    //得到数字区域的大小：
    var digialArea = setsSobel.data[1].area;
    setsSobel.show(true);

    clusterSobel = setsSobel.fillSobel();
    var mask = setsSobel.getMask(clusterSobel);
    //drawCluster(clusterSobel, "ctx", seqSobel);
    //做掩码，把不需要的去掉
    maskImage(canvasData,mask,width,height);
    var algo = OTSUAlgorithm(canvasData);//存储结果
    canvasData = algo[0];
    if (debug) {
        canvas = document.getElementById('test1');
        ctx = canvas.getContext('2d');
        ctx.putImageData(canvasData, 0, 0);
        drawCluster(clusterSobel, "test", seqSobel);
    }

    var searchResult = BFSearchWithMask(canvasData,mask);
    var cluster = searchResult[0];
    var seq = searchResult[1];
    var sets = genSets(cluster, seq, width, height);
    //sets.show(false);
    sets.filter();
    //sets.show(true);
    sets.merge();
    sets.sort();
    //sets.show(true);
    var results = sets.reco(digialArea);
    cluster = sets.toCluster();

    drawCluster(cluster, "ctx", seq);
    //console.log("seq: "+seq)

    $(resname).text(results);
    //context.putImageData(canvasData, 0, 0); // at coords 0,0
}

function BFSearch(canvasData){
    var width = canvasData.width;
    var height = canvasData.height;
    var matrix = {
        "size": {"width": width, "height": height}
    };
    matrix.data = new Array(height * width);
    var flags = new Array(height * width);
    var cluster = new Array(height * width);
    var i, j,ids;
    for (i = 0; i < canvasData.height; i++) {
        for (j = 0; j < canvasData.width; j++) {
            ids = j + i * canvasData.width;
            var point = canvasData.data[ids * 4];
            matrix.data[ids] = (point == 0) ? 1 : 0;
            cluster[ids] = matrix.data[ids];
            flags[ids] = false;
        }
    }

    var seq = 0;
    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    var queue = [];
    //宽度优先搜索
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            ids = j + i * width;
            if (matrix.data[ids] == 1 && !flags[ids]) {
                seq++;
                flags[ids] = true;
                cluster[ids] = seq;
                queue.push([i, j]);
                while (queue.length != 0) {
                    var k, nj, ni, nids;
                    var pot = queue.shift();
                    for (k = 0; k < 4; k++) {
                        ni = pot[0] + dirs[k][0];
                        nj = pot[1] + dirs[k][1];
                        nids = nj + ni * width;
                        if ((ni < height) && (ni >= 0) && (nj < width) && (nj >= 0) && (matrix.data[nids] == 1) && (!flags[nids])) {
                            flags[nids] = true;
                            cluster[nids] = seq;
                            queue.push([ni, nj]);
                        }
                    }
                }
            }
        }
    }
    return [cluster, seq];
}

function BFSearchWithMask(canvasData,mask){
    var width = canvasData.width;
    var height = canvasData.height;
    var matrix = {
        "size": {"width": width, "height": height}
    };
    matrix.data = new Array(height * width);
    var flags = new Array(height * width);
    var cluster = new Array(height * width);
    var i, j,ids;
    for (i = 0; i < canvasData.height; i++) {
        for (j = 0; j < canvasData.width; j++) {
            ids = j + i * canvasData.width;
            var point = canvasData.data[ids * 4];
            var mk = mask[ids];
            matrix.data[ids] = (point == 0 &&mk==255) ? 1 : 0;
            cluster[ids] = matrix.data[ids];
            flags[ids] = false;

        }
    }

    var seq = 0;
    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    var queue = [];
    //宽度优先搜索
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            ids = j + i * width;
            if (matrix.data[ids] == 1 && !flags[ids]) {
                seq++;
                flags[ids] = true;
                cluster[ids] = seq;
                queue.push([i, j]);
                while (queue.length != 0) {
                    var k, nj, ni, nids;
                    var pot = queue.shift();
                    for (k = 0; k < 4; k++) {
                        ni = pot[0] + dirs[k][0];
                        nj = pot[1] + dirs[k][1];
                        nids = nj + ni * width;
                        if ((ni < height) && (ni >= 0) && (nj < width) && (nj >= 0) && (matrix.data[nids] == 1) && (!flags[nids])) {
                            flags[nids] = true;
                            cluster[nids] = seq;
                            queue.push([ni, nj]);
                        }
                    }
                }
            }
        }
    }
    return [cluster, seq];
}

function drawCluster(cluster, canvasname, seqnum) {
    var canvascluster = document.getElementById(canvasname);
    var ctx = canvascluster.getContext('2d');
    var canvasData = ctx.getImageData(0, 0, canvascluster.width, canvascluster.height);
    var i, j;
    var cor = new Array(seqnum + 1);
    for (i = 0; i <= seqnum; i++) {
        cor[i] = {};
        cor[i].x = rand255();
        cor[i].y = rand255();
        cor[i].z = rand255();
    }
    cor[0].x = 255;
    cor[0].y = 255;
    cor[0].z = 255;
    for (i = 0; i < canvasData.height; i++) {
        for (j = 0; j < canvasData.width; j++) {
            var ids = j + i * canvasData.width;
            canvasData.data[ids * 4 ] = cor[cluster[ids]].x;
            canvasData.data[ids * 4 + 1] = cor[cluster[ids]].y;
            canvasData.data[ids * 4 + 2] = cor[cluster[ids]].z;
            canvasData.data[ids * 4 + 3] = 255;
        }
    }
    ctx.putImageData(canvasData, 0, 0);
}

function rand255() {
    return parseInt(Math.random() * 255);
}

function genSets(cluster, seq, width, height) {
    var sets = new dotSets(seq, width, height);
    sets.init();
    var i, j, ids;
    var ds;
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            ids = j + i * width;
            ds = sets.data[cluster[ids]];
            ds.data.push([j, i]);//i是高，j是宽
        }
    }
    sets.flush();
    return sets;
}

function maskImage(canvasData,mask,width,height){
    var i, j, k,gray;
    for(i=0;i<height;i++){
        for(j=0;j<width;j++){
            k = j+ i*width;
            gray = canvasData.data[4*k]&mask[k];
            canvasData.data[4*k]=gray;
            canvasData.data[4*k+1]=gray;
            canvasData.data[4*k+2]=gray;
        }
    }
}

//集合
function dotSets(length, width, height) {
    this.length = length + 1;
    this.data = new Array(length + 1);
    this.width = width;
    this.height = height;
    this.init = function () {
        var k;
        for (k = 0; k < this.data.length; k++) {
            this.data[k] = new dataSet(width, height);
        }
    };
    this.flush = function () {
        var k;
        for (k = 0; k < this.length; k++) {
            this.data[k].flush();
        }
    };
    // 过滤区域
    this.filter = function () {
        var len = this.length;
        var i, pos;
        pos = len - 1;
        for (i = len - 1; i > 0; i--) {
            var dataset = this.data[i];
            var condition = false;
            condition = condition || dataset.length < 10;   //点少于10个
            condition = condition || dataset.areaWidth > (width * 2 / 3);
            condition = condition || dataset.areaWidth < 3;
            condition = condition || dataset.areaHeight < 3;
            condition = condition || dataset.isnoise;
            condition = condition || (dataset.length < 30 && dataset.area[3] < (this.height) / 2);
            if (condition) {
                this.swap(i, pos);
                pos--;
            }
        }
        if (pos + 1 < len) {
            this.data.splice(pos + 1, len - pos - 1);
            this.length = this.data.length;
        }
    };

    this.filterSobelSimple = function(){
        var len = this.length;
        var i, pos;
        pos = len - 1;
        for (i = len - 1; i > 0; i--) {
            var dataset = this.data[i];
            var condition = false;
            condition = condition || dataset.length < 100;   //点少于100个
            condition = condition || dataset.areaHeight <(this.height/2);
            condition = condition || dataset.areaWidth <(this.width/3);
            if (condition) {
                this.swap(i, pos);
                pos--;
            }
        }
        if (pos + 1 < len) {
            this.data.splice(pos + 1, len - pos - 1);
            this.length = this.data.length;
        }
    };

    this.SelectAreaSobel = function(){
        var len = this.length;
        if(len<=2){
            return;
        }
        var i, count;
        var maxCount = -1,maxIndex = 0;
        var y = height/2;
        var starX = width/3;
        var endX = width*2/3;
        for(i=1;i<len;i++){
            count = this.data[i].counthorizontal(y,starX,endX);
            if(count>maxCount){
                maxCount = count;
                maxIndex = i;
            }
        }
        this.swap(1,maxIndex);
        this.data.splice(2,len-2);
        this.length = this.data.length;

    };

    //线段合并
    this.merge = function () {
        var dotT = 50;//点的阈值，小于这个值的表示点
        var uf = new unionfind(this.length);
        uf.init();
        var flags = new Array(this.width);
        var i, j, left, right;
        for (i = 0; i < flags.length; i++) {
            flags[i] = 0;
        }
        var data = this.data;
        var dataset;
        //合并线段集合，去掉背景
        for (i = 1; i < data.length; i++) {
            dataset = data[i];
            if (dataset.length < dotT) {
                continue;
            }
            left = dataset.area[0];
            right = dataset.area[1];
            for (j = left; j <= right; j++) {
                if (flags[j] == 0) {
                    flags[j] = i;
                } else {
                    uf.union(i, flags[j]);
                    flags[j] = i;
                }
            }
        }
        var id = uf.id;
        for (i = 1; i < id.length; i++) {
            if (id[i] != i) {
                this.data[id[i]].data = this.data[id[i]].data.concat(this.data[i].data);
                this.data[i].data = [];
            }
        }
        this.flush();
        this.filter();
        //console.log("merge: "+uf.id+" count"+uf.count);
    };

    // 排序集合，使得集合从左到右
    this.sort = function () {
        var i, j;
        var len = this.length;
        for (i = 0; i < len; i++) {
            for (j = 0; j < len - i - 1; j++) {
                if (this.data[j].area[0] > this.data[j + 1].area[0]) {
                    this.swap(j, j + 1);
                }
            }
        }
    };

    this.swap = function (n, pos) {    //交换两个区域
        if (n != pos)  {
            var temp = this.data[n];
            this.data[n] = this.data[pos];
            this.data[pos] = temp;
        }
    };

    this.reco = function (digialArea) {
        var i, results = '';
        for (i = 1; i < this.length; i++) {
            results += this.data[i].recoNum(digialArea);
        }
        return results;
    };
    //将集合转换为聚类
    this.toCluster = function(){
        var cluster = new Array(this.height * this.width);
        var len = this.length;
        var i, j, k, x, y;
        k = cluster.length;
        for (i = 0; i < k; i++) {
            cluster[i] = 0;
        }
        for (i = 0; i < len; i++) {
            var datalen = this.data[i].length;
            var data = this.data[i].data;
            for (j = 0; j < datalen; j++) {
                x = data[j][0];
                y = data[j][1];
                cluster[x + y * this.width] = i;
            }
        }
        return cluster;
    };
    this.fillSobel=function(){
        var cluster = new Array(this.height * this.width);
        var i, j, k, x, y;
        k = cluster.length;
        for (i = 0; i < k; i++) {
            cluster[i] = 0;
        }
        var dataset = this.data[1];
        var datalen = this.data[1].length;
        var data = this.data[1].data;
        for(j=0;j<datalen;j++){
            x = data[j][0];
            y = data[j][1];
            cluster[x + y * this.width] = 1;
        }
        var minW=dataset.area[0], maxW=dataset.area[1], minH=dataset.area[2], maxH=dataset.area[3];
        var startW,endW,ids;
        for(i=minH;i<=maxH;i++){
            startW = maxW;endW =minW;
            for(j=minW;j<=maxW;j++){
                ids = j+i*this.width;
                if(cluster[ids]==1 ){
                    startW = j;
                    break;
                }//if cluster
            }// for j
            for(j=maxW;j>=minW;j--){
                ids = j+i*this.width;
                if(cluster[ids]==1 ){
                    endW = j;
                    break;
                }//if cluster
            }// for j
            for(j=startW;j<=endW;j++){
                ids = j+i*this.width;
                cluster[ids]=1;
            }
        }//for i
        return cluster;
    };

    this.getMask = function(cluster){
        var mask;
        if(cluster){
            mask = cluster.slice(0);
        }else{
            mask = this.fillSobel();
        }
        var i;
        for(i=0;i<mask.length;i++){
            if(mask[i]==1){
                mask[i]=255;
            }
        }
        return mask;
    };

    this.show = function (debug) {       //显示集合的信息
        console.log("sets info: " + (this.length-1));
        if (debug) {
            var i;
            for (i = 1; i < this.data.length; i++) {
                this.data[i].show();
            }
        }
    };
}

//相同颜色点的集合
function dataSet(width, height) {
    this.data = [];//相同颜色的集合，(x,y)
    this.length = 0;
    this.areaWidth = 0;
    this.areaHeight = 0;
    this.width = width;
    this.height = height;
    this.area = [];
    this.record = [];
    this.isnoise = false;
    this.flush = function () {
        this.length = this.data.length;
        var len = this.length;
        this.area = [];
        this.record = [];
        this.areaHeight = 0;
        this.areaWidth = 0;
        var i, pot;
        var x, y;
        //console.log("datalenth: "+this.length);
        if (this.length == 0) {
            return;
        }
        pot = this.data[0];
        var maxW = pot[0], minW = pot[0], maxH = pot[1], minH = pot[1];
        var maxWs = pot, minWs = pot, maxHs = pot, minHs = pot;
        for (i = 1; i < len; i++) {
            pot = this.data[i];
            x = pot[0];
            y = pot[1];
            if (x > maxW) {
                maxW = x;
                maxWs = i;
            } else if (x < minW) {
                minW = x;
                minWs = i;
            }
            if (y > maxH) {
                maxH = y;
                maxHs = i;
            } else if (y < minH) {
                minH = y;
                minHs = i;
            }
        }
        this.areaHeight = maxH - minH + 1;
        this.areaWidth = maxW - minW + 1;
        this.area.push(minW, maxW, minH, maxH);
        this.record.push(maxWs, minWs, maxHs, minHs);
        //console.log("area: "+this.areaWidth+" "+this.areaHeight);
        this.check();
    };

    this.show = function () {
        var txt = "dataset: " + this.areaWidth + " " + this.areaHeight;
        txt += " size: " + this.data.length;
        txt += " area:" + this.area;
        console.log(txt);
    };

    this.check = function () {
        var xcol = new Array(this.width);
        var ycol = new Array(this.height);
        var i, x, y, pot;
        for (i = 0; i < xcol.length; i++) {
            xcol[i] = 0;
        }
        for (i = 0; i < ycol.length; i++) {
            ycol[i] = 0;
        }
        var len = this.data.length;
        for (i = 0; i < len; i++) {
            pot = this.data[i];
            x = pot[0];
            y = pot[1];
            xcol[x]++;
            ycol[y]++;
        }

        var thx = width * 90 / 100;
        var thy = height * 90 / 100;
        for (i = 0; i < xcol.length; i++) {
            if (xcol[i] >= thx) {
                this.isnoise = true;
                return;
            }
        }
        for (i = 0; i < ycol.length; i++) {
            if (ycol[i] >= thy) {
                this.isnoise = true;
                return;
            }
        }
    };

    this.recoNum = function (digialArea) {
        var y0, numHeight, x0, numWidth;
        y0 = this.area[2];
        x0 = this.area[0];
        numHeight = this.areaHeight;
        numWidth = this.areaWidth;
        /* ---------------------------七段识别-------------------------------------------------
         高度（行）分三段，竖分两段  x0记录横的起始位置，
         * */
        var resultNum = "";
        //七段码一段的长度
        var heightY0 = y0;
        var heightY1 = Math.floor(y0 + 1 / 3 * numHeight);
        var heightY2 = Math.floor(y0 + 2 / 3 * numHeight);
        var heightY3 = Math.floor(y0 + numHeight);

        var r = this.areaHeight / this.areaWidth;
        var minH = digialArea[2], maxH = digialArea[3];
        if (this.areaHeight<(maxH-minH+1)/2) {
            /*最大像素值大于一个段宽区分小数点和1*/
            if(y0>(minH+maxH)/2){
                resultNum = '.';
            }
        } else if (r > 4) {
            resultNum = '1';
        } else {
            //数字识别串
            var restultStr = "";
            var constantX = Math.floor(x0 + 0.5 * numWidth); //常量，for控制
            //A值
            restultStr += this.judgeZeroOrOneX(constantX, heightY0, heightY1);
            //B值
            restultStr += this.judgeZeroOrOneX(constantX, heightY1, heightY2);
            //c值
            restultStr += this.judgeZeroOrOneX(constantX, heightY2, heightY3);
            //D、E都是heightY1的纵坐标，F、G是heightY2纵坐标

            var startX1 = Math.floor(x0 + 0.5 * numWidth);
            var startX2 = Math.floor(parseInt(x0) + parseInt(numWidth));
            //D值
            restultStr += this.judgeZeroOrOneY(heightY1, x0, startX1);
            //E值
            restultStr += this.judgeZeroOrOneY(heightY1, startX1, startX2);
            //F值
            restultStr += this.judgeZeroOrOneY(heightY2, x0, startX1);
            //G值
            restultStr += this.judgeZeroOrOneY(heightY2, startX1, startX2);
            //alert(restultStr);
            resultNum = this.resultRecognition(restultStr);
        }
        return resultNum;
    };

    this.judgeZeroOrOneX = function (x, startY, endY) {
        //x不变，y变
        var calCloumnNum = 0;
        var i, pot;
        for (i = 0; i < this.length; i++) {
            pot = this.data[i];
            if (pot[0] == x && (pot[1] <= endY) && (pot[1] >= startY)) {
                calCloumnNum++;
            }
        }

        if (calCloumnNum > 1) {
            return "1";
        } else {
            return "0";
        }
    };
    // 查看水平位置
    this.counthorizontal = function(y,startX,endX){
        var calRowsNum = 0;
        var i, pot;
        for (i = 0; i < this.length; i++) {
            pot = this.data[i];
            if (pot[1] == y && (pot[0] <= endX) && (pot[0] >= startX)) {
                calRowsNum++;
            }
        }
        return calRowsNum;
    };

    this.judgeZeroOrOneY = function (y, startX, endX) {
        //y不变，x变
        //alert("y:"+y+",startX:"+startX+",endX:"+endX);
        var calRowsNum = 0;
        var i, pot;
        for (i = 0; i < this.length; i++) {
            pot = this.data[i];
            if (pot[1] == y && (pot[0] <= endX) && (pot[0] >= startX)) {
                calRowsNum++;
            }
        }
        //alert(calCloumnNum);
        if (calRowsNum > 1) {
            return "1";
        } else {
            return "0";
        }
    };

    this.resultRecognition = function (recognitionNum) {
        var returnNum;
        //2,5不在此处理
        switch (recognitionNum) {
            //0
            case "1011111":
                returnNum = 0;
                break;
            //1
            case "0000101":
                returnNum = 1;
                break;
            //2
            case "1110110":
                returnNum = 2;
                break;
            //3
            case "1110101":
                returnNum = 3;
                break;
            //4
            case "0101101":
                returnNum = 4;
                break;
            //5
            case "1111001":
                returnNum = 5;
                break;
            //6
            case "1111011":
                returnNum = 6;
                break;
            //7
            case "1000101":
                returnNum = 7;
                break;
            case "1001101":
                returnNum = 7;
                break;
            //8
            case '1111111':
                returnNum = 8;
                break;
            //9
            case "1111101":
                returnNum = 9;
                break;
            default:
                returnNum = 'N'; //无法识别
        }
        return returnNum;
    }


}

//并查集
function unionfind(n) {
    this.id = new Array(n);
    this.count = n;
    this.sz = new Array(n);
    this.init = function () {
        var i;
        for (i = 0; i < this.count; i++) {
            this.id[i] = i;
            this.sz[i] = 1;
        }
    };

    this.find = function (p) {
        while (p != this.id[p]) {
            this.id[p] = this.id[this.id[p]];
            p = this.id[p];
        }
        return p;
    };

    this.union = function (p, q) {
        var i = this.find(p);
        var j = this.find(q);
        if (i == j) {
            return;
        }
        if (this.sz[i] < this.sz[j]) {
            this.id[i] = j;
            this.sz[j] += this.sz[i];
        } else {
            this.id[j] = i;
            this.sz[i] += this.sz[j];
        }
        this.count--;
    };
}

//灰度化
function grayProcessing(canvasData) {
    var i, j, ids, gray;
    for (i = 0; i < canvasData.height; i++) {
        for (j = 0; j < canvasData.width; j++) {
            ids = (j + i * canvasData.width) * 4;
            gray = parseInt(0.30 * canvasData.data[ids] + 0.59 * canvasData.data[ids + 1] + 0.11 * canvasData.data[ids + 2]);
            canvasData.data[ids + 0] = gray;
            canvasData.data[ids + 1] = gray;
            canvasData.data[ids + 2] = gray;
        }
    }
}

function showOnCanvas(data, canvasname) {
    var canvas = document.getElementById(canvasname);
    var ctx = canvas.getContext('2d');
    ctx.putImageData(data, 0, 0);
}