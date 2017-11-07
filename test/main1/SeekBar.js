/***********************************************
 * SeekBar Class (ver.2017-11-XXTXX:XX)
 * 
 *  <constructor>
 *      new SeekBar(_canvas, _video, _startX, _startY, _endX, _endY)
 * 
 *  <public method>
 *      SeekBar.XXX
 *
 *  <event>
 *      SeekBar.XXX
 * 
***********************************************/

class SeekBar {
    //static get CLOSE() { return "close"; }

    constructor(_canvas, _video, _startX, _startY, _endX, _endY) {
        this.__canvas = _canvas;
        this.__video = _video;
        this.__startX = _startX + 65;
        this.__startY = _startY;
        this.__endX = _endX - 73;
        this.__endY = _endY;
        this.__barWidth = this.__endX - this.__startX;

        //背景のバー
        this.__barBlack = new toile.Line(this.__startX, this.__startY, this.__endX, this.__endY);
        this.__barBlack.lineWidth = 10;
        this.__barBlack.lineColor = "255,255,255";
        this.__barBlack.alpha = 0.15;
        this.__canvas.addChild(this.__barBlack);

        //変化するバー
        this.__barWhite = new toile.Line(this.__startX, this.__startY, this.__endX - this.__barWidth, this.__endY);
        this.__barWhite.lineWidth = 10;
        this.__barWhite.lineColor = "255,255,255"; //"255,0,0";
        this.__barWhite.alpha = 0.8;
        this.__canvas.addChild(this.__barWhite);

        //Time1
        this.__text1 = new toile.Text("0:00:00");
        this.__text1.addWebFont("digital-7", "../common/digital-7.ttf", "truetype");
        this.__text1.font = "digital-7";
        this.__text1.size = 22; //80;
        this.__text1.x = this.__video.x; //38 + 5; //1165; //20;//12;
        this.__text1.y = this.__video.y + this.__video.height + 7; //-3; //-1;
        this.__text1.color = "#ffffff";
        this.__text1.alpha = 0.6;
        this.__canvas.addChild(this.__text1);

        //Time2
        this.__text2 = new toile.Text("-0:00:00");
        this.__text2.addWebFont("digital-7", "../common/digital-7.ttf", "truetype");
        this.__text2.font = "digital-7";
        this.__text2.size = 22; //80;
        this.__text2.x = this.__video.x + this.__video.width - 68; //38 + 5; //1165; //20;//12;
        this.__text2.y = this.__video.y + this.__video.height + 7; //-3; //-1;
        this.__text2.color = "#ffffff";
        this.__text2.alpha = 0.6;
        this.__canvas.addChild(this.__text2);

        this.__seekBarLoopID = setInterval(this.__seekBarLoop, 50, this); //≒20fps
    }

    __seekBarLoop(_this) {
        var _percent = _this.__video.currentTime / _this.__video.duration;
        _this.__barWhite.endX = _this.__barWhite.startX + _this.__barWidth * _percent;
    }

    delete() {
        this.__canvas.deleteChild(this.__barBlack);
        this.__canvas.deleteChild(this.__barWhite);
        this.__canvas.deleteChild(this.__text1);
        this.__canvas.deleteChild(this.__text2);
        clearInterval(this.__seekBarLoopID);
    }

    //=======================================
    // (2) ユーザによるイベントリスナーの定義
    //=======================================
    // addEventListener(_event, _function) {
    //     if (_event == "close") {
    //         this.__closeHandler = _function;
    //     }
    // }
}