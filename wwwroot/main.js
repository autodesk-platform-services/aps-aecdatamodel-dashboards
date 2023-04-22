import { getHubs, getDesigns, getDesignDoors, getProjects } from './graphql.js';

const autocolors = window['chartjs-plugin-autocolors'];

window.addEventListener("load", async () => {
  const login = document.getElementById('login');
  const hubsDropDown = document.getElementById('hubsdropdown');
  let hubsResponse = await getHubs();
  if (!!hubsResponse.hubs) {
    for (const hub of Object.values(hubsResponse.hubs.results)) {
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
    for (const project of Object.values(projectsResponse.projects.results)) {
      let projectOption = document.createElement("option");
      projectOption.text = project.name;
      projectOption.value = project.id;
      projectsDropDown.appendChild(projectOption);
    }
  };

  const addChartButton = document.getElementById('addchart');
  addChartButton.onclick = async () => {
    const dashboardsContainer = document.getElementById('aeccim-dashboards');
    let chartDiv = document.createElement("div");
    chartDiv.className = "chartDiv";
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
              label: 'Doors by type',
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

    //const designsResponse = await getDesigns(hubsDropDown.value, projectsDropDown.value);
    let designsDoors = [];

    let designDoorsResponse = await getDesignDoors(hubsDropDown.value, projectsDropDown.value, chartId);
    designDoorsResponse.designEntities.results.length > 0 ? designsDoors.push(...designDoorsResponse.designEntities.results) : null;

    let doorTypes = {};
    for (const door of designsDoors) {
      let doorFamily = door.properties.results.find(t => t.name == "family");
      if (!Object.keys(doorTypes).includes(doorFamily.value)) {
        doorTypes[doorFamily.value] = 0;
      }
      doorTypes[doorFamily.value]++
    }
    updatechart(chartId, doorTypes);
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
})

async function showToast(message) {
  Swal.fire({
    title: message,
    timer: 5000,
    toast: true,
    position: 'top',
    showConfirmButton: false
  })
}

async function resizeGraphiql(graphiqlDiv, increase) {
  if (increase) {
    graphiqlDiv.style.height = 'calc(100% - 3em)';
  }
  else {
    graphiqlDiv.style.height = 'calc(70%)';
  }
}

async function loadNDisplayModel(graphiqlDiv, viewerDiv, viewer, urn) {
  try {
    viewerDiv.style.visibility = 'visible';
    viewerDiv.style.height = `calc( ${document.body.scrollHeight}px - (1em + ${graphiqlDiv.clientHeight}px))`;
    viewer.resize();
    loadModel(viewer, btoa(urn)).then();
  }
  catch (err) {
    console.log(`Not able to load the model: ${err}`);
  }
}

async function hideModel(viewerDiv) {
  try {
    viewerDiv.style.visibility = 'hidden';
  }
  catch (err) {
    console.log(`Not able to load the model: ${err}`);
  }
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}