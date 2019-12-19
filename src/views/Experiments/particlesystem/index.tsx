import React, { Component } from "react";
import particles from "./particles.js";
class Particles extends Component {
  render() {
    return <div id="container"></div>;
  }
  componentDidMount() {
    particles();
  }
}

export default Particles;
