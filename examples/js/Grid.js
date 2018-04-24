/**********************************************
 * Grid Class (ver.2017-10-16T11:34)
 * 
 *      <Public Method>
 *          addEventListener(_event, _function)
 *          animateIn(_sec=2)
 *          animateOut(_sec=2)
 *          create()
 *          delete()
 *          removeEventListener(_event)
 *
 *      <Public Property>
 *          lineAlpha
 *          lineColor
 *          lineWidth
 * 
 *      <Event>
 *          ANIMATE_IN
 *          ANIMATE_OUT
 * 
**********************************************/

class Grid {
    static get ANIMATE_IN() { return "animateIn"; }
    static get ANIMATE_OUT() { return "animateOut"; }

    constructor(_canvas, _numH, _numV) {
        this.__blockNumH = _numH; //分割する数（横方向）
        this.__blockNumV = _numV; //分割する数（縦方向）
        this.__blockWidth = _canvas.width / _numH;
        this.__blockHeight = _canvas.height / _numV;

        this.__canvas = _canvas;
        this.__lineHlist = [];
        this.__lineVlist = [];
        this.__animateInHandler = undefined;
        this.__animateOutHandler = undefined;

        this.__lineAlpha = 1;
        this.__lineColor = "0,0,0";
        this.__lineWidth = 1;
    }
    
    //=============
    //public method
    //=============
    addEventListener(_event, _function) {
        switch (_event) {
            case "animateIn":
                this.__animateInHandler = _function;
                break;
            case "animateOut":
                this.__animateOutHandler = _function;
                break;
            default: throw new Error("Grid.addEventListener()");
        }
    }

    animateIn(_sec=2) {
        this.create();

        //横線の長さを0にする（左辺基準）
        var __lineHlistLength = this.__lineHlist.length;
        for (let i=0; i<__lineHlistLength; i++) {
            let _theObject = this.__lineHlist[i];
            _theObject.line.endX = 0;
            _theObject.count = - Math.PI/2 - i*(Math.PI/2)/__lineHlistLength;
        }

        //縦の長さを0にする（底辺基準）
        var __lineVlistLength = this.__lineVlist.length;
        for (let i=0; i<__lineVlistLength; i++) {
            let _theObject = this.__lineVlist[i];
            _theObject.line.startY = _theObject.line.endY;
            _theObject.count = Math.PI + i*(Math.PI/2)/__lineVlistLength;
        }

        //アニメーション速度（初期値2秒）
        let _lastCount = - Math.PI/2 - (__lineHlistLength-1)*(Math.PI/2)/__lineHlistLength;
        this.__speed = - _lastCount/_sec/(1000/17);

        this.__animateInLoopID = setInterval(this.__animateInLoop, 17, this); //≒58.8fps
    }

    animateOut(_sec=2) {
        //横線の長さを0にする（左辺基準）
        var __lineHlistLength = this.__lineHlist.length;
        for (let i=0; i<__lineHlistLength; i++) {
            let _theObject = this.__lineHlist[i];
            _theObject.count = - i*(Math.PI/2)/__lineHlistLength;
        }

        //縦の長さを0にする（底辺基準）
        var __lineVlistLength = this.__lineVlist.length;
        for (let i=0; i<__lineVlistLength; i++) {
            let _theObject = this.__lineVlist[i];
            _theObject.count = 3*Math.PI/2 + i*(Math.PI/2)/__lineVlistLength;
        }

        //アニメーション速度（初期値2秒）
        let _lastCount = - (__lineHlistLength-1)*(Math.PI/2)/__lineHlistLength;
        this.__speed = - _lastCount/_sec/(1000/17) * 2;

        this.__animateOutLoopID = setInterval(this.__animateOutLoop, 17, this); //≒58.8fps
    }

    create() {
        //Line Horizontal
        for (let i=1; i<this.__blockNumV; i++) {
            let _theObject = new Object();
            let _theLine = new canvaslite.Line(0, this.__blockHeight*i, this.__canvas.width, this.__blockHeight*i);
            _theLine.lineAlpha = this.__lineAlpha;
            _theLine.lineColor = this.__lineColor;
            _theLine.lineWidth = this.__lineWidth;
            _theObject.line = _theLine;
            _theObject.count = 0;
            this.__lineHlist.push(_theObject);
            this.__canvas.addChild(_theLine);
        }

        //Line Vertical
        for (let i=this.__blockNumH-1; i>0; i--) {
            let _theObject = new Object();
            let _theLine = new canvaslite.Line(this.__blockWidth*i, 0, this.__blockWidth*i, this.__canvas.height);
            _theLine.lineAlpha = this.__lineAlpha;
            _theLine.lineColor = this.__lineColor;
            _theLine.lineWidth = this.__lineWidth;
            _theObject.line = _theLine;
            _theObject.count = 0;
            _theObject.name = "v" + i; //__animateInLoop()で利用
            this.__lineVlist.push(_theObject);
            this.__canvas.addChild(_theLine);
        }
    }

