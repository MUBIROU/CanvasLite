/*******************************************
 * BitmapPlus Class (ver.2017-10-17T11:13)
 * 
 *  <constructor>
 *      new BitmapPlus(_path, _isAnimate=false, _rectFillColor="255,255,255", _rectLineColor="0,0,0", _rectLineWidth=4)
 * 
 *  <public method>
 *      BitmapPlus.in(_sec=1)
 *      BitmapPlus.out(_sec=1)
 *
 *  <event>
 *      BitmapPlus.DELETE
 * 
*******************************************/

class BitmapPlus extends Bitmap {
    static get DELETE() { return "delete"; }

    constructor(_path, _isAnimate=false, _rectFillColor="255,255,255", _rectLineColor="0,0,0", _rectLineWidth=4) {
        super(_path);

        this.__isAnimate = _isAnimate;
        if (this.__isAnimate) {
            this.__rectFillColor = _rectFillColor;
            this.__rectLineColor = _rectLineColor;
            this.__rectLineWidth = _rectLineWidth;
            this.alpha = 0;
            this.__rect = undefined;
            this.addEventListener("load", this.__load_this);
        }
    }

    //======================================
    // (1) 画像のロード完了後 Rectを生成する
    //======================================
    __load_this() {
        this.removeEventListener("load");
        //Rectの生成
        this.__rect = new Rect(this.x, this.y, this.x, this.y);
        this.__rect.lineWidth = this.__rectLineWidth;
        this.__rect.isFill(true);
        this.__rect.fillColor = this.__rectFillColor;
        this.__rect.lineColor = this.__rectLineColor;
        this.__rect.lineWidth = this.__rectLineWidth;
        this.parent.addChild(this.__rect);
    }

    //=======================================
    // (2) ユーザによるイベントリスナーの定義
    //=======================================
    addEventListener(_event, _function) { //override
        if (_event == "delete") {
            this.__deleteHandler = _function;
        } else {
            super.addEventListener(_event, _function);
        }
    }

    //=============================================================
    // (3) ユーザからの「表示（アニメーション）開始」を支持を受ける
    //=============================================================
    in(_sec=1) {
        this.__count = - Math.PI/2;
        this.__speed = Math.PI/2/_sec/(1000/17); //アニメーション速度（初期値1秒）
        this.__rectInLoopID = setInterval(this.__rectInLoop, 17, this); //≒58.8fps
    }

    //=============================
    // (4) Rectを左上から登場させる
    //=============================
    __rectInLoop(_this) {
        _this.__count += _this.__speed; //値が大きいほど高速
        if (_this.__rect.width < _this.width - 1) {
            _this.__rect.width = _this.width * Math.cos(_this.__count);
            _this.__rect.height = _this.height * Math.cos(_this.__count);
        } else { //Rect登場完了
            _this.__rect.width = _this.width; 
            _this.__rect.height = _this.height;
            clearInterval(_this.__rectInLoopID);

            //Bitmap登場を開始
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

    //=============================================================
    // (5) Bitmapを登場（フェードイン）させる／Rectはフェードアウト
    //=============================================================
    __bitmapInLoop(_this) {
        if (_this.__rect.alpha > 0) {
            _this.__rect.alpha -= 17*2/1000; //0.5秒でBitmap登場＆Rect消去
            _this.alpha += 17*2/1000;
        } else {
            clearInterval(_this.__bitmapInLoopID); //Rectが消えBitmapが表示完了
            //マウスイベントの復活
            _this.__mouseDownHandler = _this.__mouseDownHandler_bk;
            _this.__mouseUpHandler = _this.__mouseUpHandler_bk;
            _this.__mouseUpOutsideHandler = _this.__mouseUpOutsideHandler_bk;
            _this.__mouseDownHandler_bk = undefined;
            _this.__mouseUpHandler_bk = undefined;
            _this.__mouseUpOutsideHandler_bk = undefined;
        }
    }

    //======================================
    // (6) マウスイベント（mouseUp）を受ける
    //======================================
    __commonHit(_event) { //override
        if (_event == "mouseup") { //選択（クリック）したらアニメーションさせて消すため
            if (this.__isChoice) {
                if (this.__mouseUpHandler != undefined) {
                    this.__isChoice = false;
                    this.__mouseUpHandler(this);
                    this.out(1);
                }
            }
        } else {
            super.__commonHit(_event);
        }
    }

    //=======================================
    // (7) Bitmapの消去（フェードアウト）開始
    //=======================================
    out(_sec=1) {
        //Bitmap消去開始
        this.__bitmapOutLoopID = setInterval(this.__bitmapOutLoop, 17, this, _sec); //≒58.8fps
    }

    //=============================================================
    // (8) Bitmapを消していく（フェードアウト）／Rectはフェードイン
    //=============================================================
    __bitmapOutLoop(_arg1, _arg2) {
        let _this = _arg1; //this
        if (_this.__rect.alpha < 1) {
            _this.__rect.alpha += 17*2/1000; //0.5秒でBitmap登場＆Rect消去
            _this.alpha -= 17*2/1000;
        } else {
            clearInterval(_this.__bitmapOutLoopID); //Rectが消えBitmapが表示完了

            _this.__speed = Math.PI/2/_arg2/(1000/17); //アニメーション速度（初期値1秒）
            _this.__count = -Math.PI/2;
            _this.__rectOutLoopID = setInterval(_this.__rectOutLoop, 17, _this); //≒58.8fps
        }
    }

    //============================================================
    // (9) Rectを左上に消していく（消去後「delete」イベント発生）
    //============================================================
    __rectOutLoop(_this) {
        _this.__count += _this.__speed;
        if (_this.__rect.width > 1) {
            _this.__rect.width = _this.width - _this.width * Math.cos(_this.__count);
            _this.__rect.height = _this.height - _this.height * Math.cos(_this.__count);
        } else {
            _this.parent.deleteChild(_this.__rect); //Rectの消去
            _this.__deleteHandler(_this);
            clearInterval(_this.__rectOutLoopID);
        }
    }
}