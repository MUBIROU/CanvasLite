/***********************************************
 * CircleMenu Class (ver.2017-11-13T19:03)
 * 
 *  <constructor>
 *      new CircleMenu(_canvas)
 * 
 *  <public method>
 *      CircleMenu.addEventListener(_event, _function)   "in" or "out"
 *      CircleMenu.out()
 *      
 *  <event>
 *      CircleMenu.IN
 *      CircleMenu.OUT
 *
***********************************************/

class CircleMenu { //五線譜の生成
    static get IN() { return "in"; }
    static get OUT() { return "out"; }
    
    constructor(_canvas) {
        this.__canvas = _canvas;

        this.__inHandler = undefined;
        this.__outHandler = undefined;

        //12個のボタン（CD型）を作成
        this._cdArray = [];
        for (let i=0; i<12; i++) {
            this.__theCD = new toile.Bitmap("tmp1.png");
            this.__theCD.name = "CD" + (i+1);
            this.__theCD.x = _canvas.width/2 - 50 + 270 * Math.cos(Math.PI/6 * i - Math.PI/2); //半径320（幅）
            this.__theCD.y = _canvas.height/2 - 50 + 270 * Math.sin(Math.PI/6 * i - Math.PI/2); //半径270（高さ）    
            //this.__theCD.alpha = 1;
            this.__theCD.__springPower = 0.15; //弾力（1.3倍の場合） 0.2
            this.__theCD.__springMinusPower = 0.0002 + Math.random * 0.0001;
            this.__theCD.__springCount = 0; //- Math.PI/2; //弾力用カウント
            this.__theCD.__originX = this.__theCD.x;
            this.__theCD.__originY = this.__theCD.y;
            this.__changeScale(this.__theCD, 0, this.__theCD.x, this.__theCD.y); //Bitmap.scaleでは中心軸がずれるため
            this._cdArray.push(this.__theCD);
            this.__canvas.addChild(this.__theCD);

            //12個のボタンの登場アニメーション開始
            this.__inLoopID = setInterval(this.__inLoop, 17, this); //≒59fps
        }
    }

    //======================
    //イベントリスナーの定義
    //======================
    addEventListener(_event, _function) {
        if (_event == "in") {
            this.__inHandler = _function;
        } else if (_event == "out") {
            this.__outHandler = _function;
        }
    }

    //================================
    //12個のボタンの登場アニメーション
    //================================
    __inLoop(_this) {
        for (let i=0; i<_this._cdArray.length; i++) {
            var _theCD = _this._cdArray[i];

            _theCD.__springCount += 0.03; //値が小さい程... 0.03
            let _theScale = 1 + _theCD.__springPower * Math.cos(_theCD.__springCount);

            if (_theCD.__springPower > 0) {
                _theCD.__springPower -= 0.00025; //値が大きい程... 0.0003
                //Bitmap.scaleでは中心軸がずれるため
                _this.__changeScale(_theCD, _theScale, _theCD.__originX, _theCD.__originY);
            } else {
                _theCD.__springPower = 0;
                clearInterval(_this.__inLoopID);
                _this.__inLoopID = undefined;
                if (_this.__inHandler != undefined) {
                    //=============================================
                    // INイベント（12個のボタンの表示完了）発生!!!
                    //=============================================
                    _this.__inHandler(_this);
                }
            }            
        };
    }

    //=========================================================================
    // 汎用関数：画像の中心を軸にスケール（Bitmap.scaleでは中心軸がずれるため）
    //=========================================================================
    __changeScale(_bitmap, _scale, _originX, _originY, _bitmapWidth=100, _bitmapHeight=100) {
        _bitmap.scale = _scale;
        var _bitmapWidth = 100;
        var _bitmapHeight = 100;
        _bitmap.x = _originX + (_bitmapWidth - _bitmapWidth * _scale) / 2;
        _bitmap.y = _originY + (_bitmapHeight - _bitmapHeight * _scale) / 2;
    }

    //=======================================
    //パブリックメソッド：12個のボタンを消す
    //=======================================
    out() {
        for (let i=0; i<this._cdArray.length; i++) {
            this._cdArray[i].__springPower = 0.1;
            this._cdArray[i].__springCount = 0;
        }
        //12個のボタンを消すアニメーション開始
        this.__outLoopID = setInterval(this.__outLoop, 17, this); //≒59fps
    }

    //================================
    //12個のボタンを消すアニメーション
    //================================
    __outLoop(_this) {
        for (let i=0; i<_this._cdArray.length; i++) {
            var _theCD = _this._cdArray[i];

            _theCD.__springCount += 0.03; //値が小さい程...
            let _theScale = 1 + _theCD.__springPower * Math.cos(_theCD.__springCount);

            if (_theCD.__springPower > 0) {
                _theCD.__springPower -= 0.0003; //値が大きい程..
                if (_theCD.alpha > 0) _theCD.alpha -= 0.04;
                //Bitmap.scaleでは中心軸がずれるため
                _this.__changeScale(_theCD, _theScale, _theCD.__originX, _theCD.__originY);
            } else {
                _theCD.__springPower = 0;
                clearInterval(_this.__outLoopID);
                _this.__outLoopID = undefined;
                if (_this.__outHandler != undefined) {
                    //===========================================
                    // OUTイベント（12個のボタンが消えた）発生!!!
                    //===========================================
                    _this.__outHandler(_this);
                }
            }
        }
    }
}