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

    var batch = require('kami-batch')(gl);

    var tex = Texture(gl, {
        width: 1,
        height: 1,
        data: new Uint8Array([255, 0, 0]),
        format: Texture.Format.RGB
    });

    //TODO: use FBO to read pixels instead of relying on kami-batch for this test
    batch.begin();
    batch.draw(tex, 0, 0, 1, 1);
    batch.end();

    var pix = getPixels(gl);
    t.ok( pix[0]===255 && pix[1]===0 && pix[2]===0, 'data texture is correct color' );

    t.end();
});