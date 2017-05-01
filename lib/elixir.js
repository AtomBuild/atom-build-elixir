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

      const functionMatch = function (output) {
        const errorRE1 = /\*\* (\(.+\)) (.+):(\d+): (.+)/;  // e.g.: ** (AnError) my_file.ex:11: a description
        const errorRE2 = /\*\* (\(.+\) .+)/;                // e.g.: ** (AnError) A description
        const warningRE = /warning: (.*)/;                  // e.g.: warning: variable "arg1" is unused
        const testRE = /\d+\) (.*)/;                        // e.g.:     2) test the truth (UnitTest)
        const locationRE1 = /\s*\((.+)\)(.+):(\d+): .*/;    // e.g.:   (MyProject) my_file.ex:9: (module)
        const locationRE2 = /\s*(.+):(\d+).*/;              // e.g.:   my_file.ex:9: (module)
        const ignoredProjects = ['elixir', 'stdlib'];

        const messages = [];

        let message = null;
        const lines = output.split('\n');
        lines.forEach(function (line) {
          let match = null;
          if ((match = line.match(errorRE1))) {
            // found start of error message
            message = {type: 'error', message: match[1] + ' ' + match[4], file: match[2], line: match[3]};
          } else if ((match = line.match(errorRE2))) {
            // found start of error message
            message = {type: 'error', message: match[1]};
          } else if ((match = line.match(warningRE))) {
            // found start of warning message
            message = {type: 'warning', message: match[1]};
          } else if ((match = line.match(testRE))) {
            // found start of unit test message
            message = {type: 'error', message: match[1]};
          } else if (message) {
            // we found the start of a message on the prior line,
            // look for multi-line messages and stack traces
            if ((match = line.match(locationRE1))) {
              // found a file:line location, ignore locations in system libs
              if (ignoredProjects.indexOf(match[1]) < 0) {
                message.file = match[2];
                message.line = match[3];
              }
            } else if ((match = line.match(locationRE2))) {
              // found a file:line location
              message.file = match[1];
              message.line = match[2];
            } else if (line.startsWith('  ')) {
              // found multi-line message
              message.message += '\n' + line;
            } else if (line === '') {
              // found blank line
              message.message += '\n';
            } else {
              // we didn't recoginize what is on the line,
              // assume that we've read all of the current
              // mesage
              messages.push(message);
              message = null;
            }
          }
        });
        if (message) {
          messages.push(message);
        }
        messages.forEach(m => m.message = m.message.trim());
        return messages;
      };

      return [ {
        name: 'Elixir: mix compile',
        exec: exec,
        args: [ 'compile' ],
        sh: false,
        functionMatch: functionMatch
      },
      {
        name: 'Elixir: mix compile --warnings-as-errors',
        exec: exec,
        args: [ 'compile', '--warnings-as-errors' ],
        sh: false,
        functionMatch: functionMatch
      },
      {
        name: 'Elixir: mix test',
        exec: exec,
        args: [ 'test' ],
        sh: false,
        functionMatch: functionMatch
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
