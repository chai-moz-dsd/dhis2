import React, {Component} from 'react';

import {VictoryPie} from 'victory-pie';
import {DonutColor} from './config';
import {getIndicatorUrl} from './utils';
import css from './donutpie.css'

export default class DoughnutPie extends Component {
  static getY(datum) {
    return datum.amount;
  }

  static getColor(datum) {
    return DonutColor[datum.status];
  }

  static getLabel() {
    return '';
  }

  static redirectToIndex() {
    window.location.assign(getIndicatorUrl());
  }

  render() {
    return (
      <div onClick={DoughnutPie.redirectToIndex} className={css.donutPie}>
        <VictoryPie
        data={this.props.data.mBes}
        x="status"
        y={DoughnutPie.getY}
        style={{data: {fill: DoughnutPie.getColor}}}
        labels={DoughnutPie.getLabel}
        width={400}
        height={200}
        innerRadius={80}
      />
      </div>
    );
  }
}
