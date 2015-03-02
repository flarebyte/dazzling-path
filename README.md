#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> Artistic and experimental library to facilitate special effects on svg path



## Install

```sh
$ npm install --save dazzling-path
```


## Usage

Please have a look at the unit tests for typical usage.

```js
var dazzling-path = require('dazzling-path');

var rect= dazzlingPath.toPathObj('M 0 0 L 0 10 L 20 10 L 20 0 Z');
var area= dazzlingPath.toPolygonArea(rect);
```

```sh
$ npm install --global dazzling-path
$ dazzling-path --help
```


## License

MIT © [Olivier Huin]()


[npm-url]: https://npmjs.org/package/dazzling-path
[npm-image]: https://badge.fury.io/js/dazzling-path.svg
[travis-url]: https://travis-ci.org/flarebyte/dazzling-path
[travis-image]: https://travis-ci.org/flarebyte/dazzling-path.svg?branch=master
[daviddm-url]: https://david-dm.org/flarebyte/dazzling-path.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/flarebyte/dazzling-path
