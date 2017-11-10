addEventListener("load", load_window, false);
function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true)
    _canvas.fps = 60;

    //Video
    _video1 = new toile.Video("bgv1.mp4", 1360, 768);
    _video1.isLoop(true);
    _video1.alpha = 0;
    _canvas.addChild(_video1);
    _timerVideo1 = setInterval(callbackFunction, 17, _canvas);

    //五線譜の生成
    createScoreLine();

    _cdArray = [];
    for (let i=0; i<12; i++) {
        _theCD = new toile.Bitmap("tmp1.png");
        _theCD.name = "CD" + (i+1);
        _theCD.x = _canvas.width/2 - 50 + 270 * Math.cos(Math.PI/6 * i - Math.PI/2); //半径320（幅）
        _theCD.y = _canvas.height/2 - 50 + 270 * Math.sin(Math.PI/6 * i - Math.PI/2); //半径270（高さ）
        _theCD.alpha = 0.7;
        _canvas.addChild(_theCD);
        //_theCD.alpha = 0.8;
        _cdArray.push(_theCD);
    }
    //_cdArray[0].alpha = 1;

    //「ホームに戻るボタン」関連
    _homeButton = new toile.Bitmap("../common/home.png");
    _homeButton.addEventListener("mouseup", mouseup_homeButton);
    _homeButton.x = _canvas.width - 64 - 15;
    _homeButton.y = _canvas.height - 64 - 15;
    _canvas.addChild(_homeButton);

    //「oooボタン」関連
    _oooButton = new toile.Bitmap("oooButton.png");
    _oooButton.x = _canvas.width - 64 - 15;
    _oooButton.y = 15;
    _canvas.addChild(_oooButton);

    //「xxxボタン」関連
    _xxxButton = new toile.Bitmap("xxxButton.png");
    _xxxButton.x = 15;
    _xxxButton.y = _canvas.height - 64 - 15;
    _canvas.addChild(_xxxButton);

    _logo = logo(_canvas, 15, 15);
}

callbackFunction = (_canvas) => {
    if (_video1.isLoaded()) {
        if (_video1.alpha < 1) {
            _video1.alpha += 0.01;
        } else {
            clearInterval(_timerVideo1);
        }
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

//五線譜の生成
createScoreLine = () => {
    _scoreContainer = new toile.Container();
    _scoreContainer.x = _canvas.width/2;
    _scoreContainer.y = _canvas.height/2;
    _canvas.addChild(_scoreContainer);

    //Line1
    _scoreCircle1 = new toile.Circle(0,0,258);
    _scoreCircle1.x = -258;
    _scoreCircle1.y = -258;
    _scoreCircle1.alpha = 0.5;
    _scoreContainer.addChild(_scoreCircle1);

    //Line2
    _scoreCircle2 = new toile.Circle(0,0,264);
    _scoreCircle2.x = -264;
    _scoreCircle2.y = -264;
    _scoreCircle2.alpha = 0.5;
    _scoreContainer.addChild(_scoreCircle2);

    //Line3
    _scoreCircle3 = new toile.Circle(0,0,270);
    _scoreCircle3.x = -270;
    _scoreCircle3.y = -270;
    _scoreCircle3.alpha = 0.5;
    _scoreContainer.addChild(_scoreCircle3);

    //Line4
    _scoreCircle4 = new toile.Circle(0,0,276);
    _scoreCircle4.x = -276;
    _scoreCircle4.y = -276;
    _scoreCircle4.alpha = 0.5;
    _scoreContainer.addChild(_scoreCircle4);

    //Line5
    _scoreCircle5 = new toile.Circle(0,0,282);
    _scoreCircle5.x = -282;
    _scoreCircle5.y = -282;
    _scoreCircle5.alpha = 0.5;
    _scoreContainer.addChild(_scoreCircle5);
}


enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#fefefe");
}


mouseup_homeButton = (_bitmap) => {
    //ホーム（../main0/index0.html）にジャンプ
    location.href = "../main0/index0.html?param=true"
}