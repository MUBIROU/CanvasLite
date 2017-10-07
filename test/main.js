window.addEventListener("load", load_window, false);

function load_window() {
    _canvas = new Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.isBorder(true);
    _canvas.borderWidth = 2;
    _canvas.borderColor = "#ff0000";
    _canvas.enabledContextMenu(false);

    _grid = new Grid(_canvas,17,9); //Canvasを横17,縦9に分割
    _grid.exec();

    makeButton(_canvas,17,9);
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen();
}

makeButton = (_canvas, _numH, _numV) => {
    _blockNumH = _numH; //分割する数（横方向）
    _blockNumV = _numV; //分割する数（縦方向）
    _blockWidth = _canvas.width / _blockNumH;
    _blockHeight = _canvas.height / _blockNumV;

    _button1 = new RectButton(_canvas, _blockWidth*2, _blockHeight*3, _blockWidth*3, _blockHeight*3);
    _button2 = new RectButton(_canvas, _blockWidth*7, _blockHeight*3, _blockWidth*3, _blockHeight*3);
    _button3 = new RectButton(_canvas, _blockWidth*12, _blockHeight*3, _blockWidth*3, _blockHeight*3);
}