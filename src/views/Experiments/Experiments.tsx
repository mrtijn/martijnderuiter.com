import React, { Component } from "react";
import "./experiments.scss";
// import { Slider } from "../../utils/slider";
import Glide from "@glidejs/glide";
class Experiments extends Component {
    componentDidMount() {
        const el = document.getElementById("slider") as HTMLElement;
        // new Slider(el, {});

        new Glide(".glide").mount();
    }
    render() {
        return (
            <div className={`fullscreen experiments`}>
                <div className={`container experiments__container`}>
                    Experiments!
                </div>
                <div id="slider" className="glide">
                    <ul className="glide__track" data-glide-el="track">
                        <li className="glide__slide">test 1</li>
                        <li className="glide__slide">test 2</li>
                        <li className="glide__slide">test 3</li>
                        <li className="glide__slide">test 1</li>
                        <li className="glide__slide">test 2</li>
                        <li className="glide__slide">test 3</li>
                    </ul>
                    <div data-glide-el="controls">
                        <button data-glide-dir="<<">Start</button>
                        <button data-glide-dir=">>">End</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Experiments;
