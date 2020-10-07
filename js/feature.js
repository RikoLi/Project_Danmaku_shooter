// 测试新特性

console.log('feature.js is loaded');

class Canvas {

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.pen = this.canvas.getContext('2d');
        this.WIDTH = this.canvas.getAttribute('width');
        this.HEIGHT = this.canvas.getAttribute('height');
    }

    initBoundary() {
        this.pen.beginPath();
        this.pen.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.pen.moveTo(0, 0);
        this.pen.lineTo(this.WIDTH, 0);
        this.pen.lineTo(this.WIDTH, this.HEIGHT);
        this.pen.lineTo(0, this.HEIGHT);
        this.pen.lineTo(0, 0);
        this.pen.stroke();
    }
}


// 可以进行鼠标跟随的对象
class Ball {
    
    constructor(radius, targetCanvas) {
        this.radius = radius;
        targetCanvas.canvas.addEventListener('mousemove', (ev) => {
            // console.log(ev.offsetX, ev.offsetY);
            targetCanvas.initBoundary();
            this.render(targetCanvas.pen, ev.offsetX, ev.offsetY);
        });
    }

    render(pen, x, y) {
        pen.beginPath();
        pen.fillStyle = 'red';
        pen.arc(x, y, this.radius, 0, 360);
        pen.stroke();
        pen.fill();
    }
}

let cvs = new Canvas();
cvs.initBoundary();

let player = new Ball(10, cvs);

