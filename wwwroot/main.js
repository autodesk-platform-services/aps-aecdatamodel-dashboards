import { getHubs, getProjects, getProjectElementsProperty, getProjectElementsPropertyPaginated, getProjectElementsProperties, getProjectElementsPropertiesPaginated, getProjectDesigns, getDesignElementsProperty, getDesignElementsPropertyPaginated } from './graphql.js';

const autocolors = window['chartjs-plugin-autocolors'];

window.GLOBAL_CHARTS_COUNT = 0;

window.addEventListener("load", async () => {
  const login = document.getElementById('login');
  const hubsDropDown = document.getElementById('hubsdropdown');
  let hubsResponse = await getHubs();
  if (!!hubsResponse.data) {
    hubsDropDown
    for (const hub of Object.values(hubsResponse.data.hubs.results)) {
      let hubOption = document.createElement("option");
      hubOption.text = hub.name;
      hubOption.value = hub.id;
      hubsDropDown.appendChild(hubOption);
    }
  }

  const projectsDropDown = document.getElementById('projectsdropdown');
  hubsDropDown.onchange = async () => {
    projectsDropDown.innerHTML = '<option value="" disabled selected>Select your project</option>';
    let projectsResponse = await getProjects(hubsDropDown.value);
    for (const project of Object.values(projectsResponse.data.projects.results)) {
      let projectOption = document.createElement("option");
      projectOption.text = project.name;
      projectOption.value = project.id;
      projectsDropDown.appendChild(projectOption);
    }
  };

  projectsDropDown.onchange = async () => {
    if (window.GLOBAL_CHARTS_COUNT == 0) {
      loadDefaultContent(document.getElementById('projectsdropdown').value);
    }
  };

  prepareSwapFlexbox();

  const addChartButton = document.getElementById('addchart');
  addChartButton.onclick = async () => {
    //Swal to specifi parameter to obtain and filter to generate the chart
    const { value: formValues } = await Swal.fire({
      title: 'Add property-based chart',
      html:
        '<span>Chart Type</span><select id="charttype" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;"><option value="pie">pie</option><option value="bar">bar</option><option value="doughnut">doughnut</option></select>' +
        '<span>Property</span><input type="text" id="property" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" value="Family Name" placeholder="Type a property name here!" list="querypropertiesList" novalidate>' +
        `<span>Filter</span><input type="text" id="filter" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" value="property.name.category=='Doors'" placeholder="Type your filter here!" list="queryfiltersList" novalidate>`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('property').value,
          document.getElementById('filter').value,
          document.getElementById('charttype').value
        ]
      }
    });

    disableAddButtons();
    let loadingDiv = createLoadingDiv();
    let successfull = true;
    try {
      successfull = await handleChartCreation(document.getElementById('projectsdropdown').value, formValues[1], formValues[0], loadingDiv, formValues[2]);
    }
    catch (e) {
      console.log(e);
    }
    loadingDiv.remove();
    if (!successfull)
      showToast('Error! Please check console!');
    enableAddButtons();
    console.log(`Property ${formValues[0]} selected!`);
    console.log(`filter ${formValues[1]} applied!`);
  };

  const addTableButton = document.getElementById('addtable');
  addTableButton.onclick = async () => {
    //Swal to specifi parameter to obtain and filter to generate the table
    const { value: formValues } = await Swal.fire({
      title: 'Add property-based table',
      html:
        '<span>Properties</span><input type="email" id="properties" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" value="Family Name,Element Name" placeholder="Type comma-separated properties names here!" list="querypropertiesList" multiple novalidate>' +
        '<span>Filter</span><input type="text" id="filter" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" placeholder="Type your filter here!" list="queryfiltersList">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('properties').value,
          document.getElementById('filter').value
        ]
      }
    });

    disableAddButtons();
    let loadingDiv = createLoadingDiv();
    let successfull = true;
    try {
      successfull = await handleTableCreation(document.getElementById('projectsdropdown').value, formValues[1], formValues[0]);
    }
    catch (e) {
      console.log(e);
    }
    loadingDiv.remove();
    if (!successfull)
      showToast('Error! Please check console!');
    enableAddButtons();
    if (!successfull)
      showToast('Error! Please check console!');
    console.log(`Property ${formValues[0]} selected!`);
    console.log(`filter ${formValues[1]} applied!`);
  };

  const addComparisionChart = document.getElementById('comparedesigns');
  addComparisionChart.onclick = async () => {
    let designsJSON = await getProjectDesigns(document.getElementById('projectsdropdown').value);
    updateDesignsList(designsJSON);
    const { value: formValues } = await Swal.fire({
      title: 'Add property-based comparision',
      html:
        '<span>Chart Type</span><select id="charttype" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;"><option value="radar">radar</option><option value="line">line</option></select>' +
        '<span>First Design</span><input type="text" id="designone" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" placeholder="First design name here!" list="designsList">' +
        '<span>Second Design</span><input type="text" id="designtwo" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" placeholder="Second design name here!" list="designsList">' +
        '<span>Property</span><input type="text" id="property" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" value="Family Name" placeholder="Type a property name here!" list="querypropertiesList" novalidate>' +
        '<span>Filter</span><input type="text" id="filter" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" placeholder="Type your filter here!" list="queryfiltersList">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('property').value,
          document.getElementById('filter').value,
          document.getElementById('designone').value,
          document.getElementById('designtwo').value,
          document.getElementById('charttype').value
        ]
      }
    });
    disableAddButtons();
    let loadingDiv = createLoadingDiv();
    let successfull = true;
    try {
      //Design One
      let respJSON = await getDesignElementsProperty(formValues[2], formValues[1], formValues[0])
      let cursor = respJSON.data.elements.pagination.cursor;
      let chartDataOne = {};
      for (const result of respJSON.data.elements.results) {
        if (!chartDataOne[result.properties.results[0].value])
          chartDataOne[result.properties.results[0].value] = 0
        chartDataOne[result.properties.results[0].value]++
      }
      while (!!cursor) {
        let newRespJSON = await getDesignElementsPropertyPaginated(formValues[2], formValues[1], formValues[0], cursor)
        cursor = newRespJSON.data.elements.pagination.cursor;
        for (const result of newRespJSON.data.elements.results) {
          if (!chartDataOne[result.properties.results[0].value])
            chartDataOne[result.properties.results[0].value] = 0
          chartDataOne[result.properties.results[0].value]++
        }
      }

      //Design Two
      respJSON = await getDesignElementsProperty(formValues[3], formValues[1], formValues[0])
      cursor = respJSON.data.elements.pagination.cursor;
      let chartDataTwo = {};
      for (const result of respJSON.data.elements.results) {
        if (!chartDataTwo[result.properties.results[0].value])
          chartDataTwo[result.properties.results[0].value] = 0
        chartDataTwo[result.properties.results[0].value]++
      }
      while (!!cursor) {
        let newRespJSON = await getDesignElementsPropertyPaginated(formValues[3], formValues[1], formValues[0], cursor)
        cursor = newRespJSON.data.elements.pagination.cursor;
        for (const result of newRespJSON.data.elements.results) {
          if (!chartDataTwo[result.properties.results[0].value])
            chartDataTwo[result.properties.results[0].value] = 0
          chartDataTwo[result.properties.results[0].value]++
        }
      }

      let chartData = aggregateDesignsData(chartDataOne, chartDataTwo);

      if (Object.keys(chartData).length > 0) {
        loadingDiv.remove();
        createComparisionChart(formValues[2], formValues[3], chartData, formValues[4]);
      }
      else {
        console.log(`${chartData.length} elements found in designs!`);
        successfull = false;
      }

    }
    catch (e) {
      successfull = false;
      console.log(e);
    }
    loadingDiv.remove();
    if (!successfull)
      showToast('Error! Please check console!');
    enableAddButtons();
    if (!successfull)
      showToast('Error! Please check console!');
    console.log(`Property ${formValues[0]} selected!`);
    console.log(`filter ${formValues[1]} applied!`);

  };

  try {
    const resp = await fetch('/api/auth/profile');
    if (resp.ok) {
      const user = await resp.json();
      login.innerText = `Logout (${user.name})`;
      login.onclick = () => window.location.replace('/api/auth/logout');
    } else {
      login.innerText = 'Login';
      login.onclick = () => window.location.replace('/api/auth/login');
    }
    login.style.visibility = 'visible';
  } catch (err) {
    alert('Could not initialize the application. See console for more details.');
    console.error(err);
  }
});

