defmodule MultilineWarning do

  def go do
    # update/7 does not exist
    Map.update(1, 2, 3, 4, 5, 6, 7)
  end

end
