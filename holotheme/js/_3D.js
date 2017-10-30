

//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

var scene,scene3d,renderer3d,directional3d,ambient3d,col3d,materialType,lastAngle;
var cameraDepth = 7.1;
var building;
var destAngle = -TAU/8;
var camera;

function setup3d() {

    const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;

    // setup renderer //
    renderer3d = new THREE.WebGLRenderer({antialias: !isAndroid});
    renderer3d.setSize( window.innerWidth, window.innerHeight );
    var parent = document.getElementById('app');
    parent.appendChild( renderer3d.domElement );


    // setup view //
    scene3d = new THREE.Scene();

    // create & point camera //
    if (device==='mobile') {
        cameraDepth = 8.5;
    }
    camera = new Camera(cameraDepth, new THREE.Vector3(0,0,0), 0.004, 0.02, 1.6 * meters, 3.5*meters, 50);

    // create fog & background color //
    setSceneColor();

    // lighting //
    materialType = THREE.MeshBasicMaterial;
    addlighting();

    // create scene //
    scene = new Scene();
    scene.generate();

    // start angle //
    scene3d.rotation.y = -TAU/8;
}


// BACKGROUND & FOG //
function setSceneColor() {
    col3d = new THREE.Color( colToHex(color.processRGBA(c1,true)) );
    scene3d.background = col3d;
    scene3d.fog = new THREE.Fog(col3d,cameraDepth * 0.75,cameraDepth + 14);
}


// LIGHTING //
function addlighting() {
    materialType = THREE.MeshLambertMaterial;

    var balance = lightBalance;

    // directional //
    directional3d = new THREE.DirectionalLight( 0xddddff, 1.02 - balance );
    directional3d.position.set( 2, 3, 2.2 );

    /*directional3d.castShadow = true;
    renderer3d.shadowMap.enabled = true;
    renderer3d.shadowMap.type = THREE.BasicShadowMap; // default THREE.PCFShadowMap
    renderer3d.toneMapping = THREE.NoToneMapping;

    //Set up shadow properties for the light
    var s = 1024;
    s = 2048;
    directional3d.shadow.mapSize.width = s;
    directional3d.shadow.mapSize.height = s;
    directional3d.shadow.camera.near = 0.05;
    directional3d.shadow.camera.far = 9;*/


    scene3d.add( directional3d );

    // ambient //
    ambient3d = new THREE.AmbientLight( 0xffffff, balance );
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


function resize3d(height,width) {
    if (renderer3d) {

        renderer3d.setSize( window.innerWidth, window.innerHeight );


        if (device=='mobile') {
            camera.resize(8.5 + (((height/width)-1)*5));
        }
        else {
            camera.resize(7.1);
        }
    }
}

//-------------------------------------------------------------------------------------------
//  CAMERA
//-------------------------------------------------------------------------------------------

function Camera(depth,focus,minVelocity,maxVelocity,minScale,maxScale,accuracy) {

    this.depth = depth;
    this.focus = focus;
    this.minVelocity = minVelocity;
    this.velocityRange = maxVelocity - minVelocity;
    this.minScale = minScale;
    this.scaleRange = maxScale - minScale;
    this.accuracy = accuracy;


    this.cam = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.01, 50 );
    this.cam.position.set(0,2.2,depth);
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
    this.cam.position.set(xs,2.2 + ys, depth);
    var pos = this.focus.clone();
    pos.x += (xs * ((100-this.accuracy)/100));
    pos.y += (ys * ((100-this.accuracy)/100));
    this.cam.lookAt(pos);
};




proto.resize = function(depth) {
    this.cam.aspect = fullX / (fullX*1.2);
    this.cam.aspect = halfX / halfY;
    this.cam.updateProjectionMatrix();
    cameraDepth = depth;
    this.cam.position.z = cameraDepth;
};
