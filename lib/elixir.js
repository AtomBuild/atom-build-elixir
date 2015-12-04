'use babel';

import fs from 'fs';

export function provideBuilder() {
  return class ElixirBuildProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'Elixir';
    }

    isEligible() {
      return fs.existsSync(`${this.cwd}/mix.exs`);
    }

    settings() {
      return [ {
        name: 'Elixir: mix compile',
        exec: 'mix',
        args: [ 'compile' ],
        sh: false,
        errorMatch: [ '\\*\\*\\s{1}\\((?<errorType>[a-zA-Z]+)\\)\\s{1}(?<file>[\\/0-9a-zA-Z\\\\._-]+).*\\s{1}starting at line\\s{1}(?<line>\\d+)',
                      '\\*\\*\\s{1}\\((?<errorType>[a-zA-Z]+)\\)\\s{1}(?<file>[\\/0-9a-zA-Z\\\\._-]+):(?<line>\\d+)' ]
      },
      {
        name: 'Elixir: mix compile --warnings-as-errors',
        exec: 'mix',
        args: [ 'compile', '--warnings-as-errors' ],
        sh: false,
        errorMatch: [ '\\*\\*\\s{1}\\((?<errorType>[a-zA-Z]+)\\)\\s{1}(?<file>[\\/0-9a-zA-Z\\\\._-]+).*\\s{1}starting at line\\s{1}(?<line>\\d+)',
                      '\\*\\*\\s{1}\\((?<errorType>[a-zA-Z]+)\\)\\s{1}(?<file>[\\/0-9a-zA-Z\\\\._-]+):(?<line>\\d+)',
                      '(?<file>[\\/0-9a-zA-Z\\\\._-]+):(?<line>\\d+):\\s{1}warning:\\s{1}(?<warningReason>.*)' ]
      },
      {
        name: 'Elixir: mix clean',
        exec: 'mix',
        args: [ 'clean' ],
        sh: false,
        keymap: 'cmd-alt-k'
      },
      {
        name: 'Elixir: mix dialyzer',
        exec: 'mix',
        args: [ 'dialyzer', '--fullpath' ],
        sh: false,
        errorMatch: [ '(?<file>[\\/0-9a-zA-Z\\\\._-]+):(?<line>\\d+):\\s{1}(?<info>.*)' ]
      } ];
    }
  };
}
