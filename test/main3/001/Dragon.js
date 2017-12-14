/***********************************************
 * Dragon Class (ver.2017-12-14TXX:XX)
***********************************************/

class Dragon {
    constructor(_canvas) {
        this.__canvas = _canvas;

        this.__alpha = 1;

        this.__bitmapArray = [];
        this.__bitmap0 = new toile.Bitmap("box.png");
        this.__bitmap0.alpha = 0;
        this.__bitmap0.x = _canvas.width + 50; //_canvas.width - 5;
        this.__bitmap0.y = _canvas.height/2 - 30;
        _canvas.addChild(this.__bitmap0);
        this.__bitmapArray.push(this.__bitmap0);

        for (let i = 1; i < 1000; i++) {
            let _bitmap = new toile.Bitmap("box.png");
            _bitmap.x = this.__bitmap0.x;
            _bitmap.y = this.__bitmap0.y;
            this.__bitmapArray.push(_bitmap);
            this.__canvas.addChild(_bitmap);
        }
    }

    move(_x, _y) {
        var _bitmap1 = this.__bitmapArray[0];
        _bitmap1.x += (_x - _bitmap1.x) / 3;
        _bitmap1.y += (_y - 20 - _bitmap1.y) / 3;

        for (let i=1; i<this.__bitmapArray.length; i++) {
            let _theBitmap = this.__bitmapArray[i];
            let _leftBitmap = this.__bitmapArray[i - 1];
            _theBitmap.x += (_leftBitmap.x + 2 - _theBitmap.x) / 5;
            _theBitmap.y += (_leftBitmap.y - _theBitmap.y) / 5;

            let _disX = _leftBitmap.x - _theBitmap.x;
            let _disY = _leftBitmap.y - _theBitmap.y;
            let _radian = Math.atan2(_disY, _disX);
            _theBitmap.rotateRadian = _radian + Math.PI;
        }
    }

    set alpha(newValue) {
        this.__alpha = newValue;
        for (let i=1; i<this.__bitmapArray.length; i++) {
            this.__bitmapArray[i].alpha = newValue;
        }
        // this.__bitmapArray.forEach(function(_bitmap) {
        //     _bitmap.alpha = newValue;
        // });
    }

    get alpha() {
        return this.__alpha;
    }
}