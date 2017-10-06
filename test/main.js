window.addEventListener("load", load_window, false);

function load_window() {
    _canvas = new Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    //_canvas.isBorder(true);
    _canvas.borderWidth = 2;
    _canvas.borderColor = "#ff0000";
    _canvas.enabledContextMenu(false);

    test(_canvas,17,9); //Canvasを横13,縦7に分割
    
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen();
}

test = (_canvas, _numH, _numV) => {
    _blockNumH = _numH; //分割する数（横方向）
    _blockNumV = _numV; //分割する数（縦方向）
    _blockWidth = _canvas.width / _blockNumH;
    _blockHeight = _canvas.height / _blockNumV;

    //===============
    //Line Horizontal
    //===============
    _lineHlist = [];
    for (let i=1; i<_numH; i++) {
        _theLine = new Line(_blockWidth*i,0,_blockWidth*i,_canvas.height);
        //_theLine.lineWidth = 6;
        _theLine.lineAlpha = 0.2;
        _canvas.addChild(_theLine);
        _lineHlist.push(_theLine);
    }

    //=============
    //Line Vertical
    //=============
    _lineVlist = [];
    for (let i=1; i<_numV; i++) {
        _theLine = new Line(0,_blockHeight*i,_canvas.width,_blockHeight*i);
        //_theLine.lineWidth = 6;
        //_theLine.lineColor = ""
        _theLine.lineAlpha = 0.2;
        _canvas.addChild(_theLine);
        _lineVlist.push(_theLine);
    }

    _rect1 = new Rect(_blockWidth*2, _blockHeight*3, _blockWidth*2 + _blockWidth*3, _blockHeight*6);
    _rect1.lineWidth = 5;
    _rect1.isFill(true);
    _rect1.fillColor = "255,255,255";
    _rect1.alpha = 0.8;
    _canvas.addChild(_rect1);

    _rect2 = new Rect(_blockWidth*7, _blockHeight*3, _blockWidth*7 + _blockWidth*3, _blockHeight*6);
    _rect2.lineWidth = 5;
    _rect2.isFill(true);
    _rect2.fillColor = "255,255,255";
    _rect2.alpha = 0.8;
    _canvas.addChild(_rect2);

    _rect3 = new Rect(_blockWidth*12, _blockHeight*3, _blockWidth*12 + _blockWidth*3, _blockHeight*6);
    _rect3.lineWidth = 5;
    _rect3.isFill(true);
    _rect3.fillColor = "255,255,255";
    _rect3.alpha = 0.8;
    _canvas.addChild(_rect3);
}