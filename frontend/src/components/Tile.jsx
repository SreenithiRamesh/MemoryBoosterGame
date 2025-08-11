const Tile = ({ letter = "", color = "" }) => (
  <div className={`tile ${color}`}>{letter}</div>
);
export default Tile;
