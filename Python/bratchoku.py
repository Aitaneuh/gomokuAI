import time
from board_helper import boardHelper


class Bratchoku:
    def __init__(self):
        self.simulated_moves = 0
        self.board_helper = boardHelper()

    def play(self, black_bitboard: int, white_bitboard: int, depth: int):
        self.simulated_moves = 0
        start = time.time()
        
        black_to_play = black_bitboard.bit_count() == white_bitboard.bit_count()
        
        moves = self.board_helper.get_sorted_moves(black_bitboard, white_bitboard, black_to_play)
        
        best_move = -1
        alpha = -float('inf')
        beta = float('inf')
        if black_to_play:
            best_val = -float('inf')
            for m in moves:
                black_bitboard |= (1 << m)
                val = self.minimax(black_bitboard, white_bitboard, depth - 1, False, alpha, beta)
                self.simulated_moves += 1
                black_bitboard &= ~(1 << m)
                
                if val > best_val:
                    best_val = val
                    best_move = m
                alpha = max(alpha, best_val)
        else:
            best_val = float('inf')
            for m in moves:
                white_bitboard |= (1 << m)
                val = self.minimax(black_bitboard, white_bitboard, depth - 1, True, alpha, beta)
                self.simulated_moves += 1
                white_bitboard &= ~(1 << m)
                
                if val < best_val:
                    best_val = val
                    best_move = m
                beta = min(beta, best_val)

        move_str = self.board_helper.index_to_notation(best_move)
        
        return move_str, time.time() - start, self.simulated_moves
    
    def minimax(self, black_bb, white_bb, depth, black_to_play, alpha, beta):

        if not black_to_play:
            if self.board_helper.is_winning_position(black_bb):
                return 1000000 + depth
        else:
            if self.board_helper.is_winning_position(white_bb):
                return -1000000 - depth
            
        combined = black_bb | white_bb
        if depth == 0 or combined == 0xFFFFFFFFFFFFFFFF: # board plein
            return self.board_helper.evaluate_board(black_bb, white_bb)
        
        moves = self.board_helper.get_sorted_moves(black_bb, white_bb, black_to_play)

        if black_to_play:
            max_eval = -float('inf')
            for move_index in moves:
                move_mask = 1 << move_index
                
                black_bb |= move_mask
                eval_score = self.minimax(black_bb, white_bb, depth - 1, False, alpha, beta)
                self.simulated_moves += 1
                black_bb &= ~move_mask
                
                max_eval = max(max_eval, eval_score) # type: ignore
                alpha = max(alpha, eval_score) # type: ignore
                if beta <= alpha:
                    break
            return max_eval

        else:
            min_eval = float('inf')
            for move_index in moves:
                move_mask = 1 << move_index
                
                white_bb |= move_mask
                eval_score = self.minimax(black_bb, white_bb, depth - 1, True, alpha, beta)
                self.simulated_moves += 1
                white_bb &= ~move_mask
                
                min_eval = min(min_eval, eval_score)
                beta = min(beta, eval_score)
                if beta <= alpha:
                    break
            return min_eval