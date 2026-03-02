import time


class Bratchoku:
    def __init__(self):
        self.simulated_moves = 0

    def play(self, black_bitboard: int, white_bitboard: int) -> str:
        self.simulated_moves = 0
        start = time.time()

        black_to_play = black_bitboard.bit_count() == white_bitboard.bit_count()
        return "e4"