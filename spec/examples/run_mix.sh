# Run mix compile / mix test on each project and capture the output

docker pull elixir:1.4.1-slim

rm -rf error/_build/
rm -rf multiline_error/_build/
rm -rf warning/_build/
rm -rf multiline_warning/_build/
rm -rf unit_test/_build/
rm -rf multiple_unit_tests/_build/

docker run --rm --volume $PWD:/src --workdir /src/error                 elixir:1.4.1-slim mix compile > error/mix.log 2>&1
docker run --rm --volume $PWD:/src --workdir /src/multiline_error       elixir:1.4.1-slim mix compile > multiline_error/mix.log 2>&1
docker run --rm --volume $PWD:/src --workdir /src/warning               elixir:1.4.1-slim mix compile > warning/mix.log 2>&1
docker run --rm --volume $PWD:/src --workdir /src/multiline_warning     elixir:1.4.1-slim mix compile > multiline_warning/mix.log 2>&1
docker run --rm --volume $PWD:/src --workdir /src/unit_test             elixir:1.4.1-slim mix test    > unit_test/mix.log 2>&1
docker run --rm --volume $PWD:/src --workdir /src/multiple_unit_tests   elixir:1.4.1-slim mix test    > multiple_unit_tests/mix.log 2>&1
