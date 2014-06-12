var test = require('tape').test;

var gl = require('webgl-context')();

var Texture = require('./');

test('testing error callback', function(t) {
    t.plan(1);

    var tex = new Texture(gl, {
        src: 'test',
        onError: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            t.ok(true, 'error callback received');
        }
    });
});

//// Constructor versions...

// var tex = new Texture(gl, {
//     src: "img.png",

// })