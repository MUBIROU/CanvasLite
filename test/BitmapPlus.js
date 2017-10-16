/*******************************************
 * BitmapButton Class (ver.2017-10-16T11:34)
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
*******************************************/

class BitmapPlus extends Bitmap {
    static get ANIMATE_OUT() { return "animateOut"; }

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
        this.removeEventListener("load");

        this.__rect = new Rect(this.x, this.y, this.x, this.y); //this.x + this.width, this.y + this.height);
        this.__rect.lineWidth = this.__rectLineWidth;
        this.__rect.isFill(true);
        this.__rect.fillColor = this.__rectFillColor;
        this.__rect.lineColor = this.__rectLineColor;
        this.__rect.lineWidth = this.__rectLineWidth;
        this.parent.addChild(this.__rect);
    }

    animateIn(_sec=1) {
        //アニメーション速度（初期値1秒）
        this.__speed = Math.PI/2/_sec/(1000/17); //Math.PI/2/_sec/(1000/17);
        this.__count = -Math.PI/2;
        this.__animateInLoopID = setInterval(this.__animateInLoop, 17, this); //≒58.8fps
    }

    animateOut(_sec=1) {
        //アニメーション速度（初期値1秒）
        this.__speed = Math.PI/2/_sec/(1000/17); //Math.PI/2/_sec/(1000/17);
        this.__count = -Math.PI/2;
        this.__animateOutLoopID = setInterval(this.__animateOutLoop, 17, this); //≒58.8fps
    }

    addEventListener(_event, _function) { //override
        if (_event != "animateOut") {
            super.addEventListener(_event, _function);
        } else {
            switch (_event) {
                case "animateOut":
                    this.__animateOutEndHandler = _function;
                    break;
                default:
                    throw new Error("BitmapPlus.addEventListener():override");
            }
        }
    }

    __animateInLoop(_this) {
        _this.__count += _this.__speed; //値が大きいと横方向に高速化（初期値約0.025）
        if (_this.__rect.width < _this.width - 1) {
            _this.__rect.width = _this.width * Math.cos(_this.__count);
            _this.__rect.height = _this.height * Math.cos(_this.__count);
        } else {
            //Rect登場完了
            _this.__rect.width = _this.width; 
            _this.__rect.height = _this.height;
            clearInterval(_this.__animateInLoopID);

            //Bitmap登場開始
            _this.__bitmapInLoopID = setInterval(_this.__bitmapInLoop, 17, _this); //≒58.8fps
            
            //Bitmap登場中はマウスイベントを無効にするため
            _this.__mouseDownHandler_bk = _this.__mouseDownHandler;
            _this.__mouseUpHandler_bk = _this.__mouseUpHandler;
            _this.__mouseUpOutsideHandler_bk = _this.__mouseUpOutsideHandler;
            _this.__mouseDownHandler = undefined;
            _this.__mouseUpHandler = undefined;
            _this.__mouseUpOutsideHandler = undefined;
        }
    }

    __animateOutLoop(_this) {
        _this.__count += _this.__speed;
        if (_this.__rect.width > 1) {
            _this.__rect.width = _this.width - _this.width * Math.cos(_this.__count);
            _this.__rect.height = _this.height - _this.height * Math.cos(_this.__count);
        } else {
            //Rectの消去
            _this.parent.deleteChild(_this.__rect);
            _this.__animateOutEndHandler(_this);
            clearInterval(_this.__animateOutLoopID);
        }
    }

    __commonHit(_event) { //override
        //選択（クリック）したらアニメーションさせて消すため
        if (_event == "mouseup") {
            if (this.__isChoice) {
                if (this.__mouseUpHandler != undefined) {
                    this.__isChoice = false;
                    this.__mouseUpHandler(this);
                    //Bitmap消去開始
                    this.__bitmapOutLoopID = setInterval(this.__bitmapOutLoop, 17, this); //≒58.8fps
                }
            }
        } else {
            super.__commonHit(_event);
        }
    }

    __bitmapOutLoop(_this) {
        if (_this.__rect.alpha < 1) {
             //0.5秒でBitmap登場＆Rect消去
            _this.__rect.alpha += 17*2/1000; //0.001
            _this.alpha -= 17*2/1000;
        } else {
            //Rectが消えBitmapが表示完了
            clearInterval(_this.__bitmapOutLoopID);
            //Rect消去開始
            _this.animateOut(2); //初期値1
        }
    }

    __bitmapInLoop(_this) {
        if (_this.__rect.alpha > 0) {
             //0.5秒でBitmap登場＆Rect消去
            _this.__rect.alpha -= 17*2/1000; //0.001
            _this.alpha += 17*2/1000;
        } else {
            //Rectが消えBitmapが表示完了
            clearInterval(_this.__bitmapInLoopID);
            //マウスイベントの復活
            _this.__mouseDownHandler = _this.__mouseDownHandler_bk;
            _this.__mouseUpHandler = _this.__mouseUpHandler_bk;
            _this.__mouseUpOutsideHandler = _this.__mouseUpOutsideHandler_bk;
            _this.__mouseDownHandler_bk = undefined;
            _this.__mouseUpHandler_bk = undefined;
            _this.__mouseUpOutsideHandler_bk = undefined;
        }
    }
}