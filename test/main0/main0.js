addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.addEventListener("mouseup", mouseup_canvas);
    _canvas.fps = 60;
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true);
    _canvas.borderWidth = 2;

    _logo = logo(_canvas, 15, 15);

    _gridStatus = "off"; //Gridの表示状態
    _yubi = undefined;

    if (location.href.indexOf("?", 0) == -1) {
        _yubi = new toile.Bitmap("yubi.png");
        _yubi.x = _canvas.width / 2 - 50;
        _yubi.y = _canvas.height / 2 - 60;
        _canvas.addChild(_yubi);
    } else {
        start(_canvas);
    }

}

logo = (_canvas, _x, _y) => {
    _logoContainer = new toile.Container();
    _logoContainer.x = _x;
    _logoContainer.y = _y;
    _canvas.addChild(_logoContainer);

    //"CREA"
    _text1 = new toile.Text("CREA");
    _text1.addWebFont("VV2NIGHTCLUB", "../common/VV2NIGHTCLUB.OTF", "opentype");
    _text1.font = "VV2NIGHTCLUB";
    _text1.size = 25; //80;
    _text1.x = 38 + 5; //1165; //20;//12;
    _text1.y = -3; //-1;
    _text1.color = "#222222";
    _logoContainer.addChild(_text1);

    //"TED BY"
    _text2 = new toile.Text("TED BY");
    _text2.addWebFont("VV2NIGHTCLUB", "../common/VV2NIGHTCLUB.OTF", "opentype");
    _text2.font = "VV2NIGHTCLUB";
    _text2.size = 25; //80;
    _text2.x = 113 + 5; //1165; //20;//12;
    _text2.y = -3; //-1;
    _text2.color = "#222222";
    _logoContainer.addChild(_text2);

    //"SHINANOJS"
    _text3 = new toile.Text("SHINANOJS");
    _text3.addWebFont("VV2NIGHTCLUB", "../common/VV2NIGHTCLUB.OTF", "opentype");
    _text3.font = "VV2NIGHTCLUB";
    _text3.size = 28; //80;
    _text3.x = 38 + 5; //1165; //20;//12;
    _text3.y = 20; //-1;
    _text3.color = "#222222";
    _logoContainer.addChild(_text3);

    _line = new toile.Line(38,0,215,0);
    _line.x = 38 + 5;
    _line.y = 21;
    _line.lineWidth = 1;
    _line.lineColor = "64,64,64";
    _logoContainer.addChild(_line);

    //"HTML5 logo"
    _html5 = new toile.Bitmap("../common/html5.png"); //html5.png");
    _html5.x = 0; //_canvas.width - 230;
    _html5.y = 0; //_canvas.height - 70;
    _logoContainer.addChild(_html5);

    return _logoContainer;
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#fefefe"); //SpriteSheet内に白（#ffffff）がある場合
}

mouseup_canvas = (_canvas) => {
    if (_yubi != undefined) {
        _canvas.deleteChild(_yubi);
    }
    start(_canvas);
}

start = (_canvas) => {
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

    _canvas.setDepthIndex(_logo, _canvas.getDepthMax());
}

in_grid = (_grid) => {
    _gridStatus = "on"; //Gridの表示状態
    _grid.removeEventListener("in");
}

mouseup_button = (_button) => {
    _grid._timerID = setTimeout(callback_grid_out, 1520);

    switch (_button.name) {
        case "button1":
            _choiceNum = 1;
            _button2._timerID = setTimeout(callback_button_out, 300, _button2);
            _button3._timerID = setTimeout(callback_button_out, 600, _button3);
            _lastButton = _button3;
            break;
        case "button2":
            _choiceNum = 2;
            _button1._timerID = setTimeout(callback_button_out, 600, _button1);
            _button3._timerID = setTimeout(callback_button_out, 600, _button3);
            _lastButton = _button3;
            break;
        case "button3":
            _choiceNum = 3;
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
    
    //location.href = "../main3/index3.html?param1=100&param2=200"
    //location.href = "../main" + _choiceNum + "/" + "index" + _choiceNum + ".html?" + "param1=100" + "&" + "param2=200";
    location.href = "../main1/index1.html";
}