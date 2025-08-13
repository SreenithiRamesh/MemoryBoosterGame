import { Chess } from 'chess.js';

export class ChessAI {
  constructor(options = {}) {
    this.depth = options.depth || 3;
    this.evaluate = options.evaluate || 'advanced';
  }

  getBestMove(fen) {
    const game = new Chess(fen);
    const moves = game.moves({ verbose: true });
    
    if (moves.length === 0) return null;
    
 
    const evaluateBoard = (game) => {
      const pieceValues = {
        p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000
      };
      
   
      const pawnEval = [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
      ];
      
      const knightEval = [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
      ];
      
      const bishopEval = [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
      ];
      
      const kingEval = [
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [20, 20,  0,  0,  0,  0, 20, 20],
        [20, 30, 10,  0,  0, 10, 30, 20]
      ];
      
      let score = 0;
      const board = game.board();
      
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = board[i][j];
          if (piece) {
            // Material value
            const value = pieceValues[piece.type.toLowerCase()];
            const sign = piece.color === 'w' ? 1 : -1;
            
            // Positional value
            let positional = 0;
            switch(piece.type.toLowerCase()) {
              case 'p':
                positional = piece.color === 'w' ? 
                  pawnEval[i][j] : pawnEval[7-i][j];
                break;
              case 'n':
                positional = piece.color === 'w' ? 
                  knightEval[i][j] : knightEval[7-i][j];
                break;
              case 'b':
                positional = piece.color === 'w' ? 
                  bishopEval[i][j] : bishopEval[7-i][j];
                break;
              case 'k':
                positional = piece.color === 'w' ? 
                  kingEval[i][j] : kingEval[7-i][j];
                break;
            }
            
            score += sign * (value + positional);
          }
        }
      }
      
      // Mobility bonus
      const mobilityWhite = game.moves({ verbose: true }).length;
      game.turn = 'b';
      const mobilityBlack = game.moves({ verbose: true }).length;
      game.turn = 'w';
      
      score += (mobilityWhite - mobilityBlack) * 0.1;
      
      return score;
    };
    
    // MiniMax algorithm with alpha-beta pruning
    const miniMax = (depth, game, alpha, beta, isMaximizing) => {
      if (depth === 0 || game.isGameOver()) {
        return evaluateBoard(game);
      }
      
      const moves = game.moves({ verbose: true });
      let bestValue = isMaximizing ? -Infinity : Infinity;
      
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        game.move(move);
        const value = miniMax(depth - 1, game, alpha, beta, !isMaximizing);
        game.undo();
        
        if (isMaximizing) {
          bestValue = Math.max(bestValue, value);
          alpha = Math.max(alpha, bestValue);
        } else {
          bestValue = Math.min(bestValue, value);
          beta = Math.min(beta, bestValue);
        }
        
        if (beta <= alpha) {
          break;
        }
      }
      
      return bestValue;
    };
    
    let bestMove = null;
    let bestValue = -Infinity;
    const alpha = -Infinity;
    const beta = Infinity;
    
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      game.move(move);
      const value = miniMax(this.depth - 1, game, alpha, beta, false);
      game.undo();
      
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }
    
    return bestMove ? `${bestMove.from}${bestMove.to}` : null;
  }
}