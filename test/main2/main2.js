addEventListener("load", load_window, false);
function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true)
    _canvas.fps = 60;

    //Video
    // _video1 = new toile.Video("bgv1.mp4", 1360, 768);
    // _video1.isLoop(true);
    // _video1.alpha = 0;
    // _canvas.addChild(_video1);
    // _timerVideo1 = setInterval(videoLoadLoop, 17, _canvas);

    //五線譜の生成
    _scoreLine = new ScoreLine(_canvas);
    _scoreLine.addEventListener("in", in_scoreLine);
    _scoreLine.addEventListener("out", out_scoreLine);
    _scoreLine.in();

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

    //loopModeButton
    _loopModeButton = new toile.SpriteSheet("loopModeButton.png");
    _loopModeButton.addEventListener("load", load_loopModeButton);
    _loopModeButton.addEventListener("mouseup", mouseup_loopModeButton);
    _loopModeButton.x = _canvas.width/2 - 32;
    _loopModeButton.y = _canvas.height/2 + 85;
    //_loopModeButton.alpha = 0.9;
    _canvas.addChild(_loopModeButton);

    _logo = logo(_canvas, 15, 15);

    //"Music is VFR"
    _text4 = new toile.Text("Music is VFR");
    _text4.addWebFont("VV2NIGHTCLUB", "../common/VV2NIGHTCLUB.OTF", "opentype");
    _text4.font = "VV2NIGHTCLUB";
    _text4.color = "#222222"; //"#ffffff";
    _text4.size = 16; //80;
    _text4.align = "center"
    _text4.baseline = "middle";
    _text4.alpha = 0.3;
    _text4.x = _canvas.width/2;
    _text4.y = _canvas.height/2 + 167;
    _canvas.addChild(_text4);
}

in_scoreLine = (_scoreLine) => {
    _circleMenu = new CircleMenu(_canvas);
    _circleMenu.addEventListener("in", in_circleMenu)
    _circleMenu.addEventListener("out", out_circleMenu);
}

videoLoadLoop = (_canvas) => {
    if (_video1.isLoaded()) {
        if (_video1.alpha < 1) {
            _video1.alpha += 0.01;
        } else {
            _video1.alpha = 1;
            clearInterval(_timerVideo1);
            //console.log("video")
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

    //"50th Anniversary"
    _text50th = new toile.Text("50th Anniversary");
    _text50th.addWebFont("FoglihtenNo04", "../common/FoglihtenNo04-070.otf", "opentype");
    _text50th.font = "FoglihtenNo04";
    _text50th.size = 28; //80;
    _text50th.align = "center";
    _text50th.baseline = "bottom";
    _text50th.x = _canvas.width / 2;
    _text50th.y = _canvas.height - 20;
    _text50th.color = "#222222";
    _logoContainer.addChild(_text50th);

    return _logoContainer;
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#fefefe");
}

load_loopModeButton = (_spriteSheet) => {
    _spriteSheet.gotoAndStop(2);
}

mouseup_loopModeButton = (_spriteSheet) => {
    var _nextframe = _spriteSheet.currentframe + 1;
    if (_spriteSheet.totalframes < _nextframe) {
        _nextframe = 1;
    }
    switch (_nextframe) {
        case 1: _circleMenu.loopMode = "none"; break;
        case 2: _circleMenu.loopMode = "one"; break;
        case 3: _circleMenu.loopMode = "all"; break;
        case 4: _circleMenu.loopMode = "random"; break;
        default: throw new Error("main2:mouseup_loopModeButton()");
    }
    _spriteSheet.gotoAndStop(_nextframe);
}

//============
// HOMEボタン
//============
mouseup_homeButton = (_bitmap) => {
    //ホーム（../main0/index0.html）にジャンプ
    //location.href = "../main0/index0.html?param=true"
    _scoreLine.out(); //DEBUG
    _circleMenu.out();
    _photoMovie.end();

    _timerHomeButtonID = setInterval(timerHomeButton, 17, _canvas);
}

//=====================
// HOMEボタンの後処理
//=====================
timerHomeButton = () => {
    console.log("timerHomeButton");
}

out_scoreLine = (_scoreLine) => {
    //console.log("scoreline");
    //location.href = "../main0/index0.html?param=true"
}

in_circleMenu = (_circleMenu) => {
    //console.log("in_circleMenu");
    //location.href = "../main0/index0.html?param=true"
    //PhotoMovie
    _photoMovie = new PhotoMovie(_canvas);
    _photoMovie.addEventListener("end", end_photoMovie);
    _photoMovie.start();
}

end_photoMovie = (_photoMovie) => {
    //console.log("end_photoMovie");
    //location.href = "../main0/index0.html?param=true"
    location.href = "index2.html"
}

out_circleMenu = (_circleMenu) => {
    //console.log("circlemenu");
    //location.href = "../main0/index0.html?param=true"
    //location.href = "index2.html"
}