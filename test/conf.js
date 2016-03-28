"use strict";
exports.config = {
  framework        : 'mocha',
  specs            : ['specs/*.js'],
  mochaOpts        : {
    reporter: "spec",
    slow    : 20000
  }
};