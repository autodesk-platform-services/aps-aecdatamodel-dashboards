import { getHubs, getProjects, getProjectElementsProperty, getProjectElementsPropertyPaginated } from './graphql.js';

const autocolors = window['chartjs-plugin-autocolors'];

window.propertiesNames = [];

window.addEventListener("load", async () => {
  const login = document.getElementById('login');
  const hubsDropDown = document.getElementById('hubsdropdown');
  let hubsResponse = await getHubs();
  if (!!hubsResponse.data) {
    for (const hub of Object.values(hubsResponse.data.hubs.results)) {
      let hubOption = document.createElement("option");
      hubOption.text = hub.name;
      hubOption.value = hub.id;
      hubsDropDown.appendChild(hubOption);
    }
  }

  const projectsDropDown = document.getElementById('projectsdropdown');
  hubsDropDown.onchange = async () => {
    projectsDropDown.innerHTML = '';
    let projectsResponse = await getProjects(hubsDropDown.value);
    for (const project of Object.values(projectsResponse.data.projects.results)) {
      let projectOption = document.createElement("option");
      projectOption.text = project.name;
      projectOption.value = project.id;
      projectsDropDown.appendChild(projectOption);
    }
  };

  projectsDropDown.onchange = async () => {
    let selectedProjectProperties = await getProjectProperties(projectsDropDown.value);
    propertiesNames = selectedProjectProperties.map(p => p.name);
  };

  prepareSwapFlexbox();

  const addChartButton = document.getElementById('addchart');
  addChartButton.onclick = async () => {
    //Swal to specifi parameter to obtain and filter to generate the chart
    const { value: formValues } = await Swal.fire({
      title: 'Add property-based chart',
      html:
        '<input id="property" class="swal2-input" placeholder="Type a property name here!">' +
        '<input id="filter" class="swal2-input" placeholder="Type your filter here!">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('property').value,
          document.getElementById('filter').value
        ]
      }
    });

    disableAddButtons();
    let respJSON = await getProjectElementsProperty(document.getElementById('projectsdropdown').value, formValues[1], formValues[0])
    let cursor = respJSON.data.elementsByProject.pagination.cursor;
    let chartData = {};
    for (const result of respJSON.data.elementsByProject.results) {
      if (!chartData[result.properties.results[0].value])
        chartData[result.properties.results[0].value] = 0
      chartData[result.properties.results[0].value]++
    }
    while (!!cursor) {
      let newRespJSON = await getProjectElementsPropertyPaginated(document.getElementById('projectsdropdown').value, formValues[1], formValues[0], cursor)
      cursor = newRespJSON.data.elementsByProject.pagination.cursor;
      for (const result of newRespJSON.data.elementsByProject.results) {
        if (!chartData[result.properties.results[0].value])
          chartData[result.properties.results[0].value] = 0
        chartData[result.properties.results[0].value]++
      }
    }

    enableAddButtons();
    console.log(`Property ${formValues[0]} selected!`);
    console.log(`filter ${formValues[1]} applied!`);

    createChart(formValues[0], chartData);
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

async function createChart(chartLabel, chartData) {

  const dashboardsContainer = document.getElementById('aeccim-dashboards');
  let chartDiv = document.createElement("div");
  chartDiv.className = "chartDiv draggable";

  let closebutton = document.createElement('span');
  closebutton.id = 'close';
  closebutton.onclick = function () {
    this.parentNode.remove();
    return false;
  };
  closebutton.innerHTML = 'X';
  chartDiv.appendChild(closebutton);

  let movebutton = document.createElement('span');
  movebutton.id = 'move';
  movebutton.className = 'draggable-handle';
  movebutton.innerHTML = 'M';
  chartDiv.appendChild(movebutton);

  //Create canvas inside div
  let chartCanvas = document.createElement("canvas");
  chartCanvas.className = "chartcanvas";
  chartDiv.appendChild(chartCanvas);
  dashboardsContainer.appendChild(chartDiv);
  let newChart = new Chart(
    chartCanvas,
    {
      type: 'pie',
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
}

function enableAddButtons() {
  document.querySelector('#addchart').disabled = false;
  document.querySelector('#addtable').disabled = false;
  document.querySelector('#projectsdropdown').disabled = false;
  document.querySelector('#hubsdropdown').disabled = false;
}

function disableAddButtons() {
  document.querySelector('#addchart').disabled = true;
  document.querySelector('#addtable').disabled = true;
  document.querySelector('#projectsdropdown').disabled = true;
  document.querySelector('#hubsdropdown').disabled = true;
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