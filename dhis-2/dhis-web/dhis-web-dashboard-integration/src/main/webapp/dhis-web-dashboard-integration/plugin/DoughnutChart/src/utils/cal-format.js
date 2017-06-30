module.exports = {
  formatResponse: function (data, record) {
    data.forEach(function (item) {
      if (item[0] === 'rf040c9a7ab.WB98EsB9YP3') {
        record.Ccolera = parseInt(item[2]);
      }
      if (item[0] === 'rf040c9a7ab.RneTftn6BaL') {
        record.Ocolera = parseInt(item[2]);
      }
      if (item[0] === 'ma97d9c69c5.isMVFKcSYHB') {
        record.Cdisenteria = parseInt(item[2]);
      }
      if (item[0] === 'ma97d9c69c5.JyohhkPpAJ3') {
        record.Odisenteria = parseInt(item[2]);
      }
      if (item[0] === 'h550ca50708.dr5rwniyp02') {
        record.Cpeste = parseInt(item[2]);
      }
      if (item[0] === 'h550ca50708.IQMbVejEoc4') {
        record.Opeste = parseInt(item[2]);
      }
      if (item[0] === 'c85cd6ce5d8.eHpfnkBSHYe') {
        record.CtetanoRecemNascidos = parseInt(item[2]);
      }
      if (item[0] === 'c85cd6ce5d8.wD4twLNblzO') {
        record.OtetanoRecemNascidos = parseInt(item[2]);
      }
      if (item[0] === 'ee4aa11fd69.RVYE86tUi4t') {
        record.CparalisiaFlacidaAguda = parseInt(item[2]);
      }
      if (item[0] === 'ee4aa11fd69.gEd6kM7PNGi') {
        record.OparalisiaFlacidaAguda = parseInt(item[2]);
      }
      if (item[0] === 'ta8c710e735.CHZvOM2J3Gh') {
        record.Craiva = parseInt(item[2]);
      }
      if (item[0] === 'ta8c710e735.Vdb9irqsY9q') {
        record.Oraiva = parseInt(item[2]);
      }
      if (item[0] === 'ef8817e929c.XhKb9PuTl1W' || item[0] === 'ef8817e929c.qgcIy8m39Ej' || item[0] === 'ef8817e929c.EB2IsvY7UT7') {
        record.Cdiarreia += parseInt(item[2]);
      }
      if (item[0] === 'ef8817e929c.u4B2G5rH8QL' || item[0] === 'ef8817e929c.BUVnFg1ULAR' || item[0] === 'ef8817e929c.lMIyuAQhsvu') {
        record.Odiarreia += parseInt(item[2]);
      }
      if (item[0] === 'r56d98c351d.SKJm2QIGyMe' || item[0] === 'r56d98c351d.vqTK9nxEBoP') {
        record.CmalariaClinica += parseInt(item[2]);
      }
      if (item[0] === 'r56d98c351d.Ic7bH2dm50i' || item[0] === 'r56d98c351d.jPK7wWwbUDN') {
        record.OmalariaClinica += parseInt(item[2]);
      }
      if (item[0] === 'fa48b98506d.BxHn5l72IzN' || item[0] === 'fa48b98506d.OvFcMLtADss') {
        record.CmalariaConfirmada += parseInt(item[2]);
      }
      if (item[0] === 'fa48b98506d.wub8IiFTt27' || item[0] === 'fa48b98506d.siTvCKPR1zA') {
        record.OmalariaConfirmada += parseInt(item[2]);
      }
      if (item[0] === 'm9fe3ae729c.uP1zmyrdcvl' || item[0] === 'm9fe3ae729c.chE7bxTv4mU') {
        record.Cmeningite += parseInt(item[2]);
      }
      if (item[0] === 'm9fe3ae729c.ICzL7wiHndn' || item[0] === 'm9fe3ae729c.negHmC2FLPz') {
        record.Omeningite += parseInt(item[2]);
      }
      if (item[0] === 'af47c3c71d0.xWiii2QyZw0' || item[0] === 'af47c3c71d0.M6bWemEv066' || item[0] === 'af47c3c71d0.SIpTkCsZYPx' || item[0] === 'af47c3c71d0.V9onP1Ie6qQ') {
        record.Csarampo += parseInt(item[2]);
      }
      if (item[0] === 'af47c3c71d0.QdylA42lBT8' || item[0] === 'af47c3c71d0.O1S0fU3AJpd' || item[0] === 'af47c3c71d0.p91HsvqwVLX' || item[0] === 'af47c3c71d0.N3YpD2MeSzL') {
        record.Osarampo += parseInt(item[2]);
      }
    });

    return record;
  },

  oriHead: function () {
    return [
      {
        'id': 'rf040c9a7ab.rwjWzwTJMOZ',
        'displayName': '001 CÓLERA C'
      }, {
        'id': 'rf040c9a7ab.HalDx0DxIV1',
        'displayName': '001 CÓLERA O'
      }, {
        'id': 'ma97d9c69c5.N26WuCLnmpO',
        'displayName': '009.2 DISENTERIA C'
      }, {
        'id': 'ma97d9c69c5.nQPbbIpsQPN',
        'displayName': '009.2 DISENTERIA O'
      }, {
        'id': 'h550ca50708.N7M7ekHJcS4',
        'displayName': '020 PESTE C'
      }, {
        'id': 'h550ca50708.oFiMvq3NLmB',
        'displayName': '020 PESTE O'
      }, {
        'id': 'c85cd6ce5d8.Rn8EiVaciq8',
        'displayName': '037 TÉTANO RECÉM NASCIDOS C'
      }, {
        'id': 'c85cd6ce5d8.wLBZGGW5iBn',
        'displayName': '037 TÉTANO RECÉM NASCIDOS O'
      }, {
        'id': 'ee4aa11fd69.PlkcISicicR',
        'displayName': '045 PARALISIA FLÁCIDA AGUDA C'
      }, {
        'id': 'ee4aa11fd69.AeblAEXg4uQ',
        'displayName': '045 PARALISIA FLÁCIDA AGUDA O'
      }, {
        'id': 'ta8c710e735.rlPfJL9tuJL',
        'displayName': '071 RAIVA C'
      }, {
        'id': 'ta8c710e735.xzYFpaHIryp',
        'displayName': '071 RAIVA O'
      }, {
        'id': 'ef8817e929c.yn1rFHjXo1b',
        'displayName': 'DIARREIA 009 0-4 anos, C'
      }, {
        'id': 'ef8817e929c.egl5mBCa50o',
        'displayName': 'DIARREIA 009 0-4 anos, O'
      }, {
        'id': 'ef8817e929c.TGW8iJ4aj0I',
        'displayName': 'DIARREIA 009 5-14 anos, C'
      }, {
        'id': 'ef8817e929c.L6BAmYNOhxv',
        'displayName': 'DIARREIA 009 5-14 anos, O'
      }, {
        'id': 'ef8817e929c.G1BkuegZ3h3',
        'displayName': 'DIARREIA 009 15 anos+, C'
      }, {
        'id': 'ef8817e929c.HM5FGdSgdKf',
        'displayName': 'DIARREIA 009 15 anos+, O'
      }, {
        'id': 'r56d98c351d.O3ml1oWwuvG',
        'displayName': 'MALARIA CLINICA 0-4 anos, C'
      }, {
        'id': 'r56d98c351d.Ffs5FhkOrne',
        'displayName': 'MALARIA CLINICA 0-4 anos, O'
      }, {
        'id': 'r56d98c351d.wRwG9ls4mRE',
        'displayName': 'MALARIA CLINICA 5 anos+, C'
      }, {
        'id': 'r56d98c351d.go8nuT7gwtW',
        'displayName': 'MALARIA CLINICA 5 anos+, O'
      }, {
        'id': 'fa48b98506d.X31ma4FU10q',
        'displayName': 'MALARIA CONFIRMADA 0-4 anos, C'
      }, {
        'id': 'fa48b98506d.kCPj6DRjo22',
        'displayName': 'MALARIA CONFIRMADA 0-4 anos, O'
      }, {
        'id': 'fa48b98506d.unoa6VZ3WRl',
        'displayName': 'MALARIA CONFIRMADA 5 anos+, C'
      }, {
        'id': 'fa48b98506d.BgSLPl218sS',
        'displayName': 'MALARIA CONFIRMADA 5 anos+, O'
      }, {
        'id': 'm9fe3ae729c.Q7mqvVFVZZO',
        'displayName': 'MENINGITE 036 0-4 anos, C'
      }, {
        'id': 'm9fe3ae729c.rgONeyNFnWu',
        'displayName': 'MENINGITE 036 0-4 anos, O'
      }, {
        'id': 'm9fe3ae729c.wVxH167mJHA',
        'displayName': 'MENINGITE 036 5 anos+, C'
      }, {
        'id': 'm9fe3ae729c.uSbRJFsOB4e',
        'displayName': 'MENINGITE 036 5 anos+, O'
      }, {
        'id': 'af47c3c71d0.FdXEuTmSeUU',
        'displayName': 'SARAMPO 055 Menos de 9 meses, C'
      }, {
        'id': 'af47c3c71d0.wMJ68PYqqNX',
        'displayName': 'SARAMPO 055 Menos de 9 meses, O'
      }, {
        'id': 'af47c3c71d0.ka7lNsfwPfG',
        'displayName': 'SARAMPO 055 9-23 meses(Não Vacinados), C'
      }, {
        'id': 'af47c3c71d0.v7N3IsKXph2',
        'displayName': 'SARAMPO 055 9-23 meses(Não Vacinados), O'
      }, {
        'id': 'af47c3c71d0.tH0xOkCdf3p',
        'displayName': 'SARAMPO 055 9-23 meses(Vacinados), C'
      }, {
        'id': 'af47c3c71d0.JTDDqPkrNfq',
        'displayName': 'SARAMPO 055 9-23 meses(Vacinados), O'
      }, {
        'id': 'af47c3c71d0.CshPMpNPOEI',
        'displayName': 'SARAMPO 055 24 meses e mais, C'
      }, {
        'id': 'af47c3c71d0.YJyq8ffVWiK',
        'displayName': 'SARAMPO 055 24 meses e mais, O'
      }];
  }
};


