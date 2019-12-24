import React from "react";
import "./experiments.scss";

import Slider from "./slider";

const Experiments = () => {
  return (
    <div className={`fullscreen experiments`}>
      <div className={`container experiments__container`}>
        Experiments!
        <Slider></Slider>
      </div>
    </div>
  );
};

export default Experiments;
