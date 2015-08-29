'use babel';
'use strict';

function provideBuilder() {

  var fs = require('fs');

  return {
    niceName: 'Elixir',

    isEligable: function (path) {
      return fs.existsSync(path + '/mix.exs');
    },

    settings: function (path) {
      return [ {
        name: 'Elixir: default',
        exec: 'mix',
        args: [ 'compile' ],
        sh: false
      } ];
    }
  };
}

module.exports.provideBuilder = provideBuilder;
