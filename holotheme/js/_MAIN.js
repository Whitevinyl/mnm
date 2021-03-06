

// INIT //
var canvas = [];
var ctx = [];
var TWEEN;
var fonts;


// METRICS //
var meters = 0.1;
var halfX = 0;
var halfY = 0;
var fullX = 0;
var fullY = 0;
var units = 0;
var dx = halfX;
var dy = halfY;
var headerType = 0;
var midType = 0;
var dataType = 0;
var bodyType = 0;
var subType = 0;
var device = "desktop";

var TAU = 2 * Math.PI;


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var touchTakeover = false;
var touch;
var mouseIsDown = false;




// COLORS //
var bgCols = [new RGBA(255,100,120,1),new RGBA(120,0,100,1),new RGBA(0,40,170,1),new RGBA(40,50,65,1),new RGBA(5,5,5,1),new RGBA(55,60,65,1)];
var paintCols = [new RGBA(40,50,65,1),new RGBA(190,170,145,1),new RGBA(255,150,155,1),new RGBA(70,200,230,1),new RGBA(255,100,120,1),new RGBA(120,0,100,1),new RGBA(0,0,5,1),new RGBA(0,40,170,1)];
var textureCol = [new RGBA(20,30,255,1),new RGBA(235,98,216,1),new RGBA(10,200,200,1),new RGBA(255,245,235,1),new RGBA(5,5,5,1),new RGBA(255,160,180,1),new RGBA(255,170,170,1),new RGBA(255,140,90,1),new RGBA(255,20,30,1),new RGBA(10,10,70,1),new RGBA(255,80,100,1),new RGBA(70,0,80,1),new RGBA(100,255,200,1),new RGBA(160,150,170,1),new RGBA(220,20,80,1)];
var textureCol2 = [new RGBA(0,0,40,1),new RGBA(0,52,65,1),new RGBA(255,230,140,1),new RGBA(255,80,100,1),new RGBA(255,180,210,1)];
var whiteCol = new RGBA(255,255,255,1);

var paints = [
    new RGBA(255,100,120,1), // 0 rose
    new RGBA(0,20,150,1), // 1 mid blue
    new RGBA(0,240,240,1), // 2 cyan
    new RGBA(255,160,180,1), // 3 pink
    new RGBA(5,5,5,1), // 4 black
    new RGBA(0,0,50,1), // 5 dark blue
    new RGBA(255,230,130,1), // 6 amber
    new RGBA(70,0,80,1), // 7 purple
    new RGBA(250,10,50,1), // 8 red
    new RGBA(0,100,100,1), // 9 grey/green
    new RGBA(10,30,40,1), // 10 dark
    new RGBA(250,120,75,1), // 11 peach
    new RGBA(76,11,120,1), // 12 purple   60,22,95
    new RGBA(0,190,202,1) // 13 grey/green 2  0,120,120
];

var pal0 = [paints[0],paints[0],paints[1]]; // +
var pal1 = [paints[1],paints[1],paints[0]]; // +
var pal2 = [paints[1],paints[8],paints[2]];
var pal3 = [paints[1],paints[1],paints[9]]; // +
var pal4 = [paints[5],paints[7],paints[2]];
var pal5 = [paints[5],paints[6],paints[0]]; // +
var pal6 = [paints[5],paints[0],paints[7]]; // +
var pal7 = [paints[3],paints[0],paints[2]];
var pal8 = [paints[3],paints[1],paints[8]];
var pal9 = [paints[10],paints[1],paints[11]];
var pal10 = [paints[10],paints[9],paints[6]];
var pal11 = [paints[10],paints[10],paints[9]];
var pal12 = [paints[10],paints[10],paints[12]];
var pal13 = [paints[10],paints[10],paints[1]];

var palB0 = [paints[9],paints[9],paints[0]];
var palB1 = [paints[1],paints[1],paints[0]];
var palB2 = [paints[9],paints[9],paints[6]];
var palB3 = [paints[12],paints[12],paints[13]];
var palB4 = [paints[9],paints[9],paints[1]];
var palB5 = [paints[1],paints[1],paints[0]];

var palC1 = [paints[13],paints[13],paints[13]];
var palC2 = [paints[0],paints[0],paints[0]];
var palC3 = [paints[1],paints[1],paints[1]];

var palettes = [pal12,pal11,pal12,pal13];
var palettes2 = [palB3,palB0,palB1,palB5];
var palettes3 = [palC1,palC2,palC2,palC2];
var currentPalette = 0;

var textCol = new RGBA(255,255,255,1);

var lightBalance = 0.98;
//color.lowPass = new RGBA(50,45,25,0);
color.highPass = new RGBA(-30,-30,-40,0);
//color.master = new RGBA(-3,-3,-3,0);

var c1 = paintCols[4];
var c2 = paintCols[7];
var c3 = textureCol[12];
c1 = c2;
c1 = palettes[0][0];
c2 = palettes[0][1];
c3 = palettes[0][2];

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------


function init() {

    // SETUP CANVAS //
    var cnvs = document.getElementById("main");
    var cntx = cnvs.getContext("2d");
    cntx.mozImageSmoothingEnabled = false;
    cntx.imageSmoothingEnabled = false;

    canvas.push(cnvs);
    ctx.push(cntx);


    // FADE IN CSS //
    var intro = document.getElementById("wrapper");
    wrapper.style.opacity = '1';

    /*StartAudioContext(Tone.context, '#main').then(function(){
        //started
    });*/


    // SET CANVAS & DRAWING POSITIONS //
    metrics();


    // INITIALISE THINGS //
    //setupInteraction(canvas[0]);
    //setupAudio();
    setup3d();
    setupDrawing();
    draw();


    // PRELOAD FONTS //
    /*fonts = new Fonts(['Bodoni:n4,o4'],2,function(){
        setupDrawing();
        draw();
    });
    fonts.setup();*/
}




//-------------------------------------------------------------------------------------------
//  MAIN LOOP
//-------------------------------------------------------------------------------------------


function draw() {
    update();
    //drawBG();
    //drawScene();

    requestAnimationFrame(draw);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------


function update() {
    if (TWEEN) {
        TWEEN.update();
    }

    if (scene.animating) {
        scene.animate();
    }

    render3d();
}
