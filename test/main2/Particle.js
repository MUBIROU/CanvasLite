/***********************************************
 * Particle Class (ver.2017-12-08T14:53)
***********************************************/


class Particle {
    constructor(_canvas, _theCD) {
        this.__canvas = _canvas;

        this.__pngList = ["note1.png", "note2.png"];
        this.__noteList = [];

        this.__timerLoopID = setInterval(this.__timerLoop, 17, this);
        for (let i=0; i<7; i++) {
            let _thePNG = this.__pngList[Math.floor(Math.random()*2)];

            let _bitmap = new toile.Bitmap(_thePNG);
            _bitmap.speedY = -3 - Math.random()*6; //-5 - Math.random()*10;
            _bitmap.speedX = -5 + Math.random()*10; //-3 + Math.random()*6;
            _bitmap.speedR = Math.random()*6 - 3;
            _bitmap.x = _theCD.x + 40 + Math.floor(Math.random()*(30-30+1)-30); //_theCD.x + 50 - 10;
            _bitmap.y = _theCD.y + 42 + Math.floor(Math.random()*(30-30+1)-30); //_theCD.y + 50 - 8;
            _canvas.addChild(_bitmap);

            this.__noteList.push(_bitmap);
        }
    }

    __timerLoop(_this) {
        for (let _indexNum in _this.__noteList) {
            let _bitmap = _this.__noteList[_indexNum];
            _bitmap.speedY += 0.3;
            _bitmap.alpha -= 0.02;
            _bitmap.rotate += _bitmap.speedR;
            let _nextY = _bitmap.y + _bitmap.speedY;
            if (0.05 < _bitmap.alpha) {
                _bitmap.x = _bitmap.x + _bitmap.speedX;
                _bitmap.y = _nextY;
            } else {
                _this.__noteList.splice(_indexNum,1);
                _canvas.deleteChild(_bitmap);
                //console.log(_this.__noteList.length);
            }
        }
    }
}