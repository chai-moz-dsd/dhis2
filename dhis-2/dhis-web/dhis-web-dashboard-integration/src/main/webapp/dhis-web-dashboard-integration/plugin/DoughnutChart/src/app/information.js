import React, {Component} from 'react';
import css from './information.scss';

export default class Information extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let record = this.props.data;

    return (
      <div className={css.information}>
        <table>
          <thead>
          <tr>
              <th className={css.describeWord}>Disease</th>
              <th className={css.describeWord}>Casos</th>
              <th className={css.describeWord}>Obitos</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td className={css.describeWord}>
              CÓLERA
            </td>
            <td className={css.number}>
              {record.Ccolera}
            </td>
            <td className={css.number}>
              {record.Ocolera}
            </td>
          </tr>

          <tr>
            <td className={css.describeWord}>
              DISENTERIA
            </td>
            <td className={css.number}>
              {record.Cdisenteria}
            </td>
            <td className={css.number}>
              {record.Odisenteria}
            </td>
          </tr>

          <tr>
            <td className={css.describeWord}>
              PESTE
            </td>
            <td className={css.number}>
              {record.Cpeste}
            </td>
            <td className={css.number}>
              {record.Opeste}
            </td>
          </tr>

          <tr>
            <td className={css.describeWord}>
              TÉTANO RECÉM NASCIDOS
            </td>
            <td className={css.number}>
              {record.CtetanoRecemNascidos}
            </td>
            <td className={css.number}>
              {record.OtetanoRecemNascidos}
            </td>
          </tr>

          <tr>
            <td className={css.describeWord}>
              PARALISIA FLÁCIDA AGUDA
            </td>
            <td className={css.number}>
              {record.CparalisiaFlacidaAguda}
            </td>
            <td className={css.number}>
              {record.OparalisiaFlacidaAguda}
            </td>
          </tr>

          <tr>
            <td className={css.describeWord}>
              RAIVA
            </td>
            <td className={css.number}>
              {record.Craiva}
            </td>
            <td className={css.number}>
              {record.Oraiva}
            </td>
          </tr>

          <tr>
            <td className={css.describeWord}>
              DIARREIA
            </td>
            <td className={css.number}>
              {record.Cdiarreia}
            </td>
            <td className={css.number}>
              {record.Odiarreia}
            </td>
          </tr>

          <tr>
            <td className={css.describeWord}>
              MALARIA CLINICA
            </td>
            <td className={css.number}>
              {record.CmalariaClinica}
            </td>
            <td className={css.number}>
              {record.OmalariaClinica}
            </td>
          </tr>

          <tr>
            <td className={css.describeWord}>
              MALARIA CONFIRMADA
            </td>
            <td className={css.number}>
              {record.CmalariaConfirmada}
            </td>
            <td className={css.number}>
              {record.OmalariaConfirmada}
            </td>
          </tr>

          <tr>
            <td className={css.describeWord}>
              MENINGITE
            </td>
            <td className={css.number}>
              {record.Cmeningite}
            </td>
            <td className={css.number}>
              {record.Omeningite}
            </td>
          </tr>

          <tr>
            <td className={css.describeWord}>
              SARAMPO
            </td>
            <td className={css.number}>
              {record.Csarampo}
            </td>
            <td className={css.number}>
              {record.Osarampo}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
