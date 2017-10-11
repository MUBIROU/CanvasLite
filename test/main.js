addEventListener("load", load_window, false);

function load_window() {
    _canvas = new Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    
    //_canvas.isBorder(true);
    _canvas.borderWidth = 2;
    _canvas.borderColor = "#ff0000";
    _canvas.enabledContextMenu(false);
    _canvas.fps = 60;

    //（1）グリッドの登場
    _grid = new Grid(_canvas,17,9); //Canvasを横17,縦9に分割
    _grid.animateIn(2.5); //初期値2（秒）
    _grid.addEventListener("animateInEnd", animateInEnd_grid);

}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#ffffff");
}

mouseup_button = (_bitmap) => {
    //console.log(_bitmap.name);
    _grid.animateOut(2.5); //初期値2（秒）
    _grid.addEventListener("animateOutEnd", animateOutEnd_grid);

    //_canvas.deleteChild(_button1);
    //_canvas.deleteChild(_button2);
    //_canvas.deleteChild(_button3);
}

animateInEnd_grid = (_grid) => {
    console.log("animateIn()終了");
    _grid.removeEventListener("animateInEnd");

    //animateIn()のアニメーションが終了後に行いたい処理をここに記述

    //3つのボタン生成
    //makeButton(_canvas,17,9);
    _canvas.addEventListener("mouseup", mouseup_button);
    //_button1.addEventListener("mouseup", mouseup_button);
    //_button2.addEventListener("mouseup", mouseup_button);
    //_button3.addEventListener("mouseup", mouseup_button);
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

animateOutEnd_grid = (_grid) => {
    console.log("animateOut()終了");
    _grid.removeEventListener("animateOutEnd");
}