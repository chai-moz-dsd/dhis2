function changeRuleType() {
  var ruleType = $('#ruleType').val();

  if( ruleType == 'VALIDATION' ) {
    hideById('organisationUnitLevelTR');
    hideById('sequentialSampleCountTR');
    hideById('annualSampleCountTR');
    hideById('sequentialSkipCountTR');

    showById('compulsory_pair');
    showById('exclusive_pair');
  }
  else {
    showById('organisationUnitLevelTR');
    showById('sequentialSampleCountTR');
    showById('annualSampleCountTR');
    showById('sequentialSkipCountTR');

    var op = document.getElementById('operator');
    if( 'compulsory_pair' == op.value || 'exclusive_pair' == op.value ) {
      showById('select_operator');
      op.selectedIndex = 0;
    }
    hideById('compulsory_pair');
    hideById('exclusive_pair');
  }
}

function getPtRuleNameByRuleType(ruleType) {
  var ruleName = '';
  switch (ruleType) {
    case 'SarampoCaseInMonths':
      ruleName = 'SARAMPO';
      break;
    case 'MeningiteIncreasedInWeeks':
      ruleName = 'MENINGITE';
      break;
    case 'DisenteriaCaseInYears':
      ruleName = 'DISENTERIA';
      break;
    case 'MalariaCaseInYears':
      ruleName = 'MALARIA';
      break;
    default:
      break;
  }

  return ruleName;
}

function isContains(str, subStr) {
  return str.indexOf(subStr) >= 0;
}

function setDefaultLeftExpression(ruleType) {
  $('#leftSideDescription').val('null');
  $('#leftSideTextualExpression').text('null');
  $('#leftSideMissingValueStrategy').val('SKIP_IF_ANY_VALUE_MISSING');

  var ruleName = getPtRuleNameByRuleType(ruleType);
  var formularExpression = [];

  $.ajax({
    type: 'GET',
    url: '../dhis-web-commons-ajax-json/getOperands.action',
    data: {},
    dataType: 'json',
    success: function(data) {
      jQuery.each(data.operands, function(index, item){
        if (isContains(item.operandName, ruleName) && isContains(item.operandName, ' C'))
        {
          formularExpression.push('#{' + item.operandId + '}');
        }
      });

      $('#leftSideExpression').val(formularExpression.join('+'));
    }
  });



}

function setDefaultRightExpression() {

  $('#rightSideDescription').val('null');
  $('#rightSideExpression').val(0);
  $('#rightSideTextualExpression').text('null');
  $('#rightSideMissingValueStrategy').val('SKIP_IF_ANY_VALUE_MISSING');

}

function setDefaultRuleContent(ruleType) {

  ruleText = $('#additionalRuleText');
  switch (ruleType) {
    case 'SarampoCaseInMonths':
      ruleText.text('A:\r\nB:');
      break;
    case 'MeningiteIncreasedInWeeks':
      ruleText.text('A:\r\nB:');
      break;
    case 'DisenteriaCaseInYears':
      ruleText.text('A:\r\nB:');
      break;
    case 'MalariaCaseInYears':
      ruleText.text('A:\r\nB:\r\nC:\r\nD:');
      break;
    default:
      break;
  }
}

function changeAdditionalRuleHelpContent(ruleType) {
  $('#additionalRuleHelp').attr('href', 'javascript:getHelpContent("' + ruleType + '")');
}

function changeAdditionalRuleType() {
  var additionalRuleType = $('#additionalRuleType').val();

  if ( additionalRuleType == 'Default' )
  {
    hideById('additionalRule');
    showById('operatorHide');
    showById('leftRightHide');
  }
  else {
    showById('additionalRule');
    hideById('operatorHide');
    hideById('leftRightHide');

    setDefaultRuleContent(additionalRuleType);
    changeAdditionalRuleHelpContent(additionalRuleType);

    $('#operator').val('less_than_or_equal_to');
    setDefaultLeftExpression(additionalRuleType);
    setDefaultRightExpression();
  }
}

