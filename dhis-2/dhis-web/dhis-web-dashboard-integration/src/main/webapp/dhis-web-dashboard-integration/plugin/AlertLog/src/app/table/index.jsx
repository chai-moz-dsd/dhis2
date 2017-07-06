import React, {Component} from 'react';
import css from './index.scss';

export default class AlertLogTable extends Component {
  constructor(props) {
    super(props);
  }

  renderTableHead() {
    return (
      <thead>
      <tr>
        <th className={css.shortInfo}>Province</th>
        <th className={css.shortInfo}>District</th>
        <th className={css.longInfo}>Facility</th>
        <th className={css.longInfo}>Alert Text</th>
        <th className={css.shortInfo}>Date Sent</th>
        <th className={css.shortInfo}>BES Week/Year</th>
      </tr>
      </thead>
    )
  }

  renderTableBody() {
    const showData = this.props.showData;

    return !!showData.length && (
        <tbody>
        {
          showData.map((items) => {
            let list = [];

            this.renderTableRows([items], list);

            return list.map((item) => {
              return item;
            });
          })
        }
        </tbody>
      )
  }

  renderTableRows(items, rows) {
    items.forEach((item) => {
      rows.push((
        <tr>
          <td>
            {item.province}
          </td>
          <td>
            {item.district}
          </td>
          <td>
            {item.facility}
          </td>
          <td>
            <div className={css.alertText} title={item.alerttext}>
              {item.alerttext}
            </div>
          </td>
          <td>
            {item.datesend}
          </td>
          <td>
            {item.time}
          </td>
        </tr>
      ))
    });
  }

  render() {
    return (
      <table>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </table>
    )
  }
}
