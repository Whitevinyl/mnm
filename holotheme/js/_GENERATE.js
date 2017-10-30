
//-------------------------------------------------------------------------------------------
//  GENERATE SCENE
//-------------------------------------------------------------------------------------------

var testing = false;

function Scene() {

    //this.spawns = 0;
    //this.maxSpawns = 6; // limited until memory leak found //

    // SET UP CONTAINER OBJECT //
    this.obj = new THREE.Object3D();
    scene3d.add( this.obj );
    this.children = [];
    this.disposables = [];

    // GENERATE //
    this.simplex = null;
    this.p = [];
    //this.frame = 1;
    this.animating = false;
    //this.frameSpace = 5;
    //this.grow = 0;
    //this.generate();
    //this.aniCount = 1;
}
var proto = Scene.prototype;



// GENERATE SCENE //
proto.generate = function() {

    //this.spawns++;
    this.simplex = new SimplexNoise();
    this.p = [];
    //this.frame = 0;
    //this.grow = 0;
    this.animating = true;

    var r = 20 * meters;
    var j,ox,oy,oz;

    this.setPalette();

    /*// CREATE LINES //
    ox = tombola.rangeFloat(-r,r);
    oy = tombola.rangeFloat(-r,r);
    oz = tombola.rangeFloat(-r,r);
    for (j=0; j<90; j++) {
        //this.createLine(ox,oy,oz,2,33);
        this.p.push(new LineObj(this,ox,oy,oz,2,33) );
    }

    ox = tombola.rangeFloat(-r,r);
    oy = tombola.rangeFloat(-r,r);
    oz = tombola.rangeFloat(-r,r);
    for (j=0; j<90; j++) {
        //this.createLine(ox,oy,oz,2,33);
        this.p.push(new LineObj(this,ox,oy,oz,2,33) );
    }

    ox = tombola.rangeFloat(-r,r);
    oy = tombola.rangeFloat(-r,r);
    oz = tombola.rangeFloat(-r,r);
    for (j=0; j<50; j++) {
        //this.createLine(ox,oy,oz,2,20);
        this.p.push(new LineObj(this,ox,oy,oz,2,20) );
    }

    this.setPalette2();

    ox = tombola.rangeFloat(-r,r);
    oy = tombola.rangeFloat(-r,r);
    oz = tombola.rangeFloat(-r,r);
    for (j=0; j<50; j++) {
        //this.createLine(ox,oy,oz,2,20);
        this.p.push(new LineObj(this,ox,oy,oz,2,20) );
    }



    ox = tombola.rangeFloat(-r,r);
    oy = tombola.rangeFloat(-r,r);
    oz = tombola.rangeFloat(-r,r);
    for (j=0; j<40; j++) {
        //this.createLine(ox,oy,oz,2,10);
        this.p.push(new LineObj(this,ox,oy,oz,2,10) );
    }

    // singles //
    for (j=0; j<26; j++) {
        ox = tombola.rangeFloat(-r,r);
        oy = tombola.rangeFloat(-r,r);
        oz = tombola.rangeFloat(-r,r);

        //this.createLine(ox,oy,oz,30,18);
        this.p.push(new LineObj(this,ox,oy,oz,30,18) );
    }*/


    var spawner = new Spawner(this);
    spawner.setup(65,36); // 90
    this.p.push( spawner );

    spawner = new Spawner(this);
    spawner.setup(65,36); // 90
    this.p.push( spawner );

    spawner = new Spawner(this);
    spawner.setup(35,20); // 50
    this.p.push( spawner );

    this.setPalette2();

    spawner = new Spawner(this);
    spawner.setup(45,20); // 50
    this.p.push( spawner );

    spawner = new Spawner(this);
    spawner.setup(25,10); // 40
    this.p.push( spawner );

    for (var i=0; i<4; i++) {
        spawner = new Spawner(this);
        spawner.setup(1,tombola.range(30,50)); // 1
        this.p.push( spawner );
    }

    this.setPalette3();

    for (var i=0; i<25; i++) {
        spawner = new Spawner(this);
        spawner.yInd = tombola.rangeFloat(1,3);
        spawner.setup(1,tombola.range(1,2)); // 1

        this.p.push( spawner );
    }


    // SET TIMERS //
    setTimeout(function(){
        scene.jump();
    },3500);
    setTimeout(function(){
        scene.jump();
    },7000);
    /*if (this.spawns<this.maxSpawns) {
        setTimeout(function(){
            scene.clear();
            scene.setPalette();
            scene.generate();
        },13000);
    }*/

};

