class boardHelper:
    def get_combined(self, black_bb, white_bb):
        return black_bb | white_bb

    def play_move(self, BB, index):
        move_mask = 1 << index
        BB |= move_mask
        return BB
    
    def remove_move(self, BB, index):
        move_mask = 1 << index
        BB &= move_mask
        return BB
    
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
        # On vérifie si un pion a un voisin à sa gauche, 4 fois de suite
        m = bb & (bb << 1) & MASK_NO_A
        m &= (m << 1) & MASK_NO_A
        m &= (m << 1) & MASK_NO_A
        m &= (m << 1) & MASK_NO_A
        if m: return True

        # 2. VERTICAL (Shift 8)
        # Pas besoin de masque : sortir par le haut (index > 63) annule le bit
        m = bb & (bb << 8)
        m &= (m << 8)
        m &= (m << 8)
        m &= (m << 8)
        if m: return True

        # 3. DIAGONALE MONTANTE / (Shift 9 : de a1 vers b2)
        # On doit bloquer la colonne A car on se déplace vers la droite (+1 col)
        m = bb & (bb << 9) & MASK_NO_A
        m &= (m << 9) & MASK_NO_A
        m &= (m << 9) & MASK_NO_A
        m &= (m << 9) & MASK_NO_A
        if m: return True

        # 4. DIAGONALE DESCENDANTE \ (Shift 7 : de h1 vers g2)
        # On doit bloquer la colonne H car on se déplace vers la gauche (-1 col)
        m = bb & (bb << 7) & MASK_NO_H
        m &= (m << 7) & MASK_NO_H
        m &= (m << 7) & MASK_NO_H
        m &= (m << 7) & MASK_NO_H
        if m: return True

        return False
    
    def get_sorted_moves(self, black_bb, white_bb, is_black_turn):
        occupied = black_bb | white_bb
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
        pass