async function handleChartCreation(projectId, filter, property, loadingDiv, chartType, chartTitle) {
  let successfull = true;
  try {
    let respJSON = await getProjectElementsProperty(projectId, filter, property);
    let cursor = respJSON.data.elementsByProject.pagination.cursor;
    let chartData = {};
    for (const result of respJSON.data.elementsByProject.results) {
      if (!chartData[result.properties.results[0].value])
        chartData[result.properties.results[0].value] = 0
      chartData[result.properties.results[0].value]++
    }
    while (!!cursor) {
      let newRespJSON = await getProjectElementsPropertyPaginated(projectId, filter, property, cursor);
      cursor = newRespJSON.data.elementsByProject.pagination.cursor;
      for (const result of newRespJSON.data.elementsByProject.results) {
        if (!chartData[result.properties.results[0].value])
          chartData[result.properties.results[0].value] = 0
        chartData[result.properties.results[0].value]++
      }
    }
    if (Object.keys(chartData).length > 0) {
      loadingDiv.remove();
      let chartName = chartTitle ? chartTitle : property;
      let newChartDiv = await createChart(chartName, chartData, chartType);
      if (chartTitle) {
        newChartDiv.style.width = "40%";
        newChartDiv.style.height = "400px";
      }
    }
    else {
      console.log(`${chartData.length} elements found!`);
      successfull = false;
    }
  }
  catch (e) {
    successfull = false;
    console.log(e);
  }
  return successfull;
}

