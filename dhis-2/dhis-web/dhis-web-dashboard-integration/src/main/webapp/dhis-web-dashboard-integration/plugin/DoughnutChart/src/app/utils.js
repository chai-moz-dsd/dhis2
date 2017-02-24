function getBaseUrl(port=window.location.port) {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  return `${protocol}//${hostname}:${port}/`;
}

export function getToday(offset=0) {
  let today = new Date();

  today.setDate(today.getDate() + offset);
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let day = today.getDate();

  return `${year}-${month}-${day}`;
}

export function getRelatedOuList() {
  return `${getBaseUrl()}api/me?fields=organisationUnits`;
}

export function getDonutChartData(year, week, ou) {
  return `${getBaseUrl(50000)}api/data_completeness?week=${year}W${week}&ou=${ou}`;
}

export function getIndicatorUrl() {
  return `${getBaseUrl()}reporting-page/index.html#/ops`;
}
