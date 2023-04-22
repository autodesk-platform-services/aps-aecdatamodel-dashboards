import { getHubs, getProjects, getDesignElements, getProjectProperties} from './graphql.js';

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
    setInterval(async () => {
      if (propertiesNames.length == 0) {
        let selectedProjectProperties = await getProjectProperties(projectsDropDown.value);
        propertiesNames = selectedProjectProperties.map(p => p.name);
      }
    }, 3000)
  };

  projectsDropDown.onchange = async () => {
    let selectedProjectProperties = await getProjectProperties(projectsDropDown.value);
    propertiesNames = selectedProjectProperties.map(p => p.name);
  };

  prepareSwapFlexbox();

  const addChartButton = document.getElementById('addchart');
  addChartButton.onclick = async () => {
    //Swal to specify filter and parameter to search
    const { parameter: fruit } = await Swal.fire({
      title: 'Select field validation',
      input: 'select',
      inputOptions: propertiesNames,
      inputPlaceholder: 'Select a parameter to build the chart',
      showCancelButton: true
    })

    console.log(`Parameter ${parameter} selected!`)
    
    createChart(filter, parameter);
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

async function createChart(filter, parameter) {

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
        labels: [],
        datasets: [
          {
            label: `${parameter}`,
            data: [],
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
            mode: 'label'
          }
        }
      }
    }
  );
  let chartId = uuidv4();
  GLOBAL_CHARTS[chartId] = newChart;

  let designsElements = [];

  let designElementsResponse = await getDesignElements(hubsDropDown.value, projectsDropDown.value, chartId);
  designElementsResponse.elements.results.length > 0 ? designsDoors.push(...designsElements.elements.results) : null;

  let elements = {};
  for (const designElement of designsElements) {
    let elementParameter = designElement.properties.results.find(t => t.name == parameter);
    if (!Object.keys(elements).includes(elementParameter.value)) {
      elements[elementParameter.value] = 0;
    }
    elements[elementParameter.value]++
  }
  updateChart(chartId, elements, filter, parameter);
}

function updateChart(chartId, elements, filter, parameter) {

}

function prepareSwapFlexbox () {
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