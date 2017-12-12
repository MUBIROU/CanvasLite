/***********************************************
 * BjornBitmap Class (ver.2017-12-12TXX:XX:XX)
 * 
 * Public Method
 *      BjornBitmap.start(_millsec = 0)
 *      BjornBitmap.end(_millsec = 0)
 * 
 * Event
 *      BjornBitmap.END
 * 
***********************************************/

class BjornBitmap extends Bitmap {
    static get END() { return "end"; }

    constructor(_canvas, _bitmap, _startX, _startY, _targetY) {
        super(_bitmap);

        this.__endHandler = undefined;

        this.addEventListener("load", this.__load_this, this);

        this.__canvas = _canvas;

        this.x = _startX;
        this.y = _startY;

        this.__targetY = 768/2 - 80;
        this.__elasticY = 0;
        this.__spring = 0.09; //0.1; //値が小さいと動きが遅い
        this.__damp = 0.86; //0.8; //値が小さいとすぐにとまる
        this.__oldY = _startY;
        this.__endSpeed = 0;

        _canvas.addChild(this);
    }

    __load_this(_this) {
        _this.__line = new toile.Line(
            _this.x + _this.width/2,
            _this.y,
            _this.x + _this.width/2,
            _this.y
        )
        _this.__line.lineWidth = 2;
        _this.__line.lineColor = "64,64,64"; //"51,51,51"; //#333
        _this.__canvas.addChild(_this.__line);
    }

    addEventListener(_event, _function) { //override
        if (_event == "end") {
            this.__endHandler = _function;
        } else {
            super.addEventListener(_event, _function);
        }
    }

    //=================================
    // BjornBitmap.start(_millsec = 0)
    //=================================
    start(_millsec = 0) {
        this.__startTimeOutID = setTimeout(this.__startTimeOut, _millsec, this);
    }

    __startTimeOut(_this) {
        clearInterval(_this.__startTimeOutID);
        _this.__startLoopID = setInterval(_this.__startLoop, 17, _this);
    }

    __startLoop(_this) {
        _this.__elasticY = (_this.__elasticY - (_this.y - _this.__targetY) * _this.__spring) * _this.__damp;
        let _nextY = _this.y + _this.__elasticY;
        if (Math.abs(_nextY - _this.__oldY) > 0.01) {
            _this.y = _nextY;
            _this.__oldY = _this.y;
            _this.__line.endY = _this.y + 5;
        } else {
            _this.y = _this.__targetY;
            _this.__line.endY = _this.y + 5;
            clearInterval(_this.__startLoopID);
        }
    }

    //===============================
    // BjornBitmap.end(_millsec = 0)
    //===============================
    end(_millsec = 0) {
        this.__endTimeOutID = setTimeout(this.__endTimeOut, _millsec, this);
    }

    __endTimeOut(_this) {
        clearInterval(_this.__endTimeOutID);
        _this.__endLoopID = setInterval(_this.__endLoop, 17, _this);
    }

    __endLoop(_this) {
        _this.__endSpeed += 0.5;
        let _nextY = _this.y - _this.__endSpeed;
        if (- 100 < _this.y) {
            _this.y = _nextY;
            _this.__line.endY = _this.y + 5;
        } else {
            clearInterval(_this.__endLoopID);
            if (_this.__endHandler != undefined) {
                _this.__endHandler(); //"end"イベント発生
            }
        }
    }
}