import PropTypes from "prop-types";
import "./BarGraph.css";

export default function BarGraph({ data, title }) {
  const colors = [
    "#4fc2dc88",
    "#9a4fdc88",
    "#dc984f88",
    "#7edc4f88",
    "#dc4fad88",
    "#dcd74f88",
  ];
  let colorIdx = -1;

  return (
    <div className="graphFrame">
      <h3 className="graphTitle">{title}</h3>
      <div className="graphContainer">
        <div className="dataLabelContainer">
          {Object.keys(data).map((label, idx) => (
            <p className="dataLabel" key={idx + label}>
              {label.length < 14 ? label : label.substring(0,10)+"..."}
            </p>
          ))}
        </div>
        <div className="dataBarContainer">
          {Object.values(data).map((bar, idx) => {
            colorIdx = colorIdx < colors.length - 1 ? colorIdx + 1 : 0;
            return (
              <div
                className="dataBar"
                key={idx + String(bar)}
                style={{ width: `${bar}%`, backgroundColor: colors[colorIdx] }}
              >
                <span
                  style={{ translate: bar > 30 ? "-20% -50%" : "120% -50%" }}
                  className="barLabel"
                >
                  {bar}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

BarGraph.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string,
};