async function handleTableCreation(projectId, filter, propertiesNames, loadingDiv, tableTitle) {
  let successfull = true;
  try {
    let respJSON = await getProjectElementsProperties(projectId, filter, propertiesNames)
    let cursor = respJSON.data.elementsByProject.pagination.cursor;
    let tableData = [];
    for (const result of respJSON.data.elementsByProject.results) {
      let newObj = {};
      for (const property of propertiesNames.split(',')) {
        let newProp = result.properties.results.find(p => p.name == property);
        newObj[property] = newProp ? newProp.value : "";
      }
      tableData.push(newObj)
    }
    while (!!cursor) {
      let newRespJSON = await getProjectElementsPropertiesPaginated(projectId, filter, propertiesNames, cursor)
      cursor = newRespJSON.data.elementsByProject.pagination.cursor;
      for (const result of newRespJSON.data.elementsByProject.results) {
        let newObj = {};
        for (const property of propertiesNames.split(',')) {
          let newProp = result.properties.results.find(p => p.name == property);
          newObj[property] = newProp ? newProp.value : "";
        }
        tableData.push(newObj)
      }
    }
    if (tableData.length > 0) {
      loadingDiv.remove();
      let tableLabel = tableTitle ? tableTitle : propertiesNames;
      let newTableDiv = await createTable(tableLabel, tableData);
      if (tableTitle) {
        newTableDiv.style.width = "40%";
        newTableDiv.style.height = "400px";
      }
    }
    else {
      console.log(`${tableData.length} elements found!`);
      successfull = false;
    }

  }
  catch (e) {
    successfull = false;
    console.log(e);
  }
  return successfull;
}

