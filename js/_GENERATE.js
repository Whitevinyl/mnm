
//-------------------------------------------------------------------------------------------
//  GENERATE SCENE
//-------------------------------------------------------------------------------------------

var testing = false;

function Scene() {

    this.spawns = 0;
    this.maxSpawns = 6; // limited until memory leak found //

    // SET UP CONTAINER OBJECT //
    this.obj = new THREE.Object3D();
    scene3d.add( this.obj );
    this.children = [];
    this.disposables = [];

    // GENERATE //
    this.simplex = null;
    this.p = [];
    this.frame = 1;
    this.animating = false;
    this.frameSpace = 5;
    this.grow = 0;
    //this.generate();
    this.aniCount = 1;
}
var proto = Scene.prototype;



// GENERATE SCENE //
proto.generate = function() {

    this.spawns++;
    this.simplex = new SimplexNoise();
    this.p = [];
    this.frame = 0;
    this.grow = 0;
    this.animating = true;

    var r = 20 * meters;
    var j, ox,oy,oz;

    //this.setPalette();



    var spawner = new Spawner(this);
    spawner.setup(1,36); // 90
    this.p.push( spawner );

    spawner = new Spawner(this);
    spawner.setup(1,36); // 90
    this.p.push( spawner );

    spawner = new Spawner(this);
    spawner.setup(1,20); // 50
    this.p.push( spawner );

    //this.setPalette2();

    spawner = new Spawner(this);
    spawner.setup(1,20); // 50
    this.p.push( spawner );

    spawner = new Spawner(this);
    spawner.setup(1,10); // 40
    this.p.push( spawner );

    for (var i=0; i<8; i++) {
        spawner = new Spawner(this);
        spawner.setup(1,tombola.range(30,50)); // 1
        this.p.push( spawner );
    }

    this.setPalette3();

    for (var i=0; i<60; i++) {
        spawner = new Spawner(this);
        spawner.yInd = tombola.rangeFloat(1,3);
        spawner.setup(1,tombola.range(1,2)); // 1
        this.p.push( spawner );
    }


    // SET TIMERS //
    /*setTimeout(function(){
        scene.jump();
    },3500);
    setTimeout(function(){
        scene.jump();
    },7000);
    if (this.spawns<this.maxSpawns) {
        setTimeout(function(){
            scene.clear();
            scene.setPalette();
            scene.generate();
        },13000);
    }*/

    setInterval(function() {
        scene.jump();
    },4000);

};

proto.update = function() {
    /*if (this.grow===0) {
        var l = this.p.length-1;
        for (var h=l; h>=0; h--) {
            this.p[h].geoBuild(this.frame);
        }
        if (l===-1) {
            this.animating = false;
        }
        this.frame++;
    }

    this.grow--;
    if (this.grow<0) {
        this.grow = this.frameSpace;
    }*/
    //this.p[0].update();


    if (this.aniCount>0) {
        this.aniCount--;
        return;
    }
    this.aniCount = 1; // distance between frames

    var l = this.p.length-1;
    for (var h=l; h>=0; h--) {
        this.p[h].update();
    }

};


proto.setPalette = function() {
    currentPalette = tombola.range(0,palettes.length-1);
    c1 = palettes[currentPalette][0];
    c2 = palettes[currentPalette][1];
    c3 = palettes[currentPalette][2];
    setSceneColor();
};

proto.setPalette2 = function() {
    c1 = palettes2[currentPalette][0];
    c2 = palettes2[currentPalette][1];
    c3 = palettes2[currentPalette][2];
};

proto.setPalette3 = function() {
    c1 = palettes3[currentPalette][0];
    c2 = palettes3[currentPalette][1];
    c3 = palettes3[currentPalette][2];
};


