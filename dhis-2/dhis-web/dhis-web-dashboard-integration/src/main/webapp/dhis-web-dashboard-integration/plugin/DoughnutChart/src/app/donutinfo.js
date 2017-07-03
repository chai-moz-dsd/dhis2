import React, {Component} from 'react';
import css from './donutinfo.scss';

export default class DoughnutInfo extends Component {

  static getAllMBesFacilities(subData) {
    let total = 0;
    for (const datum of subData.mBes) {
      total += datum.amount;
    }

    return total;
  }

  getAmount(status) {
    let subData = this.props.data;

    if (status === 'total') {
      return subData.total;
    }

    if (status === 'mBes') {
      return DoughnutInfo.getAllMBesFacilities(subData);
    }

    for (const datum of subData.mBes) {
      if (datum.status === status) {
        return datum.amount;
      }
    }

    throw new Error('Unknown status');
  }

  render() {
    return (
      <div className={css.doughnutInfoStyle}>
        <table>
        <tbody>
        <tr>
          <td>
            <span className={css.total}>{this.getAmount('total')}</span>
          </td>
          <td>
            {'Total number of Health Facilities existent'}
          </td>
        </tr>

        <tr>
          <td>
            <span className={css.mBes}><b>{this.getAmount('mBes')}</b></span>
          </td>
          <td>
            {'Health facilities are using the mBES system'}
          </td>
        </tr>

        <tr>
          <td>
            <span className={css.completed}><b>{this.getAmount('completed')}</b></span>
          </td>
          <td>
            {'Health facilities have submitted their completed mBES'}
          </td>
        </tr>

        <tr>
          <td>
            <span className={css.incomplete}><b>{this.getAmount('incomplete')}</b></span>
          </td>
          <td>
            {'Health facilities have submitted an incomplete mBES'}
          </td>
        </tr>

        <tr>
          <td>
            <span className={css.missing}><b>{this.getAmount('missing')}</b></span>
          </td>
          <td>
            {'Health facilities have not submitted their mBES'}
          </td>
        </tr>
        </tbody>
      </table>
      </div>
    );
  }
}