async function loadDefaultContent(projectId) {
  await addDefaultTable(projectId, "property.name.category=cs='Rooms'", 'Name,Occupancy,Number,Perimeter,Area,Element Name,Volume', 'RoomsTakeoffTable');
  await addDefaultChart(projectId, "property.name.category=cs='Rooms'", 'Element Name', 'bar', 'RoomsTakeoffChart');
  await addDefaultTable(projectId, "property.name.category=cs='Doors'", 'Height,Width,Element Name', 'DoorsTakeoffTable');
  await addDefaultChart(projectId, "property.name.category=cs='Doors'", 'Element Name', 'bar', 'DoorsTakeoffChart');
}

async function addDefaultChart(projectId, filter, property, chartType, chartName) {
  disableAddButtons();
  let loadingDiv = createLoadingDiv();
  let successfull = await handleChartCreation(projectId, filter, property, loadingDiv, chartType, chartName);
  try {
    loadingDiv.remove();
  }
  catch (e) {

  }
  if (!successfull)
    showToast('Error! Please check console!');
  enableAddButtons();
  if (!successfull)
    showToast('Error! Please check console!');
}

async function addDefaultTable(projectId, filter, properties, tableName) {
  disableAddButtons();
  let loadingDiv = createLoadingDiv();
  let successfull = await handleTableCreation(projectId, filter, properties, loadingDiv, tableName);
  try {
    loadingDiv.remove();
  }
  catch (e) {

  }
  if (!successfull)
    showToast('Error! Please check console!');
  enableAddButtons();
  if (!successfull)
    showToast('Error! Please check console!');
}

function createLoadingDiv() {
  const dashboardsContainer = document.getElementById('aeccim-dashboards');
  let chartDiv = document.createElement("div");
  chartDiv.className = "chartDiv draggable";

  let closebutton = document.createElement('div');
  closebutton.id = 'close';
  closebutton.onclick = function () {
    this.parentNode.remove();
    return false;
  };
  closebutton.innerHTML = 'X';
  closebutton.className = 'chartheader';
  chartDiv.appendChild(closebutton);

  let movebutton = document.createElement('div');
  movebutton.id = 'move';
  movebutton.className = 'draggable-handle chartheader';
  movebutton.innerHTML = 'M';
  chartDiv.appendChild(movebutton);

  let charttitle = document.createElement('div');
  charttitle.id = 'title';
  charttitle.className = 'chartheader';
  charttitle.onclick = (event) => {
    changeDivTitle(event);
  };
  chartDiv.appendChild(charttitle);
  let chartCanvas = document.createElement("div");
  chartCanvas.className = "chartcanvas";
  chartCanvas.id = `loadingDiv${window.GLOBAL_CHARTS_COUNT}`;
  chartDiv.appendChild(chartCanvas);
  dashboardsContainer.appendChild(chartDiv);
  addLoadingDiv(`loadingDiv${window.GLOBAL_CHARTS_COUNT}`);
  return chartDiv;
}

function addLoadingDiv(targetDivId) {
  let waitScreen = Swal.fire({
    title: 'Please Wait !',
    html: 'loading data',// add html attribute if you want or remove
    allowOutsideClick: false,
    showCancelButton: false,
    showConfirmButton: false,
    target: '#' + targetDivId,
    customClass: {                      // <------ customClass is an object!
      container: 'position-absolute'
    }
  });
  return waitScreen;
}

function aggregateDesignsData(chartDataOne, chartDataTwo) {
  let chartData = {};
  let dataOneExclusiveKeys = Object.keys(chartDataOne).filter(key => !Object.keys(chartDataTwo).includes(key));
  let dataTwoExclusiveKeys = Object.keys(chartDataTwo).filter(key => !Object.keys(chartDataOne).includes(key));
  let commonKeys = Object.keys(chartDataTwo).filter(key => Object.keys(chartDataOne).includes(key));
  for (const dataKey of dataOneExclusiveKeys) {
    chartData[dataKey] = [];
    chartData[dataKey][0] = chartDataOne[dataKey];
    chartData[dataKey][1] = 0;
  }
  for (const dataKey of dataTwoExclusiveKeys) {
    chartData[dataKey] = [];
    chartData[dataKey][0] = 0;
    chartData[dataKey][1] = chartDataTwo[dataKey];
  }
  for (const dataKey of commonKeys) {
    chartData[dataKey] = [];
    chartData[dataKey][0] = chartDataOne[dataKey];
    chartData[dataKey][1] = chartDataTwo[dataKey];
  }
  return chartData;
}

