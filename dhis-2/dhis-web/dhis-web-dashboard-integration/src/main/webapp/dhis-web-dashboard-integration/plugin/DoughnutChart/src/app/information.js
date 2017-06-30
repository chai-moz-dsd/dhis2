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
          <tbody>
          <tr>
            <td>
              <i className="material-icons">add_alert</i>
              <div className={css.describeWord}>Casos</div>
            </td>
            <td>
              <i className="material-icons">warning</i>
              <div className={css.describeWord}>Obitos</div>
            </td>
          </tr>
          <tr>
            <td>
              <div className={css.number}> {record.Ccolera} </div>
              <div className={css.describeWord}>CÓLERA</div>
            </td>
            <td>
              <div className={css.number}> {record.Ocolera} </div>
              <div className={css.describeWord}>CÓLERA</div>
            </td>
          </tr>

          <tr>
            <td>
              <div className={css.bumber}> {record.Cdisenteria} </div>
              <div className={css.describeWord}>DISENTERIA</div>
            </td>
            <td>
              <div className={css.bumber}> {record.Odisenteria} </div>
              <div className={css.describeWord}>DISENTERIA</div>
            </td>
          </tr>

          <tr>
            <td>
              <div className={css.number}> {record.Cpeste} </div>
              <div className={css.describeWord}>PESTE</div>
            </td>
            <td>
              <div className={css.number}> {record.Opeste} </div>
              <div className={css.describeWord}>PESTE</div>
            </td>
          </tr>

          <tr>
            <td>
              <div className={css.number}> {record.CtetanoRecemNascidos} </div>
              <div className={css.describeWord}>TÉTANO RECÉM NASCIDOS</div>
            </td>
            <td>
              <div className={css.number}> {record.OtetanoRecemNascidos} </div>
              <div className={css.describeWord}>TÉTANO RECÉM NASCIDOS</div>
            </td>
          </tr>

          <tr>
            <td>
              <div className={css.number}> {record.CparalisiaFlacidaAguda} </div>
              <div className={css.describeWord}>PARALISIA FLÁCIDA AGUDA</div>
            </td>
            <td>
              <div className={css.number}> {record.OparalisiaFlacidaAguda} </div>
              <div className={css.describeWord}>PARALISIA FLÁCIDA AGUDA</div>
            </td>
          </tr>

          <tr>
            <td>
              <div className={css.number}> {record.Craiva} </div>
              <div className={css.describeWord}>RAIVA</div>
            </td>
            <td>
              <div className={css.number}> {record.Oraiva} </div>
              <div className={css.describeWord}>RAIVA</div>
            </td>
          </tr>

          <tr>
            <td>
              <div className={css.number}> {record.Cdiarreia} </div>
              <div className={css.describeWord}>DIARREIA</div>
            </td>
            <td>
              <div className={css.number}> {record.Odiarreia} </div>
              <div className={css.describeWord}>DIARREIA</div>
            </td>
          </tr>

          <tr>
            <td>
              <div className={css.number}> {record.CmalariaClinica} </div>
              <div className={css.describeWord}>MALARIA CLINICA</div>
            </td>
            <td>
              <div className={css.number}> {record.OmalariaClinica} </div>
              <div className={css.describeWord}>MALARIA CLINICA</div>
            </td>
          </tr>

          <tr>
            <td>
              <div className={css.number}> {record.CmalariaConfirmada} </div>
              <div className={css.describeWord}>MALARIA CONFIRMADA</div>
            </td>
            <td>
              <div className={css.number}> {record.OmalariaConfirmada} </div>
              <div className={css.describeWord}>MALARIA CONFIRMADA</div>
            </td>
          </tr>

          <tr>
            <td>
              <div className={css.number}> {record.Cmeningite} </div>
              <div className={css.describeWord}>MENINGITE</div>
            </td>
            <td>
              <div className={css.number}> {record.Omeningite} </div>
              <div className={css.describeWord}>MENINGITE</div>
            </td>
          </tr>

          <tr>
            <td>
              <div className={css.number}> {record.Csarampo} </div>
              <div className={css.describeWord}>SARAMPO</div>
            </td>
            <td>
              <div className={css.number}> {record.Osarampo} </div>
              <div className={css.describeWord}>SARAMPO</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
