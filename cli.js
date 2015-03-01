#!/usr/bin/env node
'use strict';
var meow = require('meow');
var dazzlingPath = require('./');

var cli = meow({
  help: [
    'Usage',
    '  dazzling-path <input>',
    '',
    'Example',
    '  dazzling-path Unicorn'
  ].join('\n')
});

dazzlingPath(cli.input[0]);