function updateDesignsList(designsJSON) {
  let designsDataList = document.getElementById('designsList');
  designsDataList.innerHTML = '';
  for (const designJSON of designsJSON.data.aecDesignsByProject.results) {
    let newDesignOption = document.createElement('option');
    newDesignOption.value = designJSON.id;
    newDesignOption.innerHTML = designJSON.name;
    designsDataList.appendChild(newDesignOption);
  }
}

async function createTable(tableLabel, tableData) {
  const dashboardsContainer = document.getElementById('aeccim-dashboards');
  let tableDiv = document.createElement("div");
  tableDiv.className = "chartDiv draggable";

  let tableHeader = document.createElement('div');
  tableHeader.className = 'tableHeader';
  tableDiv.appendChild(tableHeader);

  let closebutton = document.createElement('div');
  closebutton.id = 'close';
  closebutton.onclick = function () {
    this.parentNode.parentNode.remove();
    window.GLOBAL_CHARTS_COUNT--;
    return false;
  };
  closebutton.innerHTML = 'X';
  closebutton.className = 'chartheader';
  tableHeader.appendChild(closebutton);

  let movebutton = document.createElement('div');
  movebutton.id = 'move';
  movebutton.className = 'draggable-handle chartheader';
  movebutton.innerHTML = 'M';
  tableHeader.appendChild(movebutton);

  let tabletitle = document.createElement('div');
  tabletitle.id = 'title';
  tabletitle.innerHTML = tableLabel;
  tabletitle.className = 'chartheader';
  tabletitle.onclick = (event) => {
    changeDivTitle(event);
  };
  tableHeader.appendChild(tabletitle);

  //Create div for the table
  let tableInnerDiv = document.createElement("div");
  tableInnerDiv.className = "tablediv";
  let tableId = 'table' + window.GLOBAL_CHARTS_COUNT;
  tableInnerDiv.id = tableId;
  tableDiv.appendChild(tableInnerDiv);
  dashboardsContainer.appendChild(tableDiv);
  var table = new Tabulator(`#${tableId}`, {
    data: tableData, //assign data to table
    layout: 'fitColumns',
    autoColumns: true, //create columns from data field names
  });
  table.on("headerDblClick", function (e, column) {
    var groups = table.getGroups();
    if (groups.length > 0 && groups[0].getField() == column._column.field) {
      groups = [];
    }
    else {
      groups = [column._column.field];
    }
    table.setGroupBy(groups);
  });
  window.GLOBAL_CHARTS_COUNT++;
  return tableDiv;
}

async function createChart(chartLabel, chartData, chartType) {

  const dashboardsContainer = document.getElementById('aeccim-dashboards');
  let chartDiv = document.createElement("div");
  chartDiv.className = "chartDiv draggable";

  let closebutton = document.createElement('div');
  closebutton.id = 'close';
  closebutton.onclick = function () {
    this.parentNode.remove();
    window.GLOBAL_CHARTS_COUNT--;
    return false;
  };
  closebutton.innerHTML = 'X';
  closebutton.className = 'chartheader';
  chartDiv.appendChild(closebutton);

  let movebutton = document.createElement('div');
  movebutton.id = 'move';
  movebutton.className = 'draggable-handle chartheader';
  movebutton.innerHTML = 'M';
  chartDiv.appendChild(movebutton);

  let charttitle = document.createElement('div');
  charttitle.id = 'title';
  charttitle.innerHTML = chartLabel;
  charttitle.className = 'chartheader';
  charttitle.onclick = (event) => {
    changeDivTitle(event);
  };
  chartDiv.appendChild(charttitle);

  //Create canvas inside div
  let chartCanvas = document.createElement("canvas");
  chartCanvas.className = "chartcanvas";
  chartDiv.appendChild(chartCanvas);
  dashboardsContainer.appendChild(chartDiv);
  let newChart = new Chart(
    chartCanvas,
    {
      type: chartType,
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: `${chartLabel}`,
            data: Object.values(chartData),
            //backgroundColor:,
            hoverOffset: 4
          }
        ],
      },
      plugins: [
        autocolors
      ],
      options: {
        plugins: {
          autocolors: {
            mode: 'data'
          }
        }
      }
    }
  );
  window.GLOBAL_CHARTS_COUNT++;
  return chartDiv;
}

