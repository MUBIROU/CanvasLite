addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.fps = 60;
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true);
    _canvas.borderWidth = 2;

    _uiList = [];
    _count = 0;

    //HTML5
    _html5 = new toile.Bitmap("../common/html5.png");
    _html5.x = 15;
    _html5.y = 15;
    _canvas.addChild(_html5);
    _uiList.push(_html5);

    //「ホームに戻るボタン」関連
    _homeButton = new toile.Bitmap("../common/home.png");
    _homeButton.x = _canvas.width - 64 - 15;
    _homeButton.y = 15; //_canvas.height - 64 - 15;
    //_homeButton.addEventListener("mouseup", mouseup_homeButton);
    _canvas.addChild(_homeButton);
    _uiList.push(_homeButton);

    //「シナノロゴ」関連
    _shinanologo = new toile.Bitmap("../common/shinanologo.png");
    _shinanologo.x = _canvas.width - 64 - 245;
    _shinanologo.y = _canvas.height -37 -10;
    _canvas.addChild(_shinanologo);
    _uiList.push(_shinanologo);

    //"50th Anniversary"
    _50th = new toile.Bitmap("../common/50thlogo.png");
    _50th.x = _canvas.width / 2 - 165;
    _50th.y = _canvas.height - 70;
    _50th.alpha = 1; //0.8;
    _canvas.addChild(_50th);
    _uiList.push(_50th);

    //===============================
    // BjornBitmap（1～11個）の生成
    //===============================
    _bjornBitmapList = [];
    for (let i=1; i<=11; i++) {
        let _thePNG = "content" + i + ".png";
        let _theBjornBitmap = new BjornBitmap(_canvas, _thePNG, i*1360/12-75,
            - 150, 768/2 - randomInt(100,200) //平均-150
        )
        _theBjornBitmap.name = "bjornBitmap" + i;
        _bjornBitmapList.push(_theBjornBitmap);
    }

    //===============================
    // BjornBitmap（12～21個）の生成
    //===============================
    for (let i=12; i<=21; i++) {
        let _thePNG = "content" + i + ".png";
        //console.log(_thePNG);
        let _theBjornBitmap = new BjornBitmap(_canvas, _thePNG, (i-11)*1360/12-17,
            - 150, //- 150
            768/2 + randomInt(30, 130), //平均+80
            0.77
        )
        _theBjornBitmap.name = "bjornBitmap" + i;
        _bjornBitmapList.push(_theBjornBitmap);
        _canvas.setDepthIndex(_theBjornBitmap, 0);
    }

    //1を最上位にする場合
    _canvas.setDepthIndex(_bjornBitmapList[0], _canvas.getDepthMax());

    //===================
    // 全BjornBitmap共通
    //===================
    _bjornBitmapList.forEach(function(_bjornBitmap) {
        _bjornBitmap.addEventListener("in", in_bjornBitmap);
    });

    //三色グラデーション
    _3colors = new toile.Bitmap("../common/3colorsDark.png");
    _3colors.alpha = 0;
    _canvas.addChild(_3colors);
    _uiList.push(_3colors);
    _canvas.setDepthIndex(_3colors, 0);

    _startTimeOutID = setTimeout(startTimeOut, 800); //演出上少し時間をあける

    //一度全て消す
    _uiList.forEach(function(_bitmap) {
        _bitmap.alpha = 0;
    });
    _uiFadeInID = setInterval(_uiFadeIn, 17);
}

startTimeOut = () => { //this == Window
    //1～11個
    for (let i=0; i<11; i++) {
        let _millsec = Math.random()*300;
        _bjornBitmapList[i].start(_millsec);
    }

    //12～21個
    for (let i=11; i<21; i++) {
        let _millsec = Math.random()*300+500;
        _bjornBitmapList[i].start(_millsec);
    }

    // _bjornBitmapList.forEach(function(_bjornBitmap) {
    //     let _millsec = Math.random()*300;
    //     _bjornBitmap.start(_millsec);
    // });
    clearInterval(_startTimeOutID);
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#fefefe");
}

//============
// HOMEボタン
//============
mouseup_homeButton = (_bitmap) => {
    //効果音
    _se1 = new toile.Sound("../common/se1.wav");
    _se1.play();

    _uiFadeOutID = setInterval(_uiFadeOut, 17);

    _bjornBitmapList.forEach(function(_bjornBitmap) {
        let _millsec = Math.random()*300;
        _bjornBitmap.end(_millsec);
        _bjornBitmap.removeEventListener("mouseup");
        //_bjornBitmap.removeEventListener("end");
    });
}

_uiFadeIn = () => {
    _uiList.forEach(function(_bitmap) {
        if (_bitmap.alpha < 1) {
            _bitmap.alpha += 0.02; //05;
        } else {
            clearInterval(_uiFadeInID);
            _bitmap.alpha = 1;
        }
    });

    _canvas.setDepthIndex(_html5, _canvas.getDepthMax());
}

_uiFadeOut = () => {
    _uiList.forEach(function(_bitmap) {
        if (0 < _bitmap.alpha) {
            _bitmap.alpha -= 0.02;
        } else {
            _bitmap.alpha = 0;
            //location.href = "../main0/index0.html?param=true"
        }
    });
}

//==================
// イベントリスナー
//==================
in_bjornBitmap = (_bjornBitmap) => {
    _count ++;
    //全て登場し終えたら選択可能にする
    if (_count == _bjornBitmapList.length) {
        _bjornBitmapList.forEach(function(_bjornBitmap) {
            _bjornBitmap.addEventListener("mouseup", mouseup_bjornBitmap, true);
            _bjornBitmap.addEventListener("end", end_bjornBitmap);
            _homeButton.addEventListener("mouseup", mouseup_homeButton);
        });
        _count = 0;
    }
}

mouseup_bjornBitmap = (_bjornBitmap) => {
    //console.log(_bjornBitmap.name);
    //効果音
    _se1 = new toile.Sound("../common/se1.wav");
    _se1.play();
    _canvas.stopMouseUpEvent(); //ボタンが重なっているところの対策

    _uiFadeOutID = setInterval(_uiFadeOut, 17);
    _bjornBitmap.end();

    _bjornBitmapList.forEach(function(_theBjornBitmap) {
        let _millsec = Math.random()*200 + 500;
        if (_theBjornBitmap != _bjornBitmap) {
            _theBjornBitmap.end(_millsec);
        }
    });
}

end_bjornBitmap = (_bjornBitmap) => {
    if (_count == 0) {
        var _choiceName = _bjornBitmap.name;
    }
    _count ++;
    if (_count == _bjornBitmapList.length) {
        //location.href = "../main0/index0.html?param=true"
        setTimeout(waitURL, 300, _choiceName); //少し待ってHOMEページへ
    }
}

waitURL = (_choiceName) => {
    console.log(_choiceName);
    location.href = "../main0/index0.html?param=true"
}

//==========
// 汎用関数
//==========
randomInt = (_min, _max) => {
    return Math.floor(Math.random()*(_max-_min+1))+_min;
}