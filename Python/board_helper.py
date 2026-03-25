class boardHelper:
    def bitboard_to_indices(self, bb):
        indices = []
        while bb:
            idx = (bb & -bb).bit_length() - 1
            indices.append(idx)
            bb &= bb - 1
        return indices
    
    def get_legal_moves(self, black_bb, white_bb):
        occupied = black_bb | white_bb
        if occupied == 0:
            return [28] # Si le plateau est vide, on joue au centre (ex: d4)

        # On "étire" le plateau dans toutes les directions
        aura = (occupied << 1) | (occupied >> 1) | \
            (occupied << 8) | (occupied >> 8) | \
            (occupied << 7) | (occupied >> 7) | \
            (occupied << 9) | (occupied >> 9)
        
        moves_bitboard = aura & ~occupied & 0xFFFFFFFFFFFFFFFF
        
        return self.bitboard_to_indices(moves_bitboard)
    
    def is_winning_position(self, bb: int) -> bool:
        MASK_NO_A = 0xFEFEFEFEFEFEFEFE
        MASK_NO_H = 0x7F7F7F7F7F7F7F7F

        # 1. HORIZONTAL (Shift 1)
        m = bb & (bb << 1) & MASK_NO_A
        m &= (m << 1) & MASK_NO_A
        m &= (m << 1) & MASK_NO_A
        m &= (m << 1) & MASK_NO_A
        if m: return True

        # 2. VERTICAL (Shift 8)
        m = bb & (bb << 8)
        m &= (m << 8)
        m &= (m << 8)
        m &= (m << 8)
        if m: return True

        # 3. DIAGONALE MONTANTE / (Shift 9)
        m = bb & (bb << 9) & MASK_NO_A
        m &= (m << 9) & MASK_NO_A
        m &= (m << 9) & MASK_NO_A
        m &= (m << 9) & MASK_NO_A
        if m: return True

        # 4. DIAGONALE DESCENDANTE \ (Shift 7)
        m = bb & (bb << 7) & MASK_NO_H
        m &= (m << 7) & MASK_NO_H
        m &= (m << 7) & MASK_NO_H
        m &= (m << 7) & MASK_NO_H
        if m: return True

        return False
    
    def get_sorted_moves(self, black_bb, white_bb, is_black_turn):
        moves = self.get_legal_moves(black_bb, white_bb)
        
        scored_moves = []
        my_bb = black_bb if is_black_turn else white_bb
        opp_bb = white_bb if is_black_turn else black_bb

        for move_index in moves:
            score = 0
            mask = 1 << move_index
            
            # PRIORITÉ 1 : Est-ce que ce coup me fait gagner ?
            if self.is_winning_position(my_bb | mask):
                score += 100000
                
            # PRIORITÉ 2 : Est-ce que ce coup bloque une victoire adverse ?
            elif self.is_winning_position(opp_bb | mask):
                score += 50000

            # PRIORITÉ 3 : Bonus de proximité (jouer près du centre est statistiquement meilleur)
            # On donne un petit bonus selon la distance au centre (cases 27, 28, 35, 36)
            dist_center = abs(3.5 - (move_index % 8)) + abs(3.5 - (move_index // 8))
            score += (10 - dist_center)

            scored_moves.append((score, move_index))

        # On trie du plus gros score au plus petit
        scored_moves.sort(key=lambda x: x[0], reverse=True)
        
        # On ne renvoie que les index
        return [m[1] for m in scored_moves]
    
    def evaluate_board(self, black_bb, white_bb):
        score = 0
        
        score += self.count_patterns(black_bb, white_bb)
        score -= self.count_patterns(white_bb, black_bb)
        
        return score

    def count_patterns(self, my_bb, opp_bb):
        MASK_NO_A = 0xFEFEFEFEFEFEFEFE
        MASK_NO_H = 0x7F7F7F7F7F7F7F7F

        total = 0
        occupied = my_bb | opp_bb
        empty = ~occupied & 0xFFFFFFFFFFFFFFFF

        for shift in [1, 8, 9, 7]:
            mask = 0xFFFFFFFFFFFFFFFF
            if shift == 1: mask = MASK_NO_A
            elif shift == 7: mask = MASK_NO_H
            elif shift == 9: mask = MASK_NO_A

            # 1. Chercher les "4 libres" ( . X X X X . )
            m4 = my_bb & (my_bb << shift) & mask
            m4 &= (m4 << (2 * shift)) & (mask & (mask << shift))
            
            # Vérifier si c'est entouré de vide
            open_four = (m4 << shift) & empty & ((m4 >> (4 * shift)) & empty)
            if open_four: total += 10000

            # 2. Chercher les "3 libres" ( . X X X . )
            m3 = my_bb & (my_bb << shift) & mask
            m3 &= (m3 << shift) & mask
            
            # Vérifier si c'est entouré de vide
            open_three = (m3 << shift) & empty & ((m3 >> (3 * shift)) & empty)
            if open_three: total += 1000

        # Bonus de proximité au centre (très léger pour départager les positions vides)
        # On peut pré-calculer un masque de centre
        total += bin(my_bb & 0x00003C3C3C3C0000).count('1') * 10
        
        return total
    
    def index_to_notation(self, index: int) -> str:
        if index < 0 or index > 63:
            return "none"
            
        col_index = index % 8  # 0 -> a, 1 -> b, etc.
        row_index = (index // 8) + 1  # 0 -> 1, 1 -> 2, etc.
        
        # Conversion du col_index en lettre (a=97 en ASCII)
        column_letter = chr(97 + col_index)
        
        return f"{column_letter}{row_index}"