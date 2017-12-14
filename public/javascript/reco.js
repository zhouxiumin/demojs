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