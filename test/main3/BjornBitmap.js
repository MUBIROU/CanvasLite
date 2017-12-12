/***********************************************
 * BjornBitmap Class (ver.2017-12-12TXX:XX:XX)
***********************************************/

class BjornBitmap extends Bitmap {
    constructor(_canvas, _bitmap, _startX, _startY, _targetY) {
        super(_bitmap);
        this.addEventListener("load", this.__load_this, this);

        this.__canvas = _canvas;

        this.x = _startX;
        this.y = _startY;

        this.__targetY = 768/2 - 80;
        this.__elasticY = 0;
        this.__spring = 0.07; //0.1; //値が小さいと動きが遅い
        this.__damp = 0.9; //0.8; //値が小さいとすぐにとまる
        this.__oldY = _startY;

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

    start() {
        this.__startLoopID = setInterval(this.__startLoop, 17, this);
    }

    __startLoop(_this) {
        _this.__elasticY = (_this.__elasticY - (_this.y - _this.__targetY) * _this.__spring) * _this.__damp;
        let _nextY = _this.y + _this.__elasticY;
        if (Math.abs(_nextY - _this.__oldY) > 0.01) {
            _this.y = _nextY;
            _this.__oldY = _this.y;
            _this.__line.endY = _this.y + 5;
        } else {
            console.log("STOP");
            clearInterval(_this.__startLoopID);
        }
    }
}