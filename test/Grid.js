/******************************************
 * <Public Method>
 *      exec()
 *      animateIn(_sec=2)
 *      addEventListener(_event, _function)
 *      removeEventListener(_event)
******************************************/

class Grid {
    constructor(_canvas, _numH, _numV) {
        this.__blockNumH = _numH; //分割する数（横方向）
        this.__blockNumV = _numV; //分割する数（縦方向）
        this.__blockWidth = _canvas.width / this.__blockNumH;
        this.__blockHeight = _canvas.height / this.__blockNumV;

        this.__canvas = _canvas;
        this.__lineHlist = [];
        this.__lineVlist = [];
        this.__animateInEndHandler = undefined;

        this.init();
    }

    //=============
    //public method
    //=============
    init() {
        //Line Horizontal
        for (let i=1; i<this.__blockNumV; i++) {
            let _theObject = new Object();
            let _theLine = new Line(0, this.__blockHeight*i, this.__canvas.width, this.__blockHeight*i);
            //_theLine.lineWidth = 2;
            _theObject.line = _theLine;
            _theObject.count = 0;
            this.__lineHlist.push(_theObject);
            this.__canvas.addChild(_theLine);
        }

        //Line Vertical
        for (let i=this.__blockNumH-1; i>0; i--) {
            let _theObject = new Object();
            let _theLine = new Line(this.__blockWidth*i, 0, this.__blockWidth*i, this.__canvas.height);
            //_theLine.lineWidth = 2;
            _theObject.line = _theLine;
            _theObject.count = 0;
            this.__lineVlist.push(_theObject);
            this.__canvas.addChild(_theLine);
        }
    }

    //animateIn()開始
    animateIn(_sec=2) {
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

        this.__timerID = setInterval(this.__animateInLoop, 17, this); //≒58.8fps
    }

    addEventListener(_event, _function) {
        switch (_event) {
            case "animateInEnd":
                this.__animateInEndHandler = _function;
                break;
            default: throw new Error("Grid.addEventListener()");
        }
    }

    removeEventListener(_event) {
        switch (_event) {
            case "animateInEnd":
                this.__animateInEndHandler = undefined;
                clearInterval(this.__timerID);
                break;
            default: throw new Error("Grid.removeEventListener()");
        }
    }

    //==============
    //private method
    //==============
    __animateInLoop(_this) { //≒animateIn()の実行で58.8fps繰返される処理
        //横線の長さを伸ばす
        _this.__lineHlist.forEach(function(_theObject) {
            _theObject.count += _this.__speed; //値が大きいと横方向に高速化（初期値0.03）
            if (_theObject.line.endX < _this.__canvas.width - 1) {
                _theObject.line.endX = _this.__canvas.width * Math.cos(_theObject.count);
            } else {
                _theObject.line.endX = _this.__canvas.width;
            }
        });

        //縦線の長さを伸ばす
        _this.__lineVlist.forEach(function(_theObject) {
            _theObject.count += _this.__speed; //値が大きいと縦方向に高速化（初期値0.03）
            if (_theObject.line.startY > 1) {
                _theObject.line.startY = _this.__canvas.height - _this.__canvas.height * Math.cos(_theObject.count)
            } else {
                _theObject.line.startY = 0;
            }
        });

        //_this.__animateInEndHandler(_this);
    }
}