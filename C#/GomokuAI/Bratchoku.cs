using System.Diagnostics;
using System.Numerics;

namespace GomokuAI
{
    public class Bratchoku
    {
        public long SimulatedMoves { get; private set; }
        private readonly BoardHelper _boardHelper;

        public Bratchoku()
        {
            SimulatedMoves = 0;
            _boardHelper = new BoardHelper();
        }

        public (string move, double time, long nodes) Play(ulong blackBitboard, ulong whiteBitboard, int depth)
        {
            SimulatedMoves = 0;
            var watch = Stopwatch.StartNew();

            // bit_count() -> PopCount
            bool blackToPlay = BitOperations.PopCount(blackBitboard) == BitOperations.PopCount(whiteBitboard);

            int[] moves = (int[])_boardHelper.GetSortedMoves(blackBitboard, whiteBitboard, blackToPlay);

            int bestMove = -1;
            double alpha = double.NegativeInfinity;
            double beta = double.PositiveInfinity;

            if (blackToPlay)
            {
                double bestVal = double.NegativeInfinity;
                foreach (int m in moves)
                {
                    blackBitboard |= (1UL << m);
                    double val = Minimax(blackBitboard, whiteBitboard, depth - 1, false, alpha, beta);
                    SimulatedMoves++;
                    blackBitboard &= ~(1UL << m);

                    if (val > bestVal)
                    {
                        bestVal = val;
                        bestMove = m;
                    }
                    alpha = Math.Max(alpha, bestVal);
                }
            }
            else
            {
                double bestVal = double.PositiveInfinity;
                foreach (int m in moves)
                {
                    whiteBitboard |= (1UL << m);
                    double val = Minimax(blackBitboard, whiteBitboard, depth - 1, true, alpha, beta);
                    SimulatedMoves++;
                    whiteBitboard &= ~(1UL << m);

                    if (val < bestVal)
                    {
                        bestVal = val;
                        bestMove = m;
                    }
                    beta = Math.Min(beta, bestVal);
                }
            }

            watch.Stop();
            string moveStr = _boardHelper.IndexToNotation(bestMove);

            return (moveStr, watch.Elapsed.TotalSeconds, SimulatedMoves);
        }

        private double Minimax(ulong blackBB, ulong whiteBB, int depth, bool blackToPlay, double alpha, double beta)
        {
            if (!blackToPlay)
            {
                if (_boardHelper.IsWinningPosition(blackBB)) return 1000000 + depth;
            }
            else
            {
                if (_boardHelper.IsWinningPosition(whiteBB)) return -1000000 - depth;
            }

            ulong combined = blackBB | whiteBB;
            if (depth == 0 || combined == 0xFFFFFFFFFFFFFFFF)
            {
                return _boardHelper.EvaluateBoard(blackBB, whiteBB);
            }

            int[] moves = (int[])_boardHelper.GetSortedMoves(blackBB, whiteBB, blackToPlay);

            if (blackToPlay)
            {
                double maxEval = double.NegativeInfinity;
                foreach (int moveIndex in moves)
                {
                    ulong moveMask = 1UL << moveIndex;
                    blackBB |= moveMask;
                    double evalScore = Minimax(blackBB, whiteBB, depth - 1, false, alpha, beta);
                    SimulatedMoves++;
                    blackBB &= ~moveMask;

                    maxEval = Math.Max(maxEval, evalScore);
                    alpha = Math.Max(alpha, evalScore);
                    if (beta <= alpha) break;
                }
                return maxEval;
            }
            else
            {
                double minEval = double.PositiveInfinity;
                foreach (int moveIndex in moves)
                {
                    ulong moveMask = 1UL << moveIndex;
                    whiteBB |= moveMask;
                    double evalScore = Minimax(blackBB, whiteBB, depth - 1, true, alpha, beta);
                    SimulatedMoves++;
                    whiteBB &= ~moveMask;

                    minEval = Math.Min(minEval, evalScore);
                    beta = Math.Min(beta, evalScore);
                    if (beta <= alpha) break;
                }
                return minEval;
            }
        }
    }
}