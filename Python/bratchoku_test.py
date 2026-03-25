import pytest
from bratchoku import Bratchoku

def test_minimax_find_win_in_horizontal():
    four_in_row_horizontal = 0b1111
    bratchoku = Bratchoku()
    assert bratchoku.play(four_in_row_horizontal,0, 2)[0] == 'e1'

def test_minimax_find_win_in_vertical():
    four_in_row_vertical = 0b1000000010000000100000001
    bratchoku = Bratchoku()
    assert bratchoku.play(four_in_row_vertical,0, 2)[0] == 'a5'

def test_minimax_find_win_in_asc_diag():
    four_in_row_asc_diag = 0b1000000001000000001000000001
    bratchoku = Bratchoku()
    assert bratchoku.play(four_in_row_asc_diag,0, 2)[0] == 'e5'

def test_minimax_find_win_in_desc_diag():
    four_in_row_desc_diag = 0b100000010000001000000100000000000
    bratchoku = Bratchoku()
    assert bratchoku.play(four_in_row_desc_diag,0, 2)[0] == 'e1'