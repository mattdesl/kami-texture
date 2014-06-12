/// This depends on kami-fbo, which depends on kami-texture
/// You need a new version of NPM for the cyclic dependency to 
/// install correctly ... 

var test = require('tape').test;
var Texture = require('./');
var getPixels = require('canvas-pixels').get3d;

test('testing async image load', function(t) {
    t.plan(2);

    var gl = require('webgl-context')();
    if (!gl)
        throw "WebGL not supported";
    
    //test constructor
    var tex = new Texture(gl, {
        src: 'test/does-not-exist',
        onError: function(ev) {
            t.ok(true, 'error callback received');
        }
    });

    //test non-constructor
    Texture(gl, {
        src: 'test/pixel-diffuse.png',
        onLoad: function(ev) {
            t.ok(true, 'load callback received');
        }
    });
});

test('testing data constructor', function(t) {
    var gl = require('webgl-context')({ width: 1, height: 1 });
    if (!gl)
        throw "WebGL not supported";

    //make a red texture
    var tex = Texture(gl, {
        width: 1,
        height: 1,
        data: new Uint8Array([255, 0, 0]),
        format: Texture.Format.RGB
    });

    //bind it to a FBO so we can read its pixels
    var fbo = require('kami-fbo')(gl, {
        texture: tex
    });

    var data = new Uint8Array(4);
    fbo.begin();
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    fbo.end();

    t.ok(data[0]===255 && data[1]===0 && data[2]===0, 'data texture stores RGBA color');
    t.end();
});