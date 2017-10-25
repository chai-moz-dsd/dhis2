import React, {Component} from 'react';
import css from './index.scss';

export default class SubmissionTable extends Component {
  constructor(props) {
    super(props);
  }

  renderTableHead() {
    return (
      <thead>
      <tr>
        <th rowSpan={3}>Facility</th>
        <th rowSpan={3}>District</th>
        <th rowSpan={3}>Province</th>
        <th rowSpan={3}>Week End Date</th>
        <th rowSpan={3}>Week</th>

        <th colSpan={2} rowSpan={2}>001 CÓLERA</th>
        <th colSpan={2} rowSpan={2}>009.2 DISENTERIA</th>
        <th colSpan={2} rowSpan={2}>020 PESTE</th>
        <th colSpan={2} rowSpan={2}>037 TÉTANO RECÉM NASCIDOS</th>
        <th colSpan={2} rowSpan={2}>045 PARALISIA FLÁCIDA AGUDA</th>
        <th colSpan={2} rowSpan={2}>071 RAIVA</th>
        <th colSpan={6} rowSpan={1}>DIARREIA 009</th>
        <th colSpan={4} rowSpan={1}>MALARIA CLINICA</th>
        <th colSpan={4} rowSpan={1}>MALARIA CONFIRMADA</th>
        <th colSpan={4} rowSpan={1}>MENINGITE 036</th>
        <th colSpan={8} rowSpan={1}>SARAMPO 055</th>
        <th colSpan={2} rowSpan={3}>Comments</th>
      </tr>

      <tr>
        <th colSpan={2} rowSpan={1}>0-4 anos</th>
        <th colSpan={2} rowSpan={1}>5-14 anos</th>
        <th colSpan={2} rowSpan={1}>15 anos+</th>
        <th colSpan={2} rowSpan={1}>0-4 anos</th>
        <th colSpan={2} rowSpan={1}>5 anos+</th>
        <th colSpan={2} rowSpan={1}>0-4 anos</th>
        <th colSpan={2} rowSpan={1}>5 anos+</th>
        <th colSpan={2} rowSpan={1}>0-4 anos</th>
        <th colSpan={2} rowSpan={1}>5 anos+</th>
        <th colSpan={2} rowSpan={1}>Menos de 9 meses</th>
        <th colSpan={2} rowSpan={1}>9-23 meses(Não Vacinados)</th>
        <th colSpan={2} rowSpan={1}>9-23 meses(Vacinados)</th>
        <th colSpan={2} rowSpan={1}>24 meses e mais</th>
      </tr>

      <tr>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
        <th>C</th>
        <th>O</th>
      </tr>

      </thead>
    )
  }

  renderTableBody(showData) {

    return !!showData.length && (
      <tbody>
      {showData.map((items) => {
        let list = [];
        this.renderTableRows([items], list);

        return list.map((item) => {
          return item;
        });
        }
      )}
      </tbody>
    )
  }

  renderTableRows(items, rows) {
    items.forEach((item) => {
      rows.push((
        <tr>
          <td>{item.facility}</td>
          <td>{item.district}</td>
          <td>{item.province}</td>
          <td>{item.week_end_date}</td>
          <td>{item.week}</td>
          <td>{item.cases_colera}</td>
          <td>{item.deaths_colera}</td>
          <td>{item.cases_dysentery}</td>
          <td>{item.deaths_dysentery}</td>
          <td>{item.cases_plague}</td>
          <td>{item.deaths_plague}</td>
          <td>{item.cases_tetanus}</td>
          <td>{item.deaths_tetanus}</td>
          <td>{item.cases_pfa}</td>
          <td>{item.deaths_pfa}</td>
          <td>{item.cases_rabies}</td>
          <td>{item.deaths_rabies}</td>
          <td>{item.cases_diarrhea_04}</td>
          <td>{item.deaths_diarrhea_04}</td>
          <td>{item.cases_diarrhea_5_14}</td>
          <td>{item.deaths_diarrhea_5_14}</td>
          <td>{item.cases_diarrhea_15}</td>
          <td>{item.deaths_diarrhea_15}</td>
          <td>{item.cases_malaria_clinic_0_4}</td>
          <td>{item.deaths_malaria_clinic_0_4}</td>
          <td>{item.cases_malaria_clinic_5}</td>
          <td>{item.deaths_malaria_clinic_5}</td>
          <td>{item.cases_malaria_confirmed_0_4}</td>
          <td>{item.deaths_malaria_confirmed_0_4}</td>
          <td>{item.cases_malaria_confirmed_5}</td>
          <td>{item.deaths_malaria_confirmed_5}</td>
          <td>{item.cases_meningitis_0_4}</td>
          <td>{item.deaths_meningitis_04}</td>
          <td>{item.cases_meningitis_5}</td>
          <td>{item.deaths_meningitis_5}</td>
          <td>{item.cases_measles_9}</td>
          <td>{item.deaths_measles_9}</td>
          <td>{item.cases_nv_measles}</td>
          <td>{item.deaths_measles_nv}</td>
          <td>{item.cases_measles_v9_23}</td>
          <td>{item.deaths_measles_v_9_23}</td>
          <td>{item.cases_measles_24}</td>
          <td>{item.deaths_measles_24}</td>
          <td>{item.skippable_open_field}</td>
        </tr>
      ))
    });
  }

  render() {
    return (
      <table>
        {this.renderTableHead()}
        {this.renderTableBody(this.props.showData)}
      </table>
    )
  }
}
