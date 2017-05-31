import React, {Component} from 'react';
import css from './donutinfo.css';

// const i18n_hf_total_num = 'total num';
// const i18n_hf_using_num = 'using num';
// const i18n_hf_completed = 'i18n_hf_completed';
// const i18n_hf_incomplete = 'i18n_hf_incomplete';
// const i18n_hf_not_summited = 'i18n_hf_not_summited';

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
            {`${i18n_hf_total_num}`}
          </td>
        </tr>

        <tr>
          <td>
            <span className={css.mBes}><b>{this.getAmount('mBes')}</b></span>
          </td>
          <td>
            {`${i18n_hf_using_num}`}
          </td>
        </tr>

        <tr>
          <td>
            <span className={css.completed}><b>{this.getAmount('completed')}</b></span>
          </td>
          <td>
            {`${i18n_hf_completed}`}
          </td>
        </tr>

        <tr>
          <td>
            <span className={css.incomplete}><b>{this.getAmount('incomplete')}</b></span>
          </td>
          <td>
            {`${i18n_hf_incomplete}`}
          </td>
        </tr>

        <tr>
          <td>
            <span className={css.missing}><b>{this.getAmount('missing')}</b></span>
          </td>
          <td>
            {`${i18n_hf_not_summited}`}
          </td>
        </tr>
        </tbody>
      </table>
      </div>
    );
  }
}
