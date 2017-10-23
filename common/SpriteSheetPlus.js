/***********************************************
 * SpriteSheetPlus Class (ver.2017-10-20T09:21)
 * 
 *  <constructor>
 *      new SpriteSheetPlus(_path, _isAnimate=false, _rectFillColor="255,255,255", _rectLineColor="0,0,0", _rectLineWidth=4)
 * 
 *  <public method>
 *      SpriteSheetPlus.in(_sec=1)
 *      SpriteSheetPlus.out(_sec=1)
 *
 *  <event>
 *      SpriteSheetPlus.DELETE
 * 
***********************************************/

class SpriteSheetPlus extends toile.SpriteSheet {
    static get DELETE() { return "delete"; }

    constructor(_path, _isAnimate=false, _rectFillColor="255,255,255", _rectLineColor="0,0,0", _rectLineWidth=4) {
        super(_path);

        this.__isAnimate = _isAnimate;
        if (this.__isAnimate) {
            this.__rectFillColor = _rectFillColor;
            this.__rectLineColor = _rectLineColor;
            this.__rectLineWidth = _rectLineWidth;
        }
        this.__rect = undefined;
        //this.stop(); //フェードインの間 SpriteSheetをstop()させる場合
        this.alpha = 0;
        this.addEventListener("load", this.__load_this);
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
        this.__loopCount = - Math.PI/2;
        this.__speed = Math.PI/2/_sec/(1000/17); //アニメーション速度（初期値1秒）
        this.__rectInLoopID = setInterval(this.__rectInLoop, 17, this); //≒58.8fps
    }

    //=============================
    // (4) Rectを左上から登場させる
    //=============================
    __rectInLoop(_this) {
        _this.__loopCount += _this.__speed; //値が大きいほど高速
        if (_this.__rect.width < _this.width - 1) {
            _this.__rect.width = _this.width * Math.cos(_this.__loopCount);
            _this.__rect.height = _this.height * Math.cos(_this.__loopCount);
        } else { //Rect登場完了
            _this.__rect.width = _this.width; 
            _this.__rect.height = _this.height;
            clearInterval(_this.__rectInLoopID);

            //SpriteSheet登場を開始
            _this.__spriteSheetInLoopID = setInterval(_this.__spriteSheetInLoop, 17, _this); //≒58.8fps
            
            //SpriteSheet登場中はマウスイベントを無効にするため
            _this.__mouseDownHandler_bk = _this.__mouseDownHandler;
            _this.__mouseUpHandler_bk = _this.__mouseUpHandler;
            _this.__mouseUpOutsideHandler_bk = _this.__mouseUpOutsideHandler;
            _this.__mouseDownHandler = undefined;
            _this.__mouseUpHandler = undefined;
            _this.__mouseUpOutsideHandler = undefined;
        }
    }

    //==================================================================
    // (5) SpriteSheetを登場（フェードイン）させる／Rectはフェードアウト
    //==================================================================
    __spriteSheetInLoop(_this) {
        if (_this.__rect.alpha > 0) {
            _this.__rect.alpha -= 17*2/1000; //0.5秒でSpriteSheet登場＆Rect消去
            _this.alpha += 17*2/1000;
        } else {
            clearInterval(_this.__spriteSheetInLoopID); //Rectが消えSpriteSheetが表示完了
            //マウスイベントの復活
            _this.__mouseDownHandler = _this.__mouseDownHandler_bk;
            _this.__mouseUpHandler = _this.__mouseUpHandler_bk;
            _this.__mouseUpOutsideHandler = _this.__mouseUpOutsideHandler_bk;
            _this.__mouseDownHandler_bk = undefined;
            _this.__mouseUpHandler_bk = undefined;
            _this.__mouseUpOutsideHandler_bk = undefined;
            //_this.play(); //constructor()でSpriteSheet.stop()している場合はここで再生
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

    //============================================
    // (7) SpriteSheetの消去（フェードアウト）開始
    //============================================
    out(_sec=1) {
        //SpriteSheet消去開始
        this.__spriteSheetOutLoopID = setInterval(this.__spriteSheetOutLoop, 17, this, _sec); //≒58.8fps
        //SpriteSheetの消去時はマウスイベントを無効にする
        this.__mouseDownHandler = undefined;
        this.__mouseUpHandler = undefined;
        this.__mouseUpOutsideHandler = undefined;
    }

    //==================================================================
    // (8) SpriteSheetを消していく（フェードアウト）／Rectはフェードイン
    //==================================================================
    __spriteSheetOutLoop(_arg1, _arg2) {
        let _this = _arg1;
        if (_this.__rect.alpha < 1) {
            _this.__rect.alpha += 17*2/1000; //0.5秒でSpriteSheet登場＆Rect消去
            _this.alpha -= 17*2/1000;
        } else {
            clearInterval(_this.__spriteSheetOutLoopID); //Rectが消えSpriteSheetが表示完了

            _this.__speed = Math.PI/2/_arg2/(1000/17); //アニメーション速度（初期値1秒）
            _this.__loopCount = -Math.PI/2;
            _this.__rectOutLoopID = setInterval(_this.__rectOutLoop, 17, _this); //≒58.8fps
        }
    }

    //============================================================
    // (9) Rectを左上に消していく（消去後「delete」イベント発生）
    //============================================================
    __rectOutLoop(_this) {
        _this.__loopCount += _this.__speed;
        if (_this.__rect.width > 1) {
            _this.__rect.width = _this.width - _this.width * Math.cos(_this.__loopCount);
            _this.__rect.height = _this.height - _this.height * Math.cos(_this.__loopCount);
        } else {
            _this.parent.deleteChild(_this.__rect); //Rectの消去
            _this.__deleteHandler(_this);
            clearInterval(_this.__rectOutLoopID);
        }
    }
}