const ProgressBar = ({ max = 100, value = 0, unit = "%" }) => {
  return (
    <div className="progress">
      <div className="progress__values">
        <span>{0}</span>
        <span>{Math.round(max / 2)}</span>
        <span>{max}</span>
      </div>
      <div className="progress__bg">
        <div className="progress__bar" style={{ transform: `translateX(${value / max * 100}%)` }}></div>
      </div>
      <span className="progress__unit">{unit}</span>
    </div>
  );
}

export default ProgressBar;
