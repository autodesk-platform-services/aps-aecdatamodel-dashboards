let graphql_url = 'https://developer.api.autodesk.com/aec/graphql';

export async function getHubs(region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: "query GetHubs {  hubs {    results {     name      id   }  }}",
    variables: undefined,
    operationName: "GetHubs"
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };

  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getProjects(hubId, region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: `query GetProjects {  projects(hubId: "${hubId}") {    results {      name     id    }  }}`,
    variables: undefined,
    operationName: "GetProjects"
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };

  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getProjectDesigns(projectId, region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: `query GetProjectDesigns {  elementGroupsByProject(projectId: "${projectId}") {    results {      name     id    }  }}`,
    variables: undefined,
    operationName: "GetProjectDesigns"
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };

  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getProjectElementsProperty(projectId, filter, propertyName, region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: `query getProjectElementsProperty {
      elementsByProject(projectId: "${projectId}", filter:{query:"${filter}"}) {
        pagination{cursor}
        results{
          name
          properties(filter:{names:"${propertyName}"}){
            results{
              value
              name
            }
          }
        }
      }
    }`,
    variables: undefined,
    operationName: "getProjectElementsProperty"
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };
  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getProjectElementsPropertyPaginated(projectId, filter, propertyName, cursor, region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: `query getProjectElementsProperty {
      elementsByProject(projectId: "${projectId}", filter:{query:"${filter}"}, pagination:{cursor:"${cursor}"}) {
        pagination{cursor}
        results{
          name
          properties(filter:{names:"${propertyName}"}){
            results{
              value
              name
            }
          }
        }
      }
    }`,
    variables: undefined,
    operationName: "getProjectElementsProperty"
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };
  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getDesignElementsProperty(elementGroupId, filter, propertyName, region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: `query getDesignElementsProperty {
      elementsByElementGroup(elementGroupId: "${elementGroupId}", filter:{query:"${filter}"}) {
        pagination{cursor}
        results{
          name
          properties(filter:{names:"${propertyName}"}){
            results{
              value
              name
            }
          }
        }
      }
    }`,
    variables: undefined,
    operationName: "getDesignElementsProperty"
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };
  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getDesignElementsPropertyPaginated(elementGroupId, filter, propertyName, cursor, region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: `query getDesignElementsProperty {
      elementsByElementGroup(elementGroupId: "${elementGroupId}", filter:{query:"${filter}"}, pagination:{cursor:"${cursor}"}) {
        pagination{cursor}
        results{
          name
          properties(filter:{names:"${propertyName}"}){
            results{
              value
              name
            }
          }
        }
      }
    }`,
    variables: undefined,
    operationName: "getDesignElementsProperty"
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };
  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getVersionElementsProperty(elementGroupId, versionNumber, filter, propertyName, region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: `query getVersionElementsProperty {
      elementsByElementGroupAtVersion(elementGroupId: "${elementGroupId}", versionNumber:${parseFloat(versionNumber)}, filter:{query:"${filter}"}) {
        pagination{cursor}
        results{
          name
          properties(filter:{names:"${propertyName}"}){
            results{
              value
              name
            }
          }
        }
      }
    }`,
    variables: undefined,
    operationName: "getVersionElementsProperty"
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };
  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getVersionElementsPropertyPaginated(elementGroupId, versionNumber, filter, propertyName, cursor, region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: `query getDesignElementsProperty {
      elementsByElementGroupAtVersion(elementGroupId: "${elementGroupId}", versionNumber:${parseFloat(versionNumber)} filter:{query:"${filter}"}, pagination:{cursor:"${cursor}"}) {
        pagination{cursor}
        results{
          name
          properties(filter:{names:"${propertyName}"}){
            results{
              value
              name
            }
          }
        }
      }
    }`,
    variables: undefined,
    operationName: "getDesignElementsProperty"
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };
  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getProjectElementsProperties(projectId, filter, propertiesNames, region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: `query getProjectElementsProperties {
      elementsByProject(projectId: "${projectId}", filter:{query:"${filter}"}) {
        pagination{cursor}
        results{
          name
          properties(filter:{names:["${propertiesNames.replaceAll(',', '","')}"]}){
            results{
              value
              name
            }
          }
        }
      }
    }`,
    variables: undefined,
    operationName: "getProjectElementsProperties"
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };
  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getProjectElementsPropertiesPaginated(projectId, filter, propertiesNames, cursor, region = 'US') {
  let token = await (await fetch('/api/auth/token')).json();
  let jsonBody = {
    query: `query getProjectElementsProperties {
      elementsByProject(projectId: "${projectId}", filter:{query:"${filter}"}, pagination:{cursor:"${cursor}"}) {
        pagination{cursor}
        results{
          name
          properties(filter:{names:["${propertiesNames.replaceAll(',', '","')}"]}){
            results{
              value
              name
            }
          }
        }
      }
    }`,
    variables: undefined,
    operationName: "getProjectElementsProperties"
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
      'region':region
    },
    body: JSON.stringify(jsonBody)
  };
  let timestarted = Date.now();
  let resp = await fetch(graphql_url, options);
  let timeElapsed = Date.now() - timestarted;
  console.log(`Query response received after ${timeElapsed} ms`);
  console.log(jsonBody.query);
  let respJSON = await resp.json();
  return respJSON;
}