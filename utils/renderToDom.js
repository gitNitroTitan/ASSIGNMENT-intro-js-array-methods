export const renderToDom = (divId, html) => {  //utility function
  const selectedDiv = document.querySelector(divId);
  selectedDiv.innerHTML = html;
}
