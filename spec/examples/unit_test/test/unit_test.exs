ExUnit.start()

defmodule UnitTest do

  use ExUnit.Case, async: true

  test "the truth" do
    assert 1 + 1 == 99
  end
end
