addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.addEventListener("mouseup", mouseup_canvas);
    _canvas.fps = 60;
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true);
    _canvas.borderWidth = 2;

    _gridStatus = "off"; //Gridの表示状態
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#fefefe"); //SpriteSheet内に白（#ffffff）がある場合
}

mouseup_canvas = (_canvas) => {
    if (_gridStatus == "off") {
        _grid = new Grid(_canvas,17,9); //Canvasを横17,縦9に分割
        _grid.lineColor = "187,187,187"; //初期値"0,0,0"
        _grid.lineWidth = 4; //初期値1
        _grid.in(); //初期値2（秒）
        _grid.addEventListener("in", in_grid);
        _gridStatus = "animate"; //Gridの表示状態

        //3つのBitmapPlusボタンの表示準備
        _blockWidth = _canvas.width / 17;
        _blockHeight = _canvas.height / 9;

        _button1 = new SpriteSheetPlus("SpriteSheetButton1.png", true, "255,255,255", "0,0,0", 4);
        _button2 = new SpriteSheetPlus("SpriteSheetButton1.png", true, "255,255,255", "0,0,0",4);
        _button3 = new SpriteSheetPlus("SpriteSheetButton1.png", true, "255,255,255", "0,0,0",4);

        _buttonArray = [_button1, _button2, _button3];
        for (let i=0; i<_buttonArray.length; i++) {
            let _theButton = _buttonArray[i];
            _theButton.name = "button" + (i+1); //"buttun1" => "button2" => "button3"
            _theButton.addEventListener("mouseup", mouseup_button);
            _theButton.addEventListener("delete", delete_button);
            _theButton.x = _blockWidth * (2 + i * 5); //2 => 7 => 12
            _theButton.y = _blockHeight * 3;
            _theButton.fps = 10; //各SpriteSheetPlusのfpsの値が異なる場合はfor文の外で処理
            _canvas.addChild(_theButton);
            _theButton._timerID = setTimeout(callback_button_in, (640 + 330 * i), _theButton);
        }
    }
}

in_grid = (_grid) => {
    _gridStatus = "on"; //Gridの表示状態
    _grid.removeEventListener("in");
}

mouseup_button = (_button) => {
    _grid._timerID = setTimeout(callback_grid_out, 1520);

    switch (_button.name) {
        case "button1":
            _button2._timerID = setTimeout(callback_button_out, 300, _button2);
            _button3._timerID = setTimeout(callback_button_out, 600, _button3);
            _lastButton = _button3;
            break;
        case "button2":
            _button1._timerID = setTimeout(callback_button_out, 600, _button1);
            _button3._timerID = setTimeout(callback_button_out, 600, _button3);
            _lastButton = _button3;
            break;
        case "button3":
            _button1._timerID = setTimeout(callback_button_out, 600, _button1);
            _button2._timerID = setTimeout(callback_button_out, 300, _button2);
            _lastButton = _button1;
    }
}

delete_button = (_button) => {
    _canvas.deleteChild(_button);
}

callback_button_in = (_button) => {
    _button.in(); //初期値1（秒）
    clearTimeout(_button._timerID);
}

callback_button_out = (_button) => {
    _button.out(); //初期値1（秒）
    clearTimeout(_button._timerID);
}

callback_grid_out = () => {
    _grid.out(1); //初期値2（秒）
    _grid.addEventListener("out", out_grid);
    _gridStatus = "animate"; //Gridの表示状態
}

out_grid = (_grid) => {
    _gridStatus = "off";
    _grid.removeEventListener("in");
    
    //location.href = "index2.html";
}
