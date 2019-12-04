var cvs;
var ctx;
var paths = [];
var points = [];
var cpath = [];
var clicked;
var hobbygen;
var maxWidth = 10;
var minWidth = 2;
maxWidth -= minWidth;

function init() {
    cvs = document.querySelector('#hobby');
    ctx = cvs.getContext("2d");

    cvs.addEventListener('mousedown', doMouseDown, false);
    cvs.addEventListener('mouseup', doMouseUp, false);
    cvs.addEventListener('mouseout', doMouseOut, false);
    cvs.addEventListener('mousemove', doMouseMove, false);

    cvs.addEventListener('touchstart', doMouseDown, false);
    cvs.addEventListener('touchend', doMouseUp, false);
    cvs.addEventListener('touchcancel', doMouseOut, false);
    cvs.addEventListener('touchmove', doMouseMove, false);

    window.addEventListener('resize', resize, false);
    resize();
    setInterval(draw,50);
}

window.onload = init;

function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    cvs.setAttribute('width', w - 20);
    cvs.setAttribute('height', h - 20);
}

function draw() {
    clear(ctx);
    var pts;
    var sw;
    for (var i = 0; i < paths.length; i++) {
	sw = maxWidth;
	for (var j = 0; j < paths[i].length; j++) {
	    pts = paths[i][j];
	    sw = 0.7*maxWidth + 0.3*(maxWidth*Math.exp(-vecDist(pts[3],pts[0])/10) + minWidth);
	    ctx.beginPath();
	    ctx.lineWidth = sw;
	    ctx.moveTo(pts[0].x, pts[0].y);
	    ctx.bezierCurveTo(
		pts[1].x, pts[1].y,
		pts[2].x, pts[2].y,
		pts[3].x, pts[3].y
	    );
	    ctx.stroke();
	}
    }
}

function getRelativeCoords(event) {
    if (event.offsetX !== undefined && event.offsetY !== undefined) { return { x: event.offsetX, y: event.offsetY }; }
    return { x: event.layerX, y: event.layerY };
}

function doMouseOut(e) {
    e.preventDefault();
    if (clicked) {
	addPoint(getRelativeCoords(e));
    }
    clicked = false;
    hobbygen = false;
}

function doMouseMove(e) {
    e.preventDefault();
    if (clicked) {
	addPoint(getRelativeCoords(e));
    }
}

function doMouseUp(e) {
    e.preventDefault();
    if (clicked) {
	addPoint(getRelativeCoords(e));
    }
    clicked = false;
    hobbygen = false;
}

function doMouseDown(e) {
    e.preventDefault();
    clicked = true;
    points = [getRelativeCoords(e)];
    cpath = [];
    paths.push(cpath);
    hobbygen = false;
}

function addPoint(p) {
    points.push(p);
    if (!hobbygen) {
	hobbygen = generateHobby(points[0], points[1]);
	cpath[0] = [points[0],points[0],points[1],points[1]];
    } else {
	var r = hobbygen.next(p).value;
	cpath[cpath.length - 1] = r[0];
	cpath.push(r[1]);
    }
}

var ha = Math.sqrt(2);
var hb = 1/16;
var hc = (3 - Math.sqrt(5))/2;
var hd = 1 - hc;

function hobbySegment(a,tha, phb, b) {
    var c = {};
    c.x = b.x - a.x;
    c.y = b.y - a.y;
    var sth = Math.sin(tha);
    var cth = Math.cos(tha);
    var sph = Math.sin(phb);
    var cph = Math.cos(phb);
    var alpha = ha * (sth - hb * sph) * (sph - hb * sth) * (cth - cph);
    var rho = (2 + alpha)/(1 + hd * cth + hc * cph);
    var sigma = (2 - alpha)/(1 + hd * cph + hc * cth);
    var ca = {};
    ca.x = a.x + rho * (cth * c.x - sth * c.y)/3; 
    ca.y = a.y + rho * (sth * c.x + cth * c.y)/3; 
    var cb = {};
    cb.x = b.x - sigma * (cph * c.x + sph * c.y)/3; 
    cb.y = b.y - sigma * (-sph * c.x + cph * c.y)/3; 
    return [a, ca, cb, b];
}

function quickHobby(a,b,c,tha) {
    var da = vecDist(b,a);
    var db = vecDist(c,b);
    var wa = vecAng(b,a);
    var wb = vecAng(c,b);
    var psi = wb - wa;
    var thb, phb, phc;
    if (tha) {
	thb = -(2*psi + tha) * db / (2 * db + da);
	phb = - psi - thb;
	phc = thb;
    } else {
	thb = -psi * db / (da + db);
	tha = -psi - thb;
	phb = tha;
	phc = thb;
    }
    return [hobbySegment(a,tha, phb,b), hobbySegment(b,thb, phc,c), thb];
}

function* generateHobby (a,b) {
    var th;
    var p,c;
    p = [[a,a,b,b],[a,a,b,b]];
    while (true) {
	c = yield [p[0],p[1]];
	p = quickHobby(a,b,c,th);
	th = p[2];
	a = b;
	b = c;
    }
}

function vecDist(a,b) {
    return Math.sqrt( Math.pow(b.x - a.x,2) + Math.pow(b.y - a.y,2));
}

function vecAng(a,b) {
    var x = b.x - a.x;
    var y = b.y - a.y;
    return Math.atan2(y,x);
}

function clear(c) {
    c.save();
    c.setTransform(1,0,0,1,0,0);
    c.clearRect(0,0,c.canvas.width,c.canvas.height);
    c.restore();
}
