import pytest
from board_helper import BoardHelper

@pytest.fixture
def helper():
    return BoardHelper()


def test_index_to_notation(helper):
    assert helper.index_to_notation(0) == "a1"
    assert helper.index_to_notation(4) == "e1"
    assert helper.index_to_notation(7) == "h1"
    assert helper.index_to_notation(32) == "a5"
    assert helper.index_to_notation(63) == "h8"
    assert helper.index_to_notation(64) == "none"

def test_bitboard_to_indices(helper):
    bb = (1 << 0) | (1 << 4) | (1 << 63)
    indices = helper.bitboard_to_indices(bb)
    assert sorted(indices) == [0, 4, 63]
    assert helper.bitboard_to_indices(0) == []


def test_is_winning_horizontal(helper):
    bb = sum(1 << i for i in range(5))
    assert helper.is_winning_position(bb) is True

def test_is_winning_vertical(helper):
    bb = sum(1 << (i * 8) for i in range(5))
    assert helper.is_winning_position(bb) is True

def test_is_winning_diag_descending_your_case(helper):
    pions = [32, 25, 18, 11, 4]
    bb = sum(1 << p for p in pions)
    assert helper.is_winning_position(bb) is True

def test_no_win_on_wrap_around(helper):
    pions = [5, 6, 7, 8, 9] 
    bb = sum(1 << p for p in pions)
    assert helper.is_winning_position(bb) is False

def test_get_legal_moves_empty_board(helper):
    assert helper.get_legal_moves(0, 0) == [28]

def test_get_legal_moves_aura(helper):
    moves = helper.get_legal_moves(1 << 27, 0) # d4
    assert 18 in moves
    assert 19 in moves
    assert 20 in moves
    assert 26 in moves
    assert 28 in moves
    assert 34 in moves
    assert 35 in moves
    assert 36 in moves


def test_get_sorted_moves_priorities(helper):
    black_bb = sum(1 << i for i in range(4))
    white_bb = 0
    
    moves = helper.get_sorted_moves(black_bb, white_bb, is_black_turn=True)
    assert moves[0] == 4
    
    moves = helper.get_sorted_moves(black_bb, white_bb, is_black_turn=False)
    assert moves[0] == 4