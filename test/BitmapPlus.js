/******************************************
 * BitmapButton Class
 * 
 *  <constructor>
 *      new BitmapButton(...
 * 
 *  <public method>
 *      BitmapButton.animateIn(_sec=1)
 *      BitmapButton.animateOut(_sec=1)
 * 
 *  <public property>
 *      
******************************************/

class BitmapPlus extends Bitmap {
    constructor(_path, _isAnimate=false, _rectFillColor="255,255,255", _rectLineColor="0,0,0", _rectLineWidth=4) {
        super(_path);

        this.__isAnimate = _isAnimate;
        if (this.__isAnimate) {
            this.__rectFillColor = _rectFillColor;
            this.__rectLineColor = _rectLineColor;
            this.__rectLineWidth = _rectLineWidth;
            this.alpha = 0; //0.1;
            this.__rect = undefined;
            this.addEventListener("load", this.__load_this);
        }
    }

    __load_this() {
        this.__rect = new Rect(this.x, this.y, this.x, this.y); //this.x + this.width, this.y + this.height);
        this.__rect.lineWidth = this.__rectLineWidth;
        this.__rect.isFill(true);
        this.__rect.fillColor = this.__rectFillColor;
        this.__rect.lineColor = this.__rectLineColor;
        this.__rect.lineWidth = this.__rectLineWidth;
        //this.__rect.width = this.width; //DEBUG
        //this.__rect.height = this.height; //DEBUG
        this.parent.addChild(this.__rect);
    }

    animateIn(_sec=1) {
        //console.log("animateIn");
        //アニメーション速度（初期値1秒）
        this.__speed = Math.PI/2/_sec/(1000/17); //Math.PI/2/_sec/(1000/17);
        this.__count = -Math.PI/2;
        this.__animateInLoopID = setInterval(this.__animateInLoop, 17, this); //≒58.8fps
    }

    __animateInLoop(_this) { //_this) {
        //console.log("__animateInLoop");

        _this.__count += _this.__speed; //値が大きいと横方向に高速化（初期値約0.025）
        if (_this.__rect.width < _this.width - 1) {
            _this.__rect.width = _this.width * Math.cos(_this.__count);
            _this.__rect.height = _this.height * Math.cos(_this.__count);
        } else {
            _this.__rect.width = _this.width; 
            _this.__rect.height = _this.height;
        }
    }
}