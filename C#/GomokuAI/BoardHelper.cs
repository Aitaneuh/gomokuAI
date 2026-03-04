using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using static System.Net.WebRequestMethods;

namespace GomokuAI
{
    public class BoardHelper
    {
        private const ulong notColumnA = 0xFEFEFEFEFEFEFEFE;
        private const ulong notColumnH = 0x7F7F7F7F7F7F7F7F;
        private const ulong CENTER_MASK = 0x00003C3C3C3C0000;

        private static int[] BitboardToIndices(ulong BB)
        {
            var indices = new List<int>();
            while (BB != 0)
            {
                int index = BitOperations.TrailingZeroCount(BB);
                indices.Add(index);
                BB &= BB - 1;
            }
            return indices.ToArray();
        }

        private static int[] GetLegalMoves(ulong blackBB, ulong whiteBB)
        {
            ulong occupied = blackBB | whiteBB;
            if (occupied == 0) return [28];

            const ulong notColumnA = 0xFEFEFEFEFEFEFEFE;
            const ulong notColumnH = 0x7F7F7F7F7F7F7F7F;

            ulong aura = 0;
            aura |= (occupied << 1) & notColumnA; // Gauche
            aura |= (occupied >> 1) & notColumnH; // Droite
            aura |= (occupied << 8);              // Haut
            aura |= (occupied >> 8);              // Bas
            aura |= (occupied << 7) & notColumnH; // Diagonale Haut-Droite
            aura |= (occupied >> 7) & notColumnA; // Diagonale Bas-Gauche
            aura |= (occupied << 9) & notColumnA; // Diagonale Haut-Gauche
            aura |= (occupied >> 9) & notColumnH; // Diagonale Bas-Droite

            ulong movesBitboard = aura & ~occupied;

            return BitboardToIndices(movesBitboard);
        }

        public bool IsWinningPosition(ulong BB)
        {
            ulong m;

            // 1. HORIZONTAL (Shift 1)
            m = BB & (BB << 1) & notColumnA;
            m &= (m << 1) & notColumnA;
            m &= (m << 1) & notColumnA;
            m &= (m << 1) & notColumnA;
            if (m != 0) return true;

            // 2. VERTICAL (Shift 8)
            m = BB & (BB << 8);
            m &= (m << 8);
            m &= (m << 8);
            m &= (m << 8);
            if (m != 0) return true;

            // 3. DIAGONALE MONTANTE / (Shift 9)
            m = BB & (BB << 9) & notColumnA;
            m &= (m << 9) & notColumnA;
            m &= (m << 9) & notColumnA;
            m &= (m << 9) & notColumnA;
            if (m != 0) return true;

            // 4. DIAGONALE DESCENDANTE \ (Shift 7)
            m = BB & (BB << 7) & notColumnH;
            m &= (m << 7) & notColumnH;
            m &= (m << 7) & notColumnH;
            m &= (m << 7) & notColumnH;
            if (m != 0) return true;

            return false;
        }

        public Array GetSortedMoves(ulong blackBB, ulong whiteBB, bool isBlackTurn)
        {
            ulong occupied = blackBB | whiteBB;
            int[] moves = GetLegalMoves(blackBB, whiteBB);

            var scoredMoves = new List<(double score, int moveIndex)>();
            ulong myBB = isBlackTurn ? blackBB : whiteBB;
            ulong oppBB = isBlackTurn ? whiteBB : blackBB;

            foreach (int moveIndex in moves)
            {
                double score = 0;
                ulong mask = 1UL << moveIndex;

                if (this.IsWinningPosition(myBB | mask))
                {
                    score += 100000;
                }
                else if (this.IsWinningPosition(oppBB | mask))
                {
                    score += 50000;
                }

                double distCenter = Math.Abs(3.5 - (moveIndex % 8)) + Math.Abs(3.5 - (moveIndex / 8));
                score += (10 - distCenter);

                scoredMoves.Add((score, moveIndex));
            }

            return scoredMoves
                .OrderByDescending(m => m.score)
                .Select(m => m.moveIndex)
                .ToArray();
        }

        public int EvaluateBoard(ulong blackBB, ulong whiteBB)
        {
            int score = 0;
            score += CountPatterns(blackBB, whiteBB);
            score -= CountPatterns(whiteBB, blackBB);
            return score;
        }

        public int CountPatterns(ulong myBB, ulong oppBB)
        {
            int total = 0;
            ulong occupied = myBB | oppBB;
            ulong empty = ~occupied;

            int[] shifts = { 1, 8, 9, 7 };

            foreach (int shift in shifts)
            {
                ulong mask = 0xFFFFFFFFFFFFFFFF;
                if (shift == 1) mask = notColumnA;
                else if (shift == 7) mask = notColumnH;
                else if (shift == 9) mask = notColumnA;

                // 1. Chercher les "4 libres" ( . X X X X . )
                ulong m4 = myBB & (myBB << shift) & mask;
                m4 &= (m4 << (2 * shift)) & (mask & (mask << shift));

                // Vérification des extrémités vides
                ulong openFour = (m4 << shift) & empty & ((m4 >> (4 * shift)) & empty);
                if (openFour != 0) total += 10000;

                // 2. Chercher les "3 libres" ( . X X X . )
                ulong m3 = myBB & (myBB << shift) & mask;
                m3 &= (m3 << shift) & mask;

                // Vérification des extrémités vides
                ulong openThree = (m3 << shift) & empty & ((m3 >> (3 * shift)) & empty);
                if (openThree != 0) total += 1000;
            }

            // Bonus de proximité au centre (PopCount remplace bin().count('1'))
            total += BitOperations.PopCount(myBB & CENTER_MASK) * 10;

            return total;
        }

        public string IndexToNotation(int index)
        {
            if (index < 0 || index > 63) return "none";

            int colIndex = index % 8;  // 0 -> a, 1 -> b...
            int rowIndex = (index / 8) + 1; // 0 -> 1, 1 -> 2...

            // 'a' correspond au code ASCII 97
            char columnLetter = (char)(97 + colIndex);

            return $"{columnLetter}{rowIndex}";
        }
    }
}
