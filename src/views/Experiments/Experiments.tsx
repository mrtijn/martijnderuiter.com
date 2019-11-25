import  React, { Component } from 'react';
import style from './experiments.module.scss';

class Experiments extends Component {
    render() { 
        return (
          <div className={`fullscreen ${style.experiments}`}>
            <div className={`container ${style.container}`}>Experiments!</div>
          </div>
        );
    }
}
 
export default Experiments;