import Tile from "./Tile";

const Row = ({ feedback = [] }) => (
  <div className="row">
    {Array.from({ length: 5 }).map((_, i) => (
      <Tile key={i} {...(feedback[i] || {})} />
    ))}
  </div>
);
export default Row;