// TIDY UP SCENE // current memory leak
proto.clear = function(){
    var i;
    var l = this.children.length;
    for (i=0; i<l; i++) {
        var child = this.children[i];
        child.parent.remove(child);
        //child.geometry.dispose();
        //child.material.dispose();
        child = null;
    }
    this.children = [];


    l = this.disposables.length;
    for (i=0; i<l; i++) {
        this.disposables[i].dispose();
        this.disposables[i] = null;
    }
    this.disposables = [];

    //scene3d.remove( this.obj );
    //this.obj = new THREE.Object3D();
    //scene3d.add( this.obj );
};


// JUMP ROTATE //
proto.jump = function() {
    destAngle = lastAngle  - (TAU/3);
};




//-------------------------------------------------------------------------------------------
//  LINE CONSTRUCTOR
//-------------------------------------------------------------------------------------------

function LineObj(parent,x,y,z,life) {
    this.parent = parent;
    this.obj = new THREE.Object3D();
    this.obj.position.set(x,y,z);
    this.parent.obj.add( this.obj );
    this.delay = tombola.range(1,8);
    this.life = 2 + tombola.range(Math.round(life/2),life);
    this.index = 0;
    this.material = null;
    this.geometry = null;
    this.line = null;
    this.vertices = [];
}
proto = LineObj.prototype;



proto.setup = function() {

    // COLOR //
    var cs = 0.25; // scale
    var scale = this.parent.scale * cs;
    var px = this.parent.obj.position.x + this.obj.position.x;
    var pz = this.parent.obj.position.z + this.obj.position.z;
    var cn = scene.simplex.noise(px*scale,pz*scale);
    var col = pickColor(cn,0.1);
    this.material = new THREE.LineBasicMaterial( {color: col, linewidth: 1} );

    // GEOMETRY //
    this.geometry = new THREE.Geometry();

    // MESH //
    //this.line = new THREE.Line(this.geometry, this.material);
    //scene.obj.add( this.line );

    // cleanup //
    scene.children.push( this.obj );
    //scene.children.push( this.line );
    scene.disposables.push( this.geometry );
    scene.disposables.push( this.material );
};


proto.build = function() {

    // pre-delay //
    if (this.delay>0) {
        this.delay--;
        return;
    }

    // build line //
    this.addToGeometry(this.index);
    this.life--;
    this.index++;


    // kill //
    if (this.life===0) {
        killInstance(this, this.parent.spawners);
    }
};

proto.addToGeometry = function(j) {


    // get global position of local obj
    this.obj.updateMatrix();
    this.obj.updateMatrixWorld();
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition(this.obj.matrix);
    vector.add(this.parent.matrix);

    var x = vector.x;
    var y = vector.y;
    var z = vector.z;
    //if (testing) {
        //addMarker(x,y,z,'rgb(255,100,120)');
    //}


    this.geometry.vertices.push( new THREE.Vector3( x, y, z) );

    // MESH //
    //scene.remove( this.line );



    this.geometry.verticesNeedUpdate = true;
    this.geometry.elementsNeedUpdate = true;
    this.geometry.computeBoundingSphere();

    if (j===1) {
        //if (this.line) scene.remove( this.line );
        this.line = new THREE.Line(this.geometry, this.material);
        //this.line.frustumCulled = false;
        scene.obj.add( this.line );
        //scene.children.push( this.line );
    }
};



//-------------------------------------------------------------------------------------------
//  SPAWNER
//-------------------------------------------------------------------------------------------

// this plots the overall stroke path, and creates individual lines as its children.
function Spawner(parent) {
    this.parent = parent;
    this.obj = new THREE.Object3D();
    scene.obj.add( this.obj );
    this.children = [];
    this.spawners = [];
    this.ind = tombola.rangeFloat(1,10);
    this.yInd = tombola.rangeFloat(0,0);
    this.zInd = tombola.rangeFloat(0,0.16);
    this.scale = 32 * meters;
    this.matrix = new THREE.Vector3();


    if (testing) {
        var material = new materialType( {color: 'rgb(255,0,10)'} );
        var s = 0.5 * meters;
        var geometry = new THREE.BoxGeometry(s,s,1);
        var mesh = new THREE.Mesh( geometry, material );
        this.obj.add( mesh );
    }

}
proto = Spawner.prototype;


