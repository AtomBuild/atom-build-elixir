# Elixir compiler for Atom
[![Build Status](https://travis-ci.org/AtomBuild/atom-build-elixir.svg?branch=master)](https://travis-ci.org/AtomBuild/atom-build-elixir)
[![Gitter chat](https://badges.gitter.im/noseglid/atom-build.svg)](https://gitter.im/noseglid/atom-build)

Uses the [atom-build](https://github.com/noseglid/atom-build) package to build Elixir in the `Atom` editor.

This package requires [atom-build](https://github.com/noseglid/atom-build) to be installed.

This packages provides the following targets:

 * `Elixir: mix compile`
 * `Elixir: mix compile --warnings-as-errors`
 * `Elixir: mix test`
 * `Elixir: mix clean`
 * `Elixir: mix dialyzer`

In order to use `Elixir: mix dialyzer` successfully, you will need [dialyxir](https://github.com/jeremyjh/dialyxir) installed, your mix.exs configured to use it.
