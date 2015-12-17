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
      const exec = /^win/.test(process.platform) ? 'mix.bat' : 'mix';
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
        name: 'Elixir: mix test',
        exec: exec,
        args: [ 'test' ],
        sh: false,
        errorMatch: [ '(?<file>[\\/0-9a-zA-Z\\\\._-]+):(?<line>\\d+)' ]
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
