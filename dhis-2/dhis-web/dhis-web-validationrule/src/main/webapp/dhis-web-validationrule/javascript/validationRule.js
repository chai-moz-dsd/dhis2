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

function setDefaultLeftExpression() {
  $('#leftSideDescription').val('null');
  $('#leftSideExpression').val(0);
  $('#leftSideTextualExpression').text('null');
  $('#leftSideMissingValueStrategy').val('SKIP_IF_ANY_VALUE_MISSING');
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
    case 'DiarrieaCaseInYears':
      ruleText.text('A:\r\nB:');
      break;
    case 'MalariaCaseInYears':
      ruleText.text('A:\r\nB:\r\nC:\r\nD:');
      break;
    default:
      break;
  }
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

    $('#operator').val('equal_to');
    setDefaultLeftExpression();
    setDefaultRightExpression();
  }
}