// position from noise, create child objects (LineSpawner) //
proto.setup = function(lines,life) {

    // start position //
    var x = scene.simplex.noise3d(this.ind,this.yInd,this.zInd) * this.scale;
    var y = scene.simplex.noise3d(this.ind,this.yInd+1000,this.zInd+1000) * this.scale;
    var z = scene.simplex.noise3d(this.ind,this.yInd+3000,this.zInd+3000) * this.scale;
    this.obj.position.set(x,y,z);

    // create lines //
    var r = 3 * meters;
    for (var i=0; i<lines; i++) {
        var sx = tombola.rangeFloat(-r,r);
        var sy = tombola.rangeFloat(-r/2,r/2);
        var sz = tombola.rangeFloat(-r,r);
        var sLife = tombola.range(3,life);
        var line = new LineSpawner(this, sx, sy, sz, sLife);
        line.setup();
        this.spawners.push( line );
    }

    // cleanup //
    scene.children.push( this.obj );
};


// build animation, move then update children //
proto.update = function() {

    // move //
    this.ind += 0.025;
    var x = scene.simplex.noise3d(this.ind,this.yInd,this.zInd) * this.scale;
    var y = scene.simplex.noise3d(this.ind,this.yInd+1000,this.zInd+1000) * this.scale;
    var z = scene.simplex.noise3d(this.ind,this.yInd+3000,this.zInd+3000) * this.scale;
    this.obj.position.set(x,y,z);
    this.matrix.setFromMatrixPosition(this.obj.matrix);


    // marker //
    if (testing) {
        addMarker(x,y,z,'rgb(255,0,10)');
    }

    // build //
    var l = this.spawners.length - 1;
    for (var i=l; i>=0; i--) {
        this.spawners[i].build();
    }

    // kill //
    if (this.spawners.length===0) {
        killInstance(this, this.parent.p);
    }
};

//-------------------------------------------------------------------------------------------
//  FACE LINE SPAWNER
//-------------------------------------------------------------------------------------------


function LineSpawner(parent,x,y,z,life) {
    this.parent = parent;
    this.obj = new THREE.Object3D();
    this.obj.position.set(x,y,z);
    this.parent.obj.add( this.obj );
    this.delay = tombola.range(1,8);
    this.life = 2 + tombola.range(Math.round(life/2),life);
    this.index = 0;
    this.tris = this.life - 2;
    this.w = 1;
    this.twist = 0;
    this.polarity = 1;
    this.material = null;
    this.geometry = null;
    this.mesh = null;
}
proto = LineSpawner.prototype;


proto.setup = function() {

    this.w = tombola.rangeFloat(0.1,0.5) * meters * 0.8;
    this.twist = tombola.rangeFloat(-0.5,0.5);

    // COLOR //
    var cs = 0.25; // scale
    var scale = this.parent.scale * cs;
    var px = this.parent.obj.position.x + this.obj.position.x;
    var pz = this.parent.obj.position.z + this.obj.position.z;
    var cn = scene.simplex.noise(px*scale,pz*scale);
    var col = pickColor(cn,0.1);
    col = colToHex(color.processRGBA(tombola.weightedItem([paints[12], paints[13], paints[14]],[0,1,2]),true));
    this.material = new materialType( {color: col} );
    this.material.side = THREE.DoubleSide;

    // GEOMETRY //
    this.geometry = new THREE.Geometry();

    // MESH //
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    scene.obj.add( this.mesh );

    // cleanup //
    scene.children.push( this.obj );
    scene.children.push( this.mesh );
    scene.disposables.push( this.geometry );
    scene.disposables.push( this.material );
};


proto.build = function() {

    // pre-delay //
    if (this.delay>0) {
        this.delay--;
        return;
    }

    // build line //
    this.addToGeometry(this.index);
    this.life--;
    this.index++;


    // kill //
    if (this.life===0) {
        killInstance(this, this.parent.spawners);
    }
};

