//一维OTSU图像处理算法
function OTSUAlgorithm(canvasData) {

    var returnResult = new Array(3);
    var m_pFstdHistogram = new Array(); //表示灰度值的分布点概率
    var m_pFGrayAccu = new Array(); //其中每一个值等于m_pFstdHistogram中从0到当前下标值的和
    var m_pFGrayAve = new Array(); //其中每一值等于m_pFstdHistogram中从0到当前指定下标值*对应的下标之和
    var m_pAverage = 0; //值为m_pFstdHistogram【256】中每一点的分布概率*当前下标之和
    var m_pHistogram = new Array(); //灰度直方图
    var i, j;
    var temp = 0,
        fMax = 0; //定义一个临时变量和一个最大类间方差的值
    var nThresh = 0; //最优阀值
    //初始化各项参数
    for (i = 0; i < 256; i++) {
        m_pFstdHistogram[i] = 0;
        m_pFGrayAccu[i] = 0;
        m_pFGrayAve[i] = 0;
        m_pHistogram[i] = 0;
    }
    //获取图像信息


    //获取图像的像素
    var pixels = canvasData.data;
    //下面统计图像的灰度分布信息
    for (i = 0; i < pixels.length; i += 4) {
        //获取r的像素值，因为灰度图像，r=g=b，所以取第一个即可
        var r = pixels[i];
        m_pHistogram[r] ++;
    }

    //下面计算每一个灰度点在图像中出现的概率
    var size = canvasData.width * canvasData.height;
    for (i = 0; i < 256; i++) {
        m_pFstdHistogram[i] = m_pHistogram[i] / size;
    }
    //下面开始计算m_pFGrayAccu和m_pFGrayAve和m_pAverage的值
    for (i = 0; i < 256; i++) {
        for (j = 0; j <= i; j++) {
            //计算m_pFGaryAccu[256]
            m_pFGrayAccu[i] += m_pFstdHistogram[j];
            //计算m_pFGrayAve[256]
            m_pFGrayAve[i] += j * m_pFstdHistogram[j];
        }
        //计算平均值
        m_pAverage += i * m_pFstdHistogram[i];
    }
    //alert("m_pFstdHistogram:"+m_pFstdHistogram);
    //下面开始就算OSTU的值，从0-255个值中分别计算ostu并寻找出最大值作为分割阀值
    for (i = 0; i < 256; i++) {
        temp = (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i]) * (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i]) / (m_pFGrayAccu[i] * (1 - m_pFGrayAccu[i]));
        if (temp > fMax) {
            fMax = temp;
            nThresh = i;
        }
    }
    //mat为矩阵，存黑色为1，白色为0，为数字识别服务
    var mat = new Array();
    var countX = new Array();
    //黑白化之后进行数字黑背景区分，0，255两数，如果数字出现次数多就是背景，否则就是数字
    var blackLength = 0;

    //下面执行二值化过程
    for (i = 0; i < canvasData.width; i++) {
        for (j = 0; j < canvasData.height; j++) {
            var ids = (i + j * canvasData.width) * 4;
            //取得像素的R分量的值
            var r = canvasData.data[ids];
            //与阀值进行比较，如果小于阀值，那么将改点置为0，否则置为255
            //var gray = r > nThresh ? 255 : 0;
            var gray;
            if (r > nThresh) { //255白色
                gray = 255;
            } else { //0黑色
                gray = 0;
                blackLength++;
            }
            canvasData.data[ids + 0] = gray;
            canvasData.data[ids + 1] = gray;
            canvasData.data[ids + 2] = gray;
            //边缘的量像素直接处理为0
            if (i < 2 || j < 2 || i > (canvasData.width - 2) || j > (canvasData.height - 2)) {
                canvasData.data[ids + 0] = 255;
                canvasData.data[ids + 1] = 255;
                canvasData.data[ids + 2] = 255;
            }
        }
    }
    //显示二值化图像
    returnResult[0] = canvasData;
    returnResult[1] = countX;
    returnResult[2] = mat;
    return returnResult;
}


function makeHistogram(image_data)
{
    console.log('histogram executed...');

    var  data = image_data.data
    var histogram = new Array(256);

    // proses pembentukan histogram
    for (var idx = 0; idx <  histogram.length; idx ++ )
    {
        histogram[idx] = 0;
    }

    for (var idx=0; idx < data.length; idx+=4) {
        r = parseInt(data[idx]);
        histogram[r] = histogram[r] + 1;
    }
    return histogram;
}

function equalization(image_data, histogram)
{
    console.log('equalization executed...');
    var d = image_data.data
    var alpha = 255 / (image_data.width * image_data.height);
    var temp_histogram = new Array(256);

    // proses pembentukan histogram ekualisasi
    for (var idx = 0; idx <  temp_histogram.length; idx ++ )
    {
        temp_histogram[idx] = 0;
    }

    // bug
    temp_histogram[0] = Math.round(alpha * histogram[0]);

    for (var i = 0; i < temp_histogram.length - 1; i++)
    {
        temp_histogram[i+1] = temp_histogram[i] + Math.round(alpha * histogram[i+1]);
    }

    console.log('processingg histogram...');

    // proses penggantian warna
    for (var i=0; i<d.length; i+=4) {

        var r = d[i];

        var v = temp_histogram[r];

        d[i] = d[i+1] = d[i+2] = v;
    }
    return d;
}

//直方图均衡化函数
function processHistogramOperation (image_data)
{

    console.log('processHistogramOperation is executed...');
    var histogram = makeHistogram(image_data);

    equalization(image_data, histogram);

}



