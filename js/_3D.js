

//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

var scene,scene3d,renderer3d,directional3d,ambient3d,col3d,materialType,lastAngle;
var cameraDepth = 20 * meters;
var building;
var destAngle = 0;
var camera;

function setup3d() {

    // setup renderer //
    renderer3d = new THREE.WebGLRenderer({antialias: true});
    renderer3d.setSize( window.innerWidth, window.innerHeight );
    var parent = document.getElementById('app');
    parent.appendChild( renderer3d.domElement );


    // setup view //
    scene3d = new THREE.Scene();

    // create & point camera //
    if (device==='mobile') {
        cameraDepth = 85 * meters;
    }
    camera = new Camera(cameraDepth, new THREE.Vector3(0,0,0), 0.004, 0.02, 0.6 * meters, 3.5*meters, 50);

    // create fog & background color //
    setSceneColor();

    // lighting //
    materialType = THREE.MeshBasicMaterial;
    addlighting();

    // create scene //
    scene = new Scene();
    scene.generate();
}


// BACKGROUND & FOG //
function setSceneColor() {
    col3d = new THREE.Color( colToHex(color.processRGBA(c1,true)) );
    scene3d.background = col3d;
}


// LIGHTING //
function addlighting() {
    materialType = THREE.MeshLambertMaterial;
    materialType = THREE.MeshBasicMaterial;

    // ambient //
    ambient3d = new THREE.AmbientLight( 0xffffff, 1 );
    scene3d.add( ambient3d );
}

//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

function render3d() {
    if (renderer3d) {

        // set destination angle for rotation if dragging //
        if (!mouseIsDown) {
            lastAngle = scene3d.rotation.y;
        }
        else {
            destAngle = lastAngle + ((TAU/2) - ((TAU/fullX) * mouseX));
        }

        // 'lerp' / smoothly move to destination angle //
        scene3d.rotation.y = lerp(scene3d.rotation.y,destAngle, 5);
        camera.addEnergy(Math.abs((destAngle - scene3d.rotation.y)/7.5));

        // update camera //
        camera.update(cameraDepth);

        // render scene //
        renderer3d.render( scene3d, camera.cam );
    }
}

//-------------------------------------------------------------------------------------------
//  RESIZE
//-------------------------------------------------------------------------------------------


function resize3d() {
    if (renderer3d) {
        renderer3d.setSize( window.innerWidth, window.innerHeight );
        camera.resize();
    }
}

//-------------------------------------------------------------------------------------------
//  CAMERA
//-------------------------------------------------------------------------------------------

function Camera(depth,focus,minVelocity,maxVelocity,minScale,maxScale,accuracy) {

    var w = window.innerWidth;
    var h = window.innerHeight;
    w = width;
    h = height;
    var aspect = w / h;
    var vs = 400;


    this.depth = 500;
    this.focus = focus;
    this.minVelocity = minVelocity;
    this.velocityRange = maxVelocity - minVelocity;
    this.minScale = minScale;
    this.scaleRange = maxScale - minScale;
    this.accuracy = accuracy;


    //this.cam = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.01, 50 );
    this.cam = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 5000 );
    //this.cam = new THREE.OrthographicCamera( (-aspect * vs) / 2, (aspect * vs) / 2, vs / 2, -vs / 2, -1000, 1000 );
    //this.cam.position.set(0,0,this.depth);
    this.cam.position.z = this.depth;
    this.cam.lookAt(focus);

    this.simplex = new SimplexNoise();
    this.index = 0;
    this.energy = 0;
    this.energyDest = 0;
    this.velocity = this.minVelocity;
    this.scale = this.minScale;
}
var proto = Camera.prototype;


proto.addEnergy = function(e) {
    this.energyDest = this.energy + e;
};



proto.update = function(depth) {

    // entropy //
    this.energyDest *= 0.9;
    this.energyDest = valueInRange(this.energyDest, 0 ,100);
    this.energy = lerp(this.energy, this.energyDest, 10);

    // calc velocity & scale from energy //
    this.velocity = this.minVelocity + (this.velocityRange * this.energy);
    this.scale = this.minScale + (this.scaleRange * this.energy);

    // map to perlin simplex //
    this.index += this.velocity;
    var xs = this.simplex.noise(this.index, 0) * this.scale;
    var ys = this.simplex.noise(0, this.index) * this.scale;
    this.cam.position.x = xs;
    this.cam.position.y = ys;
    //this.cam.position.set(xs,ys, this.depth);
    var pos = this.focus.clone();
    pos.x += (xs * ((100-this.accuracy)/100));
    pos.y += (ys * ((100-this.accuracy)/100));
    this.cam.lookAt(pos);
};




proto.resize = function() {
    this.cam.aspect = halfX / halfY;
    this.cam.updateProjectionMatrix();
};
