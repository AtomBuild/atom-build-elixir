'use babel';

import temp from 'temp';
import fs from 'fs-extra';
import specHelpers from 'atom-build-spec-helpers';
import { provideBuilder } from '../lib/elixir';

describe('elixir provider', () => {
  let directory;
  let builder;
  const Builder = provideBuilder();

  beforeEach(() => {
    waitsForPromise(() => {
      return specHelpers.vouch(temp.mkdir, 'atom-build-spec-')
        .then((dir) => specHelpers.vouch(fs.realpath, dir))
        .then((dir) => {
          directory = `${dir}/`;
          builder = new Builder(directory);
          atom.project.setPaths([ directory ]);
        });
    });
  });

  afterEach(() => {
    fs.removeSync(directory);
  });

  it('should not find any messages', () => {
    const fn = builder.settings()[0].functionMatch;
    const output = fs.readFileSync('./spec/examples/timing.log').toString();
    const messages = fn(output);
    expect(messages.length).toEqual(0);
  });

  it('should find compiler warning', () => {
    const fn = builder.settings()[0].functionMatch;
    const output = fs.readFileSync('./spec/examples/warning/mix.log').toString();
    const messages = fn(output);
    expect(messages.length).toEqual(1);
    expect(messages[0].type).toEqual('warning');
    expect(messages[0].message).toEqual('variable "arg1" is unused');
    expect(messages[0].file).toEqual('lib/warning.ex');
    expect(messages[0].line).toEqual('3');
  });

  it('should find multi-line compiler warning', () => {
    const fn = builder.settings()[0].functionMatch;
    const output = fs.readFileSync('./spec/examples/multiline_warning/mix.log').toString();
    const messages = fn(output);
    expect(messages.length).toEqual(1);
    expect(messages[0].type).toEqual('warning');
    expect(messages[0].message).toEqual(
`function Map.update/7 is undefined or private. Did you mean one of:

      * update/4`);
    expect(messages[0].file).toEqual('lib/multiline_warning.ex');
    expect(messages[0].line).toEqual('5');
  });

  it('should find multi-line compiler error', () => {
    const fn = builder.settings()[0].functionMatch;
    const output = fs.readFileSync('./spec/examples/multiline_error/mix.log').toString();
    const messages = fn(output);
    expect(messages.length).toEqual(1);
    expect(messages[0].type).toEqual('error');
    expect(messages[0].message).toEqual(
`(UndefinedFunctionError) function Map.update/5 is undefined or private. Did you mean one of:

      * update/4

    (elixir) Map.update(1, 2, 3, 4, 5)`);
    expect(messages[0].file).toEqual('lib/multiline_error.ex');
    expect(messages[0].line).toEqual('4');
  });

  it('should find compiler error', () => {
    const fn = builder.settings()[0].functionMatch;
    const output = fs.readFileSync('./spec/examples/error/mix.log').toString();
    const messages = fn(output);
    expect(messages.length).toEqual(1);
    expect(messages[0].type).toEqual('error');
    expect(messages[0].message).toEqual('(TokenMissingError) missing terminator: end (for "do" starting at line 1)');
    expect(messages[0].file).toEqual('lib/error.ex');
    expect(messages[0].line).toEqual('5');
  });

  it('should find unit test failure', () => {
    const fn = builder.settings()[0].functionMatch;
    const output = fs.readFileSync('./spec/examples/unit_test/mix.log').toString();
    const messages = fn(output);
    expect(messages.length).toEqual(1);
    expect(messages[0].type).toEqual('error');
    expect(messages[0].message).toEqual(
`test the truth (UnitTest)
     Assertion with == failed
     code:  1 + 1 == 99
     left:  2
     right: 99
     stacktrace:`);
    expect(messages[0].file).toEqual('test/unit_test.exs');
    expect(messages[0].line).toEqual('8');
  });
});
