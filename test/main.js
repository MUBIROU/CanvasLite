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
    _button1.addEventListener("mouseup", mouseup_button);
    _button2.addEventListener("mouseup", mouseup_button);
    _button3.addEventListener("mouseup", mouseup_button);
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen();
}

makeButton = (_canvas, _numH, _numV) => {
    _blockNumH = _numH; //分割する数（横方向）
    _blockNumV = _numV; //分割する数（縦方向）
    _blockWidth = _canvas.width / _blockNumH;
    _blockHeight = _canvas.height / _blockNumV;

    _button1 = new BitmapButton("red.png");
    _button1.name = "button1";
    _button1.x = _blockWidth*2;
    _button1.y = _blockHeight*3;
    _canvas.addChild(_button1);

    _button2 = new BitmapButton("red.png");
    _button2.name = "button2";
    _button2.x = _blockWidth*7;
    _button2.y = _blockHeight*3;
    _canvas.addChild(_button2);

    _button3 = new BitmapButton("red.png");
    _button3.name = "button3";
    _button3.x = _blockWidth*12;
    _button3.y = _blockHeight*3;
    _canvas.addChild(_button3);
}

mouseup_button = (_bitmap) => {
    console.log(_bitmap.name);
}
