addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.addEventListener("mouseup", mouseup_canvas);
    _canvas.fps = 60;
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "png/dummy.png";
    _canvas.isBorder(true);

    _bitmap = new toile.Bitmap("../examples/png/yubi.png");
    _bitmap.alpha = 0.2;
    _bitmap.x = _canvas.width/2 - 50;
    _bitmap.y = _canvas.height/2 - 80;
    _canvas.addChild(_bitmap);
    _gridStatus = "off"; //Gridの表示状態
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#ffffff");
}

mouseup_canvas = (_canvas) => {
    if (_gridStatus == "off") {
        _grid = new Grid(_canvas,17,9); //Canvasを横17,縦9に分割
        //_grid.create(); //アニメーション無しで表示したい場合
        //_grid.lineAlpha = 0.5; //初期値1
        _grid.lineColor = "187,187,187"; //"204,204,204"; //初期値"0,0,0"
        _grid.lineWidth = 4; //初期値1
        _grid.animateIn(2); //初期値2（秒）
        _grid.addEventListener("animateInEnd", animateInEnd_grid);
        _gridStatus = "animate"; //Gridの表示状態
    } else if (_gridStatus == "on") {
        //_grid.delete(); //アニメーション無しで消去したい場合
        //_grid.lineAlpha = 0.5; //初期値1
        //_grid.lineColor = "51,102,204"; //初期値"0,0,0"
        //_grid.lineWidth = 4; //初期値1
        _grid.animateOut(2); //初期値2（秒）
        _grid.addEventListener("animateOutEnd", animateOutEnd_grid);
        _gridStatus = "animate"; //Gridの表示状態
    } else if (_gridStatus == "animate") {
        //"animate"中は未処理
    }
}

animateInEnd_grid = (_grid) => {
    _gridStatus = "on"; //Gridの表示状態
    _grid.removeEventListener("animateInEnd");
    
    //アニメーション完了直後に設定変更したい場合...
    //_grid.lineAlpha = 1; //初期値1
    //_grid.lineColor = "0,0,0"; //初期値"0,0,0"
    //_grid.lineWidth = 4; //初期値1
}

animateOutEnd_grid = (_grid) => {
    _gridStatus = "off";
    _grid.removeEventListener("animateOutEnd");
}

/*
addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    
    _canvas.isBorder(true);
    _canvas.borderWidth = 2;
    _canvas.borderColor = "#ff0000";
    _canvas.enabledContextMenu(false);
    _canvas.fps = 60;



    _grid = new Grid(_canvas,17,9); //Canvasを横17,縦9に分割
    //_grid.create();
    //_grid.lineAlpha = 0.1;
    _grid.lineColor = "204,204,204";
    _grid.lineWidth = 4;
    _grid.animateIn(2); //初期値2（秒）
    _grid.addEventListener("animateInEnd", animateInEnd_grid);

    //_canvas.addEventListener("mouseup", mouseup_button);
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#ffffff");
}

mouseup_button = (_bitmap) => {
    _grid.animateOut(2); //初期値2（秒）
    _grid.addEventListener("animateOutEnd", animateOutEnd_grid);

    //_canvas.deleteChild(_button1);
    //_canvas.deleteChild(_button2);
    //_canvas.deleteChild(_button3);
}

animateInEnd_grid = (_grid) => {
    console.log("animateIn()終了");
    _grid.removeEventListener("animateInEnd");

    //_grid.lineAlpha = 0.5;
    //_grid.lineColor = "255,0,0";
    //_grid.lineWidth = 4;

    //animateIn()のアニメーションが終了後に行いたい処理をここに記述

    //3つのボタン生成
    makeButton(_canvas,17,9);
    //_canvas.addEventListener("mouseup", mouseup_button);
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
    _button1.addEventListener("mouseup", mouseup_button);
    _canvas.addChild(_button1);
    

    _button2 = new BitmapButton("red.png");
    _button2.name = "button2";
    _button2.x = _blockWidth*7;
    _button2.y = _blockHeight*3;
    _button2.addEventListener("mouseup", mouseup_button);
    _canvas.addChild(_button2);

    _button3 = new BitmapButton("red.png");
    _button3.name = "button3";
    _button3.x = _blockWidth*12;
    _button3.y = _blockHeight*3;
    _button3.addEventListener("mouseup", mouseup_button);
    _canvas.addChild(_button3);
}

animateOutEnd_grid = (_grid) => {
    console.log("animateOut()終了");
    _grid.removeEventListener("animateOutEnd");
}
*/