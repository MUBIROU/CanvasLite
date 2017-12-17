addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas1);
    _canvas.fps = 60;
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true);
    _canvas.borderWidth = 2;

    _canvas.addEventListener("mousemove", mousemove_canvas);
    _canvas.enabledMouseMove(true);

    _uiList = [];
    _count = 0;
    _mouseX = _canvas.width/2 - 140/2;
    _mouseY = 768/2-30;

    //三色グラデーション
    _3colors = new toile.Bitmap("../../common/3colorsDark.png");
    _3colors.alpha = 0;
    _canvas.addChild(_3colors);
    _uiList.push(_3colors);
    _canvas.setDepthIndex(_3colors, 0);

    //HTML5
    _html5 = new toile.Bitmap("../../common/html5.png");
    _html5.x = 15;
    _html5.y = 15;
    _canvas.addChild(_html5);
    _uiList.push(_html5);

    //demae
    _demae = new toile.SpriteSheet("demae.png");
    _demae.fps = 10;
    _demae.x = _canvas.width/2 - 140/2;
    _demae.y = _canvas.height - 210 - 80;
    _canvas.addChild(_demae);
    _uiList.push(_demae);

    //soba1
    _sobaArray = [];
    _soba1 = new toile.Bitmap("soba.png");
    _soba1.x = _demae.x + 5;
    _soba1.y = _demae.y + 21;
    _sobaArray.push(_soba1);
    _canvas.addChild(_soba1);
    _uiList.push(_soba1);

    //soba2...
    _saraNum = 50;
    for (let i=1; i<_saraNum; i++) {
        let _theSoba = new toile.Bitmap("soba.png");
        _theSoba.x = _soba1.x;
        _theSoba.y = _soba1.y - (10 * i);
        _theSoba.regX = 25;
        _theSoba.regY = 10;
        _sobaArray.push(_theSoba);
        _canvas.addChild(_theSoba);
        _uiList.push(_theSoba);
    }

    //groundLine
    _groundLine = new toile.Line(0,_demae.y+205,_canvas.width,_demae.y+205);
    _groundLine.lineWidth = 2;
    _canvas.addChild(_groundLine);
    _uiList.push(_groundLine);

    //「バックボタン」関連
    _backButton = new toile.Bitmap("../../common/back.png");
    _backButton.x = _canvas.width - 64 - 15; // - 64 - 15;
    _backButton.y = 15;
    _canvas.addChild(_backButton);
    _uiList.push(_backButton);

    //「シナノロゴ」関連
    _shinanologo = new toile.Bitmap("../../common/shinanologo.png");
    _shinanologo.x = _canvas.width - 64 - 245;
    _shinanologo.y = _canvas.height -37 -10;
    _canvas.addChild(_shinanologo);
    _uiList.push(_shinanologo);

    //"50th Anniversary"
    _50th = new toile.Bitmap("../../common/50thlogo.png");
    _50th.x = _canvas.width / 2 - 165;
    _50th.y = _canvas.height - 70;
    _50th.alpha = 1; //0.8;
    _canvas.addChild(_50th);
    _uiList.push(_50th);

    //一度全て消す
    _uiList.forEach(function(_bitmap) {
        _bitmap.alpha = 0;
    });

    _uiFadeInID = setInterval(_uiFadeIn, 17);
}

mousemove_canvas = (_canvas) => {
    _mouseX = _canvas.mouseX;
    _mouseY = _canvas.mouseY;
}

enterframe_canvas1 = (_canvas) => {
    _canvas.drawScreen("#fefefe");
}

enterframe_canvas2 = (_canvas) => {
    _demae.x += (_mouseX - _demae.x) / 10;
    _demae.x += randomInt(-1, 1)/2;
    //_demae.y +- randomInt(-1, 1);
    
    //1枚目
    _soba1.x += (_demae.x + 5 - _soba1.x) / 1.8;

    for (let i=1; i<_saraNum; i++) { //2枚目以降…
        let _theSoba = _sobaArray[i];
        let _upSoba = _sobaArray[i-1];
        _theSoba.x += (_upSoba.x - _theSoba.x) / 1.8;
        var _disX = _upSoba.x - _theSoba.x + 21;
        var _disY = _upSoba.y - _theSoba.y + 5;
        var _radian = Math.atan2(_disY, _disX) + Math.PI/20;
        _theSoba.rotateRadian = _radian - Math.PI/4;
    }
    _canvas.drawScreen("#fefefe");
}

//============
// backボタン
//============
mouseup_backButton = (_bitmap) => {
    //console.log("back");
    //効果音
    _se1 = new toile.Sound("../../common/se1.wav");
    _se1.play();

    //_homeButton.removeEventListener("mouseup");
    _backButton.removeEventListener("mouseup");

    _uiFadeOutID = setInterval(_uiFadeOut, 17, "back");
}

_uiFadeIn = () => {
    _uiList.forEach(function(_bitmap) {
        if (_bitmap.alpha < 1) {
            _bitmap.alpha += 0.02; //05;
        } else {
            _count ++;
            if (_count == _uiList.length) { //ul個数分繰り返されてしまう為
                clearInterval(_uiFadeInID);
                _bitmap.alpha = 1;
                //_homeButton.addEventListener("mouseup", mouseup_homeButton);
                _backButton.addEventListener("mouseup", mouseup_backButton);
                _canvas.setDepthIndex(_html5, _canvas.getDepthMax());
                _count = 0;

                _canvas.removeEventListener("enterframe");
                _canvas.addEventListener("enterframe", enterframe_canvas2);
            }
        }
    });
}

_uiFadeOut = (_string) => {
    _uiList.forEach(function(_bitmap) {
        if (0 < _bitmap.alpha) {
            _bitmap.alpha -= 0.01;
        } else {
            _count ++;
            if (_count == _uiList.length) { //ul個数分繰り返されてしまう為
                _bitmap.alpha = 0;
                if (_string == "home") {
                    location.href = "../../main0/index0.html?param=true"
                } else if (_string == "back") {
                    location.href = "../../main3/index3.html"
                }
            }
        }
    });
}

//==========
// 汎用関数
//==========
randomInt = (_min, _max) => {
    return Math.floor(Math.random()*(_max-_min+1))+_min;
}