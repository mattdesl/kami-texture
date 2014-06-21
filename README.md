# kami-texture

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)


2D texture utility for [kami](http://github.com/mattdesl/kami). Often rendered using [kami-batch](http://mattdesl.github.io/kami-batch).

```js
//get a webGL context somehow
var gl = require('webgl-context');

//load an image onto the GPU...
var tex = require('kami-texture')(gl, {
	src: 'img/blah.png'
});

//setup filters if you want
tex.setFilter(Texture.Filter.LINEAR);

//render it with kami-batch or another lib...
```

## Usage

[![NPM](https://nodei.co/npm/kami-texture.png)](https://nodei.co/npm/kami-texture/)

For full details, see the [kami API docs](http://mattdesl.github.io/kami/docs/). Here is the module at a glance.

### `Texture(gl, options)`

The constructor. Can specify an image in options:

- `src`: the image source URI
- `crossOrigin`: a string to pass onto the Image object, or undefined
- `onLoad`: called when the image is loaded
- `onError`: called if there was an error loading the image

Or you can specify the raw data directly:

- `data`: an array of pixels, typically Uint8Array
- `format`: a gl format, default RGBA. The constants are aliased onto `Texture.Format`
- `type`: a gl type for the data array, default UNSIGNED_BYTE. The constants are aliased onto `Texture.DataType`
- `width`: the width of the data
- `height`: the height of the data

If no data is specified, null (empty) data is uploaded in place. There are also a couple other parameters which can be used with images or data constructor:

- `genMipmaps`: whether to generate mipmaps, default false

### `tex.width`, `tex.height`

Dimensions of the texture

### `tex.id`

The WebGLTexture identifier. 

### `tex.setFilter(min, mag)`

Sets the min and mag filter. LINEAR, NEAREST, etc. constants are aliased onto `Texture.Filter`. If a single argument is passed, it will be applied to both min and mag.

This will bind the texture before applying the parameters.

### `tex.setWrap(s, t)`

Sets the texture wrap mode. REPEAT, CLAMP_TO_EDGE, etc. are aliased onto `Texture.Wrap`. 

This will bind the texture before applying the parameters.

### `tex.bind(n)`

If a number is passed, that texture slot will be made active and this texture bound to it. Otherwise, the texture will be bound to whatever texture slot is currently active. 

### `uploadData(width, height, format, type, data, genMipmaps)`

Calls `glTexImage2D` with the given parameters, and a data array as input.

### `uploadImage(domObject, format, type, genMipmaps)`

Calls `glTexImage2D` with the given parameters, and an HTML image as input.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/kami-texture/blob/master/LICENSE.md) for details.
