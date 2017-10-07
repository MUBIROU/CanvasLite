class Grid {
    constructor(_canvas, _numH, _numV) {
        this.__blockNumH = _numH; //分割する数（横方向）
        this.__blockNumV = _numV; //分割する数（縦方向）
        this.__blockWidth = _canvas.width / this.__blockNumH;
        this.__blockHeight = _canvas.height / this.__blockNumV;

        this.__canvas = _canvas;
        this.__lineHlist = [];
        this.__lineVlist = [];
    }

    exec() {
        //Line Horizontal
        for (let i=1; i<this.__blockNumH; i++) {
            let _theLine 
            = new Line(this.__blockWidth*i, 0, this.__blockWidth*i, this.__canvas.height);
            //_theLine.lineWidth = 6;
            _theLine.lineAlpha = 0.2;
            this.__canvas.addChild(_theLine);
            this.__lineHlist.push(_theLine);
        }

        //Line Vertical        
        for (let i=1; i<this.__blockNumV; i++) {
            let _theLine = new Line(0, this.__blockHeight*i, this.__canvas.width, this.__blockHeight*i);
            //_theLine.lineWidth = 6;
            //_theLine.lineColor = ""
            _theLine.lineAlpha = 0.2;
            this.__canvas.addChild(_theLine);
            this.__lineVlist.push(_theLine);
        }
    }
}