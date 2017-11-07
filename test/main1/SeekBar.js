class SeekBar {
    //static get CLOSE() { return "close"; }

    constructor(_canvas, _video, _startX, _startY, _endX, _endY) {
        this.__canvas = _canvas;
        this.__video = _video;
        this.__startX = _startX;
        this.__startY = _startY;
        this.__endX = _endX;
        this.__endY = _endY;
        this.__barWidth = _endX - _startX;

        //console.log(this.__video.name, this.__startX, this.__startY, this.__endX, this.__endY);
        //this.__barBlack = new toile.Line(_startX, _startY, _endX, _endY);
        this.__barBlack = new toile.Line(_startX, _startY, _endX, _endY);
        this.__barBlack.lineWidth = 10;
        this.__barBlack.lineColor = "255,255,255";
        this.__barBlack.alpha = 0.15;
        this.__canvas.addChild(this.__barBlack);

        this.__barWhite = new toile.Line(_startX, _startY, _endX - this.__barWidth + 10, _endY);
        this.__barWhite.lineWidth = 10;
        this.__barWhite.lineColor = "255,255,255"; //"255,0,0";
        this.__barWhite.alpha = 0.8;
        this.__canvas.addChild(this.__barWhite);

        this.__seekBarLoopID = setInterval(this.__seekBarLoop, 50, this); //≒20fps

        //_canvas.addChild(new toile.Line());
    }

    __seekBarLoop(_this) {
        var _percent = _this.__video.currentTime / _this.__video.duration;
        _this.__barWhite.endX = _this.__barWhite.startX + _this.__barWidth * _percent;
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