proto.animate = function() {
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


    /*if (this.aniCount>0) {
        this.aniCount--;
        return;
    }
    this.aniCount = 1; // distance between frames*/

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


// CREATE A SINGLE LINE MESH //
proto.createLine = function(ox,oy,oz,r,l) {
    var tris = tombola.range(Math.round(l/2),l);
    var w = tombola.rangeFloat(0.003,0.07);
    var polarity = 1;
    var increment = 0.04;

    var ind = 0;
    var twist = tombola.rangeFloat(-0.5,0.5);

    //var r = 2;

    //increment = 0.03;
    //r *= 0.15;

    var x = ox + (tombola.rangeFloat(-r,r) * meters);
    var y = oy + (tombola.rangeFloat(-r,r) * meters);
    var z = oz + (tombola.rangeFloat(-r,r) * meters); // depth
    var s = 20;
    var xs = x/s;
    var ys = y/s;
    var zs = z/s;

    var m = 0.6;


    var x2 = x;
    var y2 = y;
    var z2 = z;
    var m2 = 50 * meters;

    // CREATE GEOMETRY //
    var geometry = new THREE.Geometry();
    for (var i=0; i<(tris+2); i++) {

        var t = (this.simplex.noise(ind,1000)/2) + twist;
        x += (this.simplex.noise3d(ind,ys,zs) * m);
        y += (this.simplex.noise3d(xs,ind,zs) * m);
        z += (this.simplex.noise3d(xs,ys,ind) * m);

        /*x = (this.simplex.noise3d(x2 + ind,0,0) * m2);
        y = (this.simplex.noise3d(y2 + ind,1000,1000) * m2);
        z = (this.simplex.noise3d(z2 + ind,3333,3333) * m2);*/

        ind += increment;


        if (i>0 && i<(tris+1)) {
            geometry.vertices.push( new THREE.Vector3( x - (w * polarity), y,  z + ((t * w) * -polarity) ) );
        }
        geometry.vertices.push( new THREE.Vector3( x + (w * polarity), y,  z + ((t * w) * polarity) ) );


        var ii = i*2;
        if (i===1) {
            geometry.faces.push( new THREE.Face3( ii-2, ii-1, ii ) );
        }
        if (i>1) {

            if (i<(tris+1)) {
                geometry.faces.push( new THREE.Face3( ii-3, ii-2, ii ) );
                geometry.faces.push( new THREE.Face3( ii-2, ii-1, ii ) );
            }
            else {
                geometry.faces.push( new THREE.Face3( ii-3, ii-2, ii-1 ) );
            }
        }
        polarity = -polarity;
    }

    var contrast = 0;
    var cs = 0.5; // color scale
    var cn = this.simplex.noise(xs*s*cs,zs*s*cs);
    if (cn > 0) { cn += ((1/100) * contrast); }
    else { cn += ((-1/100) * contrast); }
    cn = (cn + 1) / 2;

    // set blended fill color //
    var fillCol;
    var midCol = color.blend2(c2, c3, 50);
    if (cn > 0.5) {
        cn = (cn - 0.5) * 2;
        fillCol = color.blend2(midCol, c3, cn * 100);
    } else {
        cn *= 2;
        fillCol = color.blend2(c2, midCol, cn * 100);
    }
    var col = new THREE.Color( colToHex(color.processRGBA(fillCol,true)) );
    var material = new materialType( {color: col} );
    material.side = THREE.DoubleSide;

    // ADD MESH //
    var mesh = new THREE.Mesh( geometry, material );
    this.obj.add( mesh );

    // MANAGE DISPOSABLES //
    this.disposables.push(geometry);
    this.disposables.push(material);
    this.children.push( mesh );
};


//-------------------------------------------------------------------------------------------
//  LINE CONSTRUCTOR
//-------------------------------------------------------------------------------------------

function LineObj(parent,ox,oy,oz,r,l) {
    this.parent = parent;
    //this.parent.p.push(this);
    this.simplex = this.parent.simplex;

    this.tris = tombola.range(Math.round(l/2),l);
    this.w = tombola.rangeFloat(0.003,0.07);
    this.polarity = 1;
    this.increment = 0.04; // doesn't need to be in instance

    this.ind = 0;
    this.twist = tombola.rangeFloat(-0.5,0.5);

    this.x = ox + (tombola.rangeFloat(-r,r) * meters);
    this.y = oy + (tombola.rangeFloat(-r,r) * meters);
    this.z = oz + (tombola.rangeFloat(-r,r) * meters); // depth
    this.s = 20; // doesn't need to be in instance
    this.xs = this.x/this.s;
    this.ys = this.y/this.s;
    this.zs = this.z/this.s;
    this.m = 0.6; // doesn't need to be in instance


    // COLOR //
    var contrast = 0;
    var cs = 0.5; // color scale
    var cn = this.simplex.noise(this.xs*this.s*cs,this.zs*this.s*cs);
    if (cn > 0) { cn += ((1/100) * contrast); }
    else { cn += ((-1/100) * contrast); }
    cn = (cn + 1) / 2;

    // set blended fill color //
    var fillCol;
    var midCol = color.blend2(c2, c3, 50);
    if (cn > 0.5) {
        cn = (cn - 0.5) * 2;
        fillCol = color.blend2(midCol, c3, cn * 100);
    } else {
        cn *= 2;
        fillCol = color.blend2(c2, midCol, cn * 100);
    }
    var col = new THREE.Color( colToHex(color.processRGBA(fillCol,true)) );
    this.material = new materialType( {color: col} );
    this.material.side = THREE.DoubleSide;


    // GEOMETRY //
    this.geometry = new THREE.Geometry();



    // ADD MESH //
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.parent.obj.add( this.mesh );

    for (var i=0; i<(this.tris+2); i++) {
        this.geoBuild(i);
    }


    // MANAGE DISPOSABLES //
    this.parent.disposables.push(this.geometry);
    this.parent.disposables.push(this.material);
    this.parent.children.push( this.mesh );
}
proto = LineObj.prototype;




proto.geoBuild = function(i) {

    if (i===(this.tris+2)) {
        this.kill();
        return;
    }

    var t = (this.simplex.noise(this.ind,1000)/2) + this.twist;
    this.x += (this.simplex.noise3d(this.ind,this.ys,this.zs) * this.m);
    this.y += (this.simplex.noise3d(this.xs,this.ind,this.zs) * this.m);
    this.z += (this.simplex.noise3d(this.xs,this.ys,this.ind) * this.m);

    this.ind += this.increment;


    if (i>0 && i<(this.tris+1)) {
        this.geometry.vertices.push( new THREE.Vector3( this.x - (this.w * this.polarity), this.y,  this.z + ((t * this.w) * -this.polarity) ) );
    }
    this.geometry.vertices.push( new THREE.Vector3( this.x + (this.w * this.polarity), this.y,  this.z + ((t * this.w) * this.polarity) ) );


    var ii = i*2;
    if (i===1) {
        this.geometry.faces.push( new THREE.Face3( ii-2, ii-1, ii ) );
    }
    if (i>1) {

        if (i<(this.tris+1)) {
            this.geometry.faces.push( new THREE.Face3( ii-3, ii-2, ii ) );
            this.geometry.faces.push( new THREE.Face3( ii-2, ii-1, ii ) );
        }
        else {
            this.geometry.faces.push( new THREE.Face3( ii-3, ii-2, ii-1 ) );
        }
    }

    // update geometry? //

    this.polarity = -this.polarity;
};



proto.kill = function() {
    var index = this.parent.p.indexOf(this);
    if (index > -1) {
        this.parent.p.splice(index, 1);
    }
};


//-------------------------------------------------------------------------------------------
//  SPAWNER
//-------------------------------------------------------------------------------------------

function Spawner(parent) {
    this.parent = parent;
    this.obj = new THREE.Object3D();
    scene.obj.add( this.obj );
    this.children = [];
    this.spawners = [];
    this.lastPosition = null;
    this.axis = null;
    this.ind = tombola.rangeFloat(1,10);
    this.yInd = tombola.rangeFloat(0,0);
    this.zInd = tombola.rangeFloat(0,0.16);
    this.scale = 45 * meters;
    this.matrix = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.lastDirection = this.direction.clone();
    this.quarternion = null;


    if (testing) {
        var material = new materialType( {color: 'rgb(255,0,10)'} );
    var s = 0.5 * meters;
    var geometry = new THREE.BoxGeometry(s,s,1);
    var mesh = new THREE.Mesh( geometry, material );
    this.obj.add( mesh );
    }

}
proto = Spawner.prototype;


proto.setup = function(lines,life) {

    // start position //
    var x = scene.simplex.noise3d(this.ind,this.yInd,this.zInd) * this.scale;
    var y = scene.simplex.noise3d(this.ind,this.yInd+1000,this.zInd+1000) * this.scale;
    var z = scene.simplex.noise3d(this.ind,this.yInd+3000,this.zInd+3000) * this.scale;
    this.obj.position.set(x,y,z);
    this.position = new THREE.Vector3();
    this.position.setFromMatrixPosition(this.obj.matrix);
    this.lastPosition = this.position.clone();
    this.axis = new THREE.Vector3(0,1,0);
    this.matrix.setFromMatrixPosition(this.obj.matrix);

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


proto.update = function() {

    // move //
    this.ind += 0.025;
    var x = scene.simplex.noise3d(this.ind,this.yInd,this.zInd) * this.scale;
    var y = scene.simplex.noise3d(this.ind,this.yInd+1000,this.zInd+1000) * this.scale;
    var z = scene.simplex.noise3d(this.ind,this.yInd+3000,this.zInd+3000) * this.scale;
    this.obj.position.set(x,y,z);
    this.position.setFromMatrixPosition(this.obj.matrix);


    // angle //
    this.direction = new THREE.Vector3();
    this.direction.subVectors( this.lastPosition, this.position ) ;


    var pos = new THREE.Vector3();
    pos.addVectors(this.direction, this.position);
    this.obj.lookAt(pos);
    //var lp = this.lastPosition;
    //var vector = new THREE.Vector3(x-lp.x,y-lp.y,z-lp.z);
    //this.obj.quaternion.setFromUnitVectors(this.axis, vector.clone().normalize());
    this.obj.updateMatrix();
    this.obj.updateMatrixWorld();

    this.quaternion = new THREE.Quaternion();
    this.quaternion.setFromUnitVectors( this.lastDirection, this.direction );
    this.lastDirection = this.direction.clone();

    //this.axis = vector;
    this.lastPosition = this.position.clone();
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
    //this.geometry.uvsNeedUpdate = true;
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
