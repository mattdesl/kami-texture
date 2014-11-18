/// This depends on kami-fbo, which depends on kami-texture
/// You need a new version of NPM for the cyclic dependency to 
/// install correctly ... 

var test = require('tape').test;
var Texture = require('./');
var createFBO = require('kami-fbo');
var baboon = require('baboon-image-uri');

var gl = require('webgl-context')({ width: 1, height: 1 });
if (!gl)
    throw "WebGL not supported";

//determine if the given texture is a single pure green pixel
function isGreen(gl, tex) {
    //bind it to a FBO so we can read its pixels
    var fbo = createFBO(gl, {
        texture: tex
    });

    var data = new Uint8Array(4);
    fbo.begin();
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    fbo.end();
    return data[0]===0 && data[1]===255 && data[2]===0;
}

test('testing async constructor', function(t) {
    t.plan(4);
    
    //test constructor
    var tex = new Texture(gl, {
        src: 'test/does-not-exist',
        onError: function(ev) {
            t.ok(true, 'error callback received');
        }
    });

    //test non-constructor
    var tex2 = Texture(gl, {
        src: 'test/green.png',
        onLoad: function(ev) {
            t.ok(true, 'load callback received');
            t.ok( this.width===1 && this.height===1, 'image loaded with correct size' );
            t.ok( isGreen(gl, this), 'image loaded with correct data');
        }
    });
});

test('testing image constructor', function(t) {
    t.plan(2);

    var image = new Image();
    image.onload = function() {
        var tex = Texture(gl, {
            image: image
        });

        t.ok( tex.width===1 && tex.height===1, 'loaded image');
        t.ok( isGreen(gl, tex), 'image loaded with correct data');
    };
    image.src = 'test/green.png';
});

test('testing data constructor', function(t) {
    //make a green texture
    var tex = Texture(gl, {
        width: 1,
        height: 1,
        data: new Uint8Array([0, 255, 0]),
        format: Texture.Format.RGB
    });

    t.ok( isGreen(gl, tex), 'data texture stores RGBA color');
    t.end();
});


test('testing image shape', function(t) {
    t.plan(7);

    var image1 = new Image();
    image1.onload = function(image) {
        var tex = Texture(gl, {
            image: image
        });

        t.ok( tex.width===1 && tex.height===1, 'loaded image');
        t.equal( tex.shape[0], 1, 'shape width' );
        t.equal( tex.shape[1], 1, 'shape height' );

        var willThrow = function() { tex.shape = 2 }

        t.throws(willThrow, 'changing shape not supported');
    }.bind(this, image1);
    image1.src = 'test/green.png';



    var image2 = new Image();
    image2.onload = function(image) {
        var tex = Texture(gl, {
            image: image
        });

        t.ok( tex.width===128 && tex.height===128, 'loaded image');
        t.equal( tex.shape[0], 128, 'shape width' );
        t.equal( tex.shape[1], 128, 'shape height' );
    }.bind(this, image2);
    image2.src = baboon;
});
