$(document).ready(function() {
   
    var step  = 0;

    var baseCanvas = $('#baseCanvas')[0];
   
    if (!baseCanvas.getContext) { return; }
    
    var baseCtx = baseCanvas.getContext('2d');

    var FONTIMAGE_DIR = SCRIPT_ROOT + '/static/images/training/';
    var imageInfo = IMAGEDATA[ITEMID];
    var imageName = imageInfo['imageName'];

    var baseImage = new Image();
    baseImage.src = FONTIMAGE_DIR + imageName;
    baseCanvas.setAttribute('width', baseImage.width);
    baseCanvas.setAttribute('height', baseImage.height);
    $(baseImage).load(function() {
        baseCtx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);
        var boundingBoxes = imageInfo['imageData']['data'];
        var bboxNo = 1; 
        for (var bbox in boundingBoxes) {
           var bboxData = boundingBoxes[bbox];
           baseCtx.strokeStyle = "#ff0";
           baseCtx.strokeRect(bboxData[0], bboxData[1], bboxData[2], bboxData[3]); 
           
           var canvasOffset = $('#baseCanvas').offset();
           var bboxOffset = 15; //px How much below the bbox do we want the textbox
           var bboxLetterLeft = canvasOffset.left + bboxData[0];
           var bboxLetterTop = canvasOffset.top + bboxData[1] + bboxOffset;
           var bboxWidth = 15; //px
           var bboxHeight = 15; //px
           var bboxFontSize = 1.5; //em

           $('body').append('<input value="' + bbox + '"' +
                            'style="position: absolute;' +
                            'left:' + bboxLetterLeft + 'px;' +
                            'top:' + bboxLetterTop + 'px;' +
                            'width:' + bboxWidth + 'px;' +
                            'height:' + bboxHeight + 'px;' +
                            'font-size:' + bboxFontSize + 'em;' +
                            '"/>');
        }
    });

    $('#baseCanvas').mousedown(function(e) {
        var curx = e.pageX - this.offsetLeft;
        var cury = e.pageY - this.offsetTop;
        console.log(curx);
        console.log(cury);
        baseCtx.beginPath();
        baseCtx.arc(curx, cury, 5, 0, 2 * Math.PI, true);
        baseCtx.strokeStyle = "#0ff";
        baseCtx.stroke(); 
        baseCtx.closePath();
    });

    var imageData;
    $('#nextBtn').click(function() {
        if (step == 0) {
            baseImageData = baseCanvas.toDataURL();
            $('#message').text('Mark spline control points for the stroke on the base font.');
            step = step + 1;
        }
        else if (step == 1) {
            if (xBase.length > 0) {
                step = step + 1;
                var splinePts = new Array();
                for (var i = 0; i < xBase.length; i++) {
                    splinePts.push(xBase[i]);
                    splinePts.push(yBase[i]);
                }
                drawSpline(baseCtx, splinePts, 0.5, "#f00"); 
                $('#font').fadeTo(200, 1);
                $('#message').text('Erase sections of the selected font not needed in the current stroke.');
            }
        } else if (step == 2) {
            step = step + 1;
            fontImageData = fontCanvas.toDataURL();
            $('#message').text('Mark spline control points for the corresponding stroke in the selected font.');
        } else if (step == 3) {
            if (xFont.length > 0) {
                step = step + 1;
                $.post(SCRIPT_ROOT + '/image/', {
                    baseImageData: baseImageData,
                    fontImageData: fontImageData,
                    xBase: JSON.stringify(xBase),
                    yBase: JSON.stringify(yBase),
                    xFont: JSON.stringify(xFont),
                    yFont: JSON.stringify(yFont)
                });
                var splinePts = new Array();
                for (var i = 0; i < xFont.length; i++) {
                    splinePts.push(xFont[i]);
                    splinePts.push(yFont[i]);
                }
                drawSpline(fontCtx, splinePts, 0.5, "#0ff");
                $('#message').text('We\'re done! Add another stroke, or move on to the next letter.');
                $('#nextBtn').html('Next Stroke &rarr;');
            }
        } else if (step == 4) {
            window.location = BASE_URL + '?charcode=' + ITEMID;   
        }
    });
    
    $('#finishBtn').click(function() {
        window.location = BASE_URL;
    });
});