proto.addToGeometry = function(j) {

    var t = (scene.simplex.noise(j,1000)/2) + this.twist;

    // get global position of local obj
    this.obj.updateMatrix();
    this.obj.updateMatrixWorld();
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition(this.obj.matrix);
    vector.add(this.parent.matrix);

    var x = vector.x;
    var y = vector.y;
    var z = vector.z;
    if (testing) {
        addMarker(x,y,z,'rgb(255,255,255)');
    }


    if (j>0 && j<(this.tris+1)) {
        this.geometry.vertices.push( new THREE.Vector3( x - (this.w * this.polarity), y,  z + ((t * this.w) * -this.polarity) ) );
    }
    this.geometry.vertices.push( new THREE.Vector3( x + (this.w * this.polarity), y,  z + ((t * this.w) * this.polarity) ) );


    var jj = j*2;
    if (j===1) {
        this.geometry.faces.push( new THREE.Face3( jj-2, jj-1, jj ) );
    }
    if (j>1) {

        if (j<(this.tris+1)) {
            this.geometry.faces.push( new THREE.Face3( jj-3, jj-2, jj ) );
            this.geometry.faces.push( new THREE.Face3( jj-2, jj-1, jj ) );
        }
        else {
            this.geometry.faces.push( new THREE.Face3( jj-3, jj-2, jj-1 ) );
        }
    }
    this.geometry.verticesNeedUpdate = true;
    this.geometry.elementsNeedUpdate = true;
    this.polarity = -this.polarity;
};



// KILL FROM ARRAY //
function killInstance(instance,array) {
    var ind = array.indexOf(instance);
    if (ind > -1) array.splice(ind, 1);
}

// PICK COLOR //
function pickColor(noise,contrast) {

    // calc contrast //
    if (noise > 0) { noise += ((1/100) * contrast); }
    else { noise += ((-1/100) * contrast); }
    noise = (noise + 1) / 2;

    // set blended fill color //
    var fillCol;
    var midCol = color.blend2(c2, c3, 50);
    if (noise > 0.5) {
        noise = (noise - 0.5) * 2;
        fillCol = color.blend2(midCol, c3, noise * 100);
    } else {
        noise *= 2;
        fillCol = color.blend2(c2, midCol, noise * 100);
    }
    return new THREE.Color( colToHex(color.processRGBA(fillCol,true)) );
}

//-------------------------------------------------------------------------------------------
//  MARKER
//-------------------------------------------------------------------------------------------

function addMarker(x,y,z,col) {
    var material = new materialType( {color: col} );
    var s = 0.15 * meters;
    var geometry = new THREE.BoxGeometry(s,s,s);
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x,y,z);
    scene.obj.add( mesh );
    scene.children.push( mesh );
}


//-------------------------------------------------------------------------------------------
//  MATHS
//-------------------------------------------------------------------------------------------

// not using any of these here, from an older project.

function meshRotate(mesh) {
    mesh.rotation.y = tombola.rangeFloat(0,TAU);
    meshUpdate(mesh);
}

function meshUpdate(mesh) {
    mesh.updateMatrix();
    mesh.geometry.applyMatrix( mesh.matrix );
    mesh.matrix.identity();
    mesh.position.set( 0, 0, 0 );
    mesh.rotation.set( 0, 0, 0 );
    mesh.scale.set( 1, 1, 1 );
}

function scale3D( obj, scale ) {
    obj.scale.x = scale;
    obj.scale.y = scale;
    obj.scale.z = scale;
}

function pointDistance(p1, p2) {
    return Math.sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.z-p2.z)*(p1.z-p2.z) );
}


function assignUVs( geometry ){

    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (var i = 0; i < geometry.faces.length ; i++) {

        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
            new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
            new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
        ]);

    }

    geometry.uvsNeedUpdate = true;
    //console.log(geometry.faceVertexUvs[0]);
}
