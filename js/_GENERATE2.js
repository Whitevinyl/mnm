
//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

var testing = false;
meters = 1;

function Scene() {

    // SET UP CONTAINER OBJECT //
    this.obj = new THREE.Object3D();
    scene3d.add( this.obj );
    this.children = [];
    this.disposables = [];

    // GENERATE //
    this.noise = null;
    this.p = [];
    this.index = 0;
}
var proto = Scene.prototype;


//-------------------------------------------------------------------------------------------
//  GENERATE
//-------------------------------------------------------------------------------------------

proto.generate = function() {

    this.noise = new SimplexNoise();
    this.p = [];
    this.max = 0;

    var r = 20 * meters;
    var i, j, x,y,z;

    for (j=0; j<5; j++) {
        x = tombola.rangeFloat(0, 200);
        y = tombola.rangeFloat(0, 200);
        z = tombola.rangeFloat(0, 200);
        var l = tombola.range(100, 250);
        l /= 2;
        for (i=0; i<8; i++) {
            this.p.push( new LineObj(x, y, z, l, 270) );
        }
    }

    for (i=0; i<60; i++) {
        x = tombola.rangeFloat(0, 200);
        y = tombola.rangeFloat(0, 200);
        z = tombola.rangeFloat(0, 200);
        this.p.push( new LineObj(x, y, z, 2, 350) );
    }

    var l = this.p.length;
    for (i=0; i<l; i++) {
        if (this.p[i].life > this.max) this.max = this.p[i].life;
    }


    setInterval(function() {
        scene.jump();
    },4000);

};

//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

proto.update = function() {
    var speed = 1;

    if (this.index <= this.max) {
        for (var i=0; i<speed; i++) {
            var l = this.p.length-1;
            for (var h=l; h>=0; h--) {
                this.p[h].update();
            }
            this.index++;
        }
    }
};


//-------------------------------------------------------------------------------------------
//  CLEAN UP ITEMS
//-------------------------------------------------------------------------------------------

proto.clear = function(){
    var i;
    var l = this.children.length;
    for (i=0; i<l; i++) {
        var child = this.children[i];
        child.parent.remove(child);
        child = null;
    }
    this.children = [];


    l = this.disposables.length;
    for (i=0; i<l; i++) {
        this.disposables[i].dispose();
        this.disposables[i] = null;
    }
    this.disposables = [];
};


//-------------------------------------------------------------------------------------------
//  ROTATION
//-------------------------------------------------------------------------------------------

proto.jump = function() {
    destAngle = lastAngle  - (TAU/3);
};


//-------------------------------------------------------------------------------------------
//  LINE CONSTRUCTOR
//-------------------------------------------------------------------------------------------

function LineObj(x, y, z, max, scale) {
    var r = 0.015;
    this.indX = x + tombola.rangeFloat(-r,r);
    this.indY = y + tombola.rangeFloat(-r,r);
    this.indZ = z + tombola.rangeFloat(-r,r);
    this.z = tombola.rangeFloat(-0.1,0.1);
    this.life = tombola.range(Math.max(1,max/2),max);
    this.scale = scale;

    this.material = null;
    this.geometry = null;
    this.vertices = [];

    this.setup();
}
proto = LineObj.prototype;



proto.setup = function() {

    var col = colToHex(color.processRGBA(tombola.weightedItem([paints[12], paints[14]],[3,2]),true));
    this.material = new THREE.LineBasicMaterial( {color: col, linewidth: 1} );
    if (tombola.percent(40)) {
        this.material = new THREE.LineDashedMaterial( {color: col, linewidth: 1, dashSize: (10 * meters), gapSize: (6 * meters)} );
    }
    this.geometry = new THREE.Geometry();

    /*this.line = new THREE.Line(this.geometry, this.material);
    this.line.frustumCulled = false;
    scene.obj.add( this.line );*/

    /*this.line = new THREE.Line(this.geometry, this.material);
    scene.obj.add( this.line );*/

    // cleanup //
    scene.disposables.push( this.geometry );
    scene.disposables.push( this.material );
};


proto.update = function() {

    // pre-delay //
    /*if (this.delay>0) {
        this.delay--;
        return;
    }*/

    // build line //
    this.addToGeometry(this.life===0);
    var inc = 0.006;
    this.indX += inc;
    this.indY += inc;
    this.indZ += inc;
    this.life --;


    // kill //
    if (this.life < 0) {
        killInstance(this, scene.p);
    }
};



proto.addToGeometry = function(fill) {

    var scale = this.scale * meters;
    var x = scene.noise.noise(this.indX, 100) * (scale * 1.2);
    var y = scene.noise.noise(100, this.indY) * (scale);
    var z = scene.noise.noise(this.indZ, 10000) * scale;
    z = (0.5 + this.z + scene.noise.noise(y/80, 10000)) * (scale * 0.7);

    //addMarker(x,y,z,'rgb(0,0,0)');
    this.geometry.vertices.push( new THREE.Vector3( x, y, z) );

    this.geometry.verticesNeedUpdate = true;
    this.geometry.elementsNeedUpdate = true;
    this.geometry.computeLineDistances();
    this.geometry.computeBoundingSphere();


    if (fill) {
        this.line = new THREE.Line(this.geometry, this.material);
        scene.obj.add( this.line );
    }
    //addIco(x,y,z,this.material);

    /*scene.obj.remove( this.line );
    this.line = new THREE.Line(this.geometry, this.material);
    this.line.frustumCulled = false;
    scene.obj.add( this.line );*/

    /*if (!this.line) {
        this.line = new THREE.Line(this.geometry, this.material);
        this.line.frustumCulled = false;
        scene.obj.add( this.line );
    }*/
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
        var line = new LineObj(this, sx, sy, sz, sLife);
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
    console.log(x);
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

    this.w = tombola.rangeFloat(0.1,0.5) * meters;
    this.twist = tombola.rangeFloat(-0.5,0.5);

    // COLOR //
    var cs = 0.25; // scale
    var scale = this.parent.scale * cs;
    var px = this.parent.obj.position.x + this.obj.position.x;
    var pz = this.parent.obj.position.z + this.obj.position.z;
    var cn = scene.simplex.noise(px*scale,pz*scale);
    var col = pickColor(cn,0.1);
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
    var s = 1 * meters;
    var geometry = new THREE.BoxGeometry(s,s,s);
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x,y,z);
    scene.obj.add( mesh );
    scene.children.push( mesh );
}

function addIco(x,y,z,material) {
    var s = tombola.rangeFloat(0.5,2) * meters;
    if (tombola.percent(3)) s = tombola.rangeFloat(2,5) * meters;
    var geometry = new THREE.IcosahedronGeometry(s);
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
