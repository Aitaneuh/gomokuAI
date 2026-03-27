import pytest
from bratchoku import Bratchoku

@pytest.fixture
def ai():
    return Bratchoku()

def test_ai_finds_immediate_win_horizontal(ai):
    black_bb = (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3)
    white_bb = 0

    move, _, _ = ai.play(black_bb, white_bb, depth=1)
    
    assert move == "e1"

def test_ai_blocks_opponent_win(ai):
    white_bb = (1 << 0) | (1 << 8) | (1 << 16) | (1 << 24)
    black_bb = (1 << 7)
    
    move, _, _ = ai.play(black_bb, white_bb, depth=2)
    
    assert move == "a5"

def test_ai_prefers_center_initially(ai):
    move, _, _ = ai.play(0, 0, depth=1)
    assert move == "e4"


def test_alpha_beta_pruning_efficiency(ai):
    black_bb = (1 << 28) | (1 << 36)
    white_bb = (1 << 27) | (1 << 35)
    
    _, _, nodes_with_pruning = ai.play(black_bb, white_bb, depth=3)
    
    assert nodes_with_pruning > 0
    print(f"Nodes visited at depth 3: {nodes_with_pruning}")


def test_ai_finds_diag_win_your_case(ai):
    black_bb = (1 << 32) | (1 << 25) | (1 << 18) | (1 << 11)
    white_bb = (1 << 0)
    
    move, _, _ = ai.play(black_bb, white_bb, depth=2)
    assert move == "e1"