async function createComparisionChart(designOneId, designTwoId, chartData, chartType) {
  const dashboardsContainer = document.getElementById('aeccim-dashboards');
  let chartDiv = document.createElement("div");
  chartDiv.className = "chartDiv draggable";

  let designsList = document.getElementById('designsList');
  let designOneName = Array.from(designsList.children).find(n => n.value == designOneId).innerHTML;
  let designTwoName = Array.from(designsList.children).find(n => n.value == designTwoId).innerHTML;

  let closebutton = document.createElement('div');
  closebutton.id = 'close';
  closebutton.onclick = function () {
    this.parentNode.remove();
    window.GLOBAL_CHARTS_COUNT--;
    return false;
  };
  closebutton.innerHTML = 'X';
  closebutton.className = 'chartheader';
  chartDiv.appendChild(closebutton);

  let movebutton = document.createElement('div');
  movebutton.id = 'move';
  movebutton.className = 'draggable-handle chartheader';
  movebutton.innerHTML = 'M';
  chartDiv.appendChild(movebutton);

  let charttitle = document.createElement('div');
  charttitle.id = 'title';
  charttitle.innerHTML = designOneName + ' x ' + designTwoName;
  charttitle.className = 'chartheader';
  charttitle.onclick = (event) => {
    changeDivTitle(event);
  };
  chartDiv.appendChild(charttitle);

  //Create canvas inside div
  let chartCanvas = document.createElement("canvas");
  chartCanvas.className = "chartcanvas";
  chartDiv.appendChild(chartCanvas);
  dashboardsContainer.appendChild(chartDiv);
  let designOneValues = Object.keys(chartData).map(k => chartData[k][0]);
  let designTwoValues = Object.keys(chartData).map(k => chartData[k][1]);
  let newChart = new Chart(
    chartCanvas,
    {
      type: chartType,
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: designOneName,
            data: designOneValues,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
          },
          {
            label: designTwoName,
            data: designTwoValues,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }
        ],
      },
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        }
      }
    }
  );
  window.GLOBAL_CHARTS_COUNT++;
}

function changeDivTitle(event) {
  let newTitle = prompt("Please enter the new title", "Chart/Table Title");
  if (newTitle != null) {
    event.target.innerHTML = newTitle;
  }
}

function enableAddButtons() {
  document.querySelector('#addchart').disabled = false;
  document.querySelector('#addtable').disabled = false;
  document.querySelector('#projectsdropdown').disabled = false;
  document.querySelector('#hubsdropdown').disabled = false;
  document.querySelector('#comparedesigns').disabled = false;
}

function disableAddButtons() {
  document.querySelector('#addchart').disabled = true;
  document.querySelector('#addtable').disabled = true;
  document.querySelector('#projectsdropdown').disabled = true;
  document.querySelector('#hubsdropdown').disabled = true;
  document.querySelector('#comparedesigns').disabled = true;
}

function prepareSwapFlexbox() {
  const containers = document.querySelectorAll('#aeccim-dashboards');

  if (containers.length === 0) {
    return false;
  }

  var swappable = new Swappable.default(containers, {
    draggable: ".draggable",
    handle: ".draggable .draggable-handle",
    mirror: {
      //appendTo: selector,
      appendTo: "body"
    }
  });

  return swappable;
}

async function showToast(message) {
  Swal.fire({
    title: message,
    timer: 5000,
    toast: true,
    position: 'top',
    showConfirmButton: false
  })
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}