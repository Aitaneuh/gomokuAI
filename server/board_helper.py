class boardHelper:
    def __init__(self, black_bb=0, white_bb=0):
        self.black = black_bb
        self.white = white_bb

    def get_combined(self):
        return self.black | self.white

    def is_empty(self, index):
        # Vérifie si la case index est libre
        return not ((self.black | self.white) & (1 << index))
    
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