    delete() {
        for (let i=0; i<this.__lineHlist.length; i++) {
            this.__canvas.deleteChild(this.__lineHlist[i].line);
        }

        for (let i=0; i<this.__lineVlist.length; i++) {
            this.__canvas.deleteChild(this.__lineVlist[i].line);
        }

        this.__lineHlist = [];
        this.__lineVlist = [];
    }

    removeEventListener(_event) {
        switch (_event) {
            case "animateIn":
                this.__animateInHandler = undefined;
                clearInterval(this.__animateInLoopID);
                break;
            case "animateOut":
                this.__animateOutHandler = undefined;
                clearInterval(this.__animateOutLoopID);
                break;
            default: throw new Error("Grid.removeEventListener()");
        }
    }

    //===============
    //Public Property
    //===============
    get lineAlpha() { return this.__lineAlpha; } //初期値 1
    set lineAlpha(_newValue) {
        this.__lineAlpha = _newValue;
        for (let i=0; i<this.__lineHlist.length; i++) {
            this.__lineHlist[i].line.lineAlpha = _newValue;
        }
        for (let i=0; i<this.__lineVlist.length; i++) {
            this.__lineVlist[i].line.lineAlpha = _newValue;
        }
    }

    get lineColor() { return this.__lineColor; } //初期値 "0,0,0"
    set lineColor(_newValue) { //引数例 "255,204,0"
        this.__lineColor = _newValue;
        for (let i=0; i<this.__lineHlist.length; i++) {
            this.__lineHlist[i].line.lineColor = _newValue;
        }
        for (let i=0; i<this.__lineVlist.length; i++) {
            this.__lineVlist[i].line.lineColor = _newValue;
        }
    }

    get lineWidth() { return this.__lineWidth; } //初期値 1
    set lineWidth(_newValue) { //引数例 "255,204,0"
        this.__lineWidth = _newValue;
        for (let i=0; i<this.__lineHlist.length; i++) {
            this.__lineHlist[i].line.lineWidth = _newValue;
        }
        for (let i=0; i<this.__lineVlist.length; i++) {
            this.__lineVlist[i].line.lineWidth = _newValue;
        }
    }

    //==============
    //private method
    //==============
    __animateInLoop(_this) {
        //横線の長さを伸ばす
        _this.__lineHlist.forEach(function(_theObject) {
            _theObject.count += _this.__speed; //値が大きいと横方向に高速化（初期値約0.025）
            if (_theObject.line.endX < _this.__canvas.width - 1) {
                _theObject.line.endX = _this.__canvas.width * Math.cos(_theObject.count);
            } else {
                _theObject.line.endX = _this.__canvas.width; 
            }
        });

        //縦線の長さを伸ばす
        _this.__lineVlist.forEach(function(_theObject) {
            _theObject.count += _this.__speed; //値が大きいと縦方向に高速化（初期値約0.025）
            if (_theObject.line.startY > 1) {
                _theObject.line.startY = _this.__canvas.height - _this.__canvas.height * Math.cos(_theObject.count)
            } else {
                _theObject.line.startY = 0;
                //最後の縦の線が表示し終わったら...
                if (_theObject.name == "v" + _this.__lineVlist.length) {
                    _this.__animateInHandler(_this); //animateIn()の終了イベント発生
                }
            }
        });
    }

    __animateOutLoop(_this) {
        //横線の長さを縮める
        _this.__lineHlist.forEach(function(_theObject) {
            _theObject.count += _this.__speed; //値が大きいと横方向に高速化（初期値約0.024）
            if (_theObject.line.startX < _this.__canvas.width - 1) {
                    _theObject.line.startX = _this.__canvas.width * Math.sin(_theObject.count);
            } else {
                _theObject.line.startX = _this.__canvas.width; 
            }
        });

        //縦線の長さを縮める
        _this.__lineVlist.forEach(function(_theObject) {
            _theObject.count += _this.__speed; //値が大きいと縦方向に高速化（初期値約0.024）
            if (_theObject.line.endY > 1) {
                _theObject.line.endY = _this.__canvas.height - _this.__canvas.height * Math.sin(_theObject.count)
            } else {
                _theObject.line.endY = 0;
                //最後の縦の線が表示し終わったら...
                if (_theObject.name == "v" + _this.__lineVlist.length) {
                    _this.__animateOutHandler(_this); //animateIn()の終了イベント発生
                    _this.delete(); //全てのLineインスタンスを削除
                }
            }
        });
    }
}