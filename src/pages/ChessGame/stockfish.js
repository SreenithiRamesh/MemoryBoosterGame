export default function initStockfish() {
  const stockfish = new Worker('stockfish.js'); // You need to add stockfish.js to your public folder
  stockfish.postMessage('uci');
  stockfish.postMessage('isready');
  return stockfish;
}