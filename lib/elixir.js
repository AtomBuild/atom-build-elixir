'use babel';
'use strict';

function provideBuilder() {

  var fs = require('fs');
  
  var isWin = /^win/.test(process.platform);
  var exec = isWin ? 'mix.bat' : 'mix';
  return {
    niceName: 'Elixir',

    isEligable: function (cwd) {
      return fs.existsSync(cwd + '/mix.exs');
    },

    settings: function (cwd) {

      return [ {
          name: 'Elixir: mix compile',
          exec: exec,
          args: [ 'compile' ],
          sh: false,
          errorMatch: [ '\\*\\*\\s{1}\\((?<errorType>[a-zA-Z]+)\\)\\s{1}(?<file>[\\/0-9a-zA-Z\\\\._-]+).*\\s{1}starting at line\\s{1}(?<line>\\d+)',
                        '\\*\\*\\s{1}\\((?<errorType>[a-zA-Z]+)\\)\\s{1}(?<file>[\\/0-9a-zA-Z\\\\._-]+):(?<line>\\d+)' ]
        },
        {
          name: 'Elixir: mix compile --warnings-as-errors',
          exec: exec,
          args: [ 'compile', '--warnings-as-errors' ],
          sh: false,
          errorMatch: [ '\\*\\*\\s{1}\\((?<errorType>[a-zA-Z]+)\\)\\s{1}(?<file>[\\/0-9a-zA-Z\\\\._-]+).*\\s{1}starting at line\\s{1}(?<line>\\d+)',
                        '\\*\\*\\s{1}\\((?<errorType>[a-zA-Z]+)\\)\\s{1}(?<file>[\\/0-9a-zA-Z\\\\._-]+):(?<line>\\d+)',
                        '(?<file>[\\/0-9a-zA-Z\\\\._-]+):(?<line>\\d+):\\s{1}warning:\\s{1}(?<warningReason>.*)' ]
        },
        {
          name: 'Elixir: mix clean',
          exec: exec,
          args: [ 'clean' ],
          sh: false,
          keymap: 'cmd-alt-k'
        },
        {
          name: 'Elixir: mix dialyzer',
          exec: exec,
          args: [ 'dialyzer', '--fullpath' ],
          sh: false,
          errorMatch: [ '(?<file>[\\/0-9a-zA-Z\\\\._-]+):(?<line>\\d+):\\s{1}(?<info>.*)' ]
        } ];
    }
  };
}

module.exports.provideBuilder = provideBuilder;
