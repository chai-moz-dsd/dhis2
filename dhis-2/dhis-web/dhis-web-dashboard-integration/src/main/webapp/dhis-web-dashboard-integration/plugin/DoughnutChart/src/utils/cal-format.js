module.exports = {
  formatResponse: function (data, record, oriHead) {
    let organization = this.formatConversion(oriHead);
    let Cdiarreia = 0,
      Odiarreia = 0,
      CmalariaClinica = 0,
      OmalariaClinica = 0,
      CmalariaConfirmada = 0,
      OmalariaConfirmada = 0,
      Cmeningite = 0,
      Omeningite = 0,
      Csarampo = 0,
      Osarampo = 0;

    data.forEach(function (item) {
      if (item[0] === organization['001 CÓLERA C']) {
        record.Ccolera = parseInt(item[2]);
      }
      if (item[0] === organization['001 CÓLERA O']) {
        record.Ocolera = parseInt(item[2]);
      }
      if (item[0] === organization['009.2 DISENTERIA C']) {
        record.Cdisenteria = parseInt(item[2]);
      }
      if (item[0] === organization['009.2 DISENTERIA O']) {
        record.Odisenteria = parseInt(item[2]);
      }
      if (item[0] === organization['020 PESTE C']) {
        record.Cpeste = parseInt(item[2]);
      }
      if (item[0] === organization['020 PESTE O']) {
        record.Opeste = parseInt(item[2]);
      }
      if (item[0] === organization['037 TÉTANO RECÉM NASCIDOS C']) {
        record.CtetanoRecemNascidos = parseInt(item[2]);
      }
      if (item[0] === organization['037 TÉTANO RECÉM NASCIDOS O']) {
        record.OtetanoRecemNascidos = parseInt(item[2]);
      }
      if (item[0] === organization['045 PARALISIA FLÁCIDA AGUDA C']) {
        record.CparalisiaFlacidaAguda = parseInt(item[2]);
      }
      if (item[0] === organization['045 PARALISIA FLÁCIDA AGUDA O']) {
        record.OparalisiaFlacidaAguda = parseInt(item[2]);
      }
      if (item[0] === organization['071 RAIVA C']) {
        record.Craiva = parseInt(item[2]);
      }
      if (item[0] === organization['071 RAIVA O']) {
        record.Oraiva = parseInt(item[2]);
      }
      if (item[0] === organization['DIARREIA 009 0-4 anos, C'] || item[0] === organization['DIARREIA 009 5-14 anos, C'] || item[0] === organization['DIARREIA 009 15 anos+, C']) {
        Cdiarreia += parseInt(item[2]);
      }
      if (item[0] === organization['DIARREIA 009 0-4 anos, O'] || item[0] === organization['DIARREIA 009 5-14 anos, O'] || item[0] === organization['DIARREIA 009 15 anos+, O']) {
        Odiarreia += parseInt(item[2]);
      }
      if (item[0] === organization['MALARIA CLINICA 0-4 anos, C'] || item[0] === organization['MALARIA CLINICA 5 anos+, C']) {
        CmalariaClinica += parseInt(item[2]);
      }
      if (item[0] === organization['MALARIA CLINICA 0-4 anos, O'] || item[0] === organization['MALARIA CLINICA 5 anos+, O']) {
        OmalariaClinica += parseInt(item[2]);
      }
      if (item[0] === organization['MALARIA CONFIRMADA 0-4 anos, C'] || item[0] === organization['MALARIA CONFIRMADA 5 anos+, C']) {
        CmalariaConfirmada += parseInt(item[2]);
      }
      if (item[0] === organization['MALARIA CONFIRMADA 0-4 anos, O'] || item[0] === organization['MALARIA CONFIRMADA 5 anos+, O']) {
        OmalariaConfirmada += parseInt(item[2]);
      }
      if (item[0] === organization['MENINGITE 036 0-4 anos, C'] || item[0] === organization['MENINGITE 036 5 anos+, C']) {
        Cmeningite += parseInt(item[2]);
      }
      if (item[0] === organization['MENINGITE 036 0-4 anos, O'] || item[0] === organization['MENINGITE 036 5 anos+, O']) {
        Omeningite += parseInt(item[2]);
      }
      if (item[0] === organization['SARAMPO 055 9-23 meses(Não Vacinados), C'] || item[0] === organization['SARAMPO 055 9-23 meses(Vacinados), C'] || item[0] === organization['SARAMPO 055 24 meses e mais, C'] || item[0] === organization['SARAMPO 055 Menos de 9 meses, C']) {
        Csarampo += parseInt(item[2]);
      }
      if (item[0] === organization['SARAMPO 055 9-23 meses(Não Vacinados), O'] || item[0] === organization['SARAMPO 055 9-23 meses(Vacinados), O'] || item[0] === organization['SARAMPO 055 24 meses e mais, O'] || item[0] === organization['SARAMPO 055 Menos de 9 meses, O']) {
        Osarampo += parseInt(item[2]);
      }
    });

    record.Cdiarreia = Cdiarreia;
    record.Odiarreia = Odiarreia;
    record.CmalariaClinica = CmalariaClinica;
    record.OmalariaClinica = OmalariaClinica;
    record.CmalariaConfirmada = CmalariaConfirmada;
    record.OmalariaConfirmada = OmalariaConfirmada;
    record.Cmeningite = Cmeningite;
    record.Omeningite = Omeningite;
    record.Csarampo = Csarampo;
    record.Osarampo = Osarampo;

    return record;
  },

  formatConversion: function (arrayOriHead) {
    let objectOriHead = {};

    arrayOriHead.forEach(function (organization) {
      objectOriHead[organization.displayName] = organization.id;
    });

    return objectOriHead;
  }
};


