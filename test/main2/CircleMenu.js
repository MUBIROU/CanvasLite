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

        this._cdArray = [];
        for (let i=0; i<12; i++) {
            this.__theCD = new toile.Bitmap("tmp1.png");
            this.__theCD.name = "CD" + (i+1);
            this.__theCD.x = _canvas.width/2 - 50 + 270 * Math.cos(Math.PI/6 * i - Math.PI/2); //半径320（幅）
            this.__theCD.y = _canvas.height/2 - 50 + 270 * Math.sin(Math.PI/6 * i - Math.PI/2); //半径270（高さ）    
            //this.__theCD.alpha = 1;
            this.__theCD.__springPower = 0.35; //弾力（1.3倍の場合）
            this.__theCD.__springCount = 0; //- Math.PI/2; //弾力用カウント
            this.__theCD.__originX = this.__theCD.x;
            this.__theCD.__originY = this.__theCD.y;
            this.__changeScale(this.__theCD, 0, this.__theCD.x, this.__theCD.y); //Bitmap.scaleでは中心軸がずれるため
            this._cdArray.push(this.__theCD);
            this.__canvas.addChild(this.__theCD);

            this.__inLoopID = setInterval(this.__inLoop, 17, this); //≒59fps
        }
    }

    addEventListener(_event, _function) {
        if (_event == "in") {
            this.__inHandler = _function;
        } else if (_event == "out") {
            this.__outHandler = _function;
        }
    }

    __inLoop(_this) {
        for (let i=0; i<_this._cdArray.length; i++) {
            var _theCD = _this._cdArray[i];

            _theCD.__springCount += 0.03;
            let _theScale = 1 + _theCD.__springPower * Math.cos(_theCD.__springCount);

            if (_theCD.__springPower > 0) {
                _theCD.__springPower -= 0.0005;
                //Bitmap.scaleでは中心軸がずれるため
                _this.__changeScale(_theCD, _theScale, _theCD.__originX, _theCD.__originY);
            } else {
                _theCD.__springPower = 0;
                clearInterval(_this.__inLoopID);
                _this.__inLoopID = undefined;
                if (_this.__inHandler != undefined) {
                    _this.__inHandler(_this); //INイベント発生!!!
                }
            }            
        };
    }

    //Bitmap.scaleでは中心軸がずれるため
    __changeScale(_bitmap, _scale, _originX, _originY, _bitmapWidth=100, _bitmapHeight=100) {
        _bitmap.scale = _scale;
        var _bitmapWidth = 100;
        var _bitmapHeight = 100;
        _bitmap.x = _originX + (_bitmapWidth - _bitmapWidth * _scale) / 2;
        _bitmap.y = _originY + (_bitmapHeight - _bitmapHeight * _scale) / 2;
    }

    out() {
        //アニメーション開始
        this.__outLoopID = setInterval(this.__outLoop, 17, this); //≒59fps
    }

    __outLoop(_this) {
        //消えるアニメーション

        clearInterval(_this.__outLoopID);
        _this.__outLoopID = undefined;
        
        if (_this.__outHandler != undefined) {
            _this.__outHandler(_this); //OUTイベント発生!!!
        }
    }

    delete() {
        // this.__canvas.deleteChild(this.__scoreContainer);
        // this.__scoreContainer.addChild(this.__scoreCircle1);
        // this.__scoreContainer.addChild(this.__scoreCircle2);
        // this.__scoreContainer.addChild(this.__scoreCircle3);
        // this.__scoreContainer.addChild(this.__scoreCircle4);
        // this.__scoreContainer.addChild(this.__scoreCircle5);
    }
}