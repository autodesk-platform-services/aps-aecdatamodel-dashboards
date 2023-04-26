﻿let graphql_url = 'https://developer-stg.api.autodesk.com/aeccloudinformationmodel/2022-11/graphql';

export async function getHubs() {
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
      Authorization: 'Bearer ' + token.access_token
    },
    body: JSON.stringify(jsonBody)
  };

  let resp = await fetch(graphql_url, options);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getProjects(hubId) {
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
      Authorization: 'Bearer ' + token.access_token
    },
    body: JSON.stringify(jsonBody)
  };

  let resp = await fetch(graphql_url, options);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getProjectElementsProperty(projectId, filter, propertyName) {
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
      Authorization: 'Bearer ' + token.access_token
    },
    body: JSON.stringify(jsonBody)
  };
  let resp = await fetch(graphql_url, options);
  let respJSON = await resp.json();
  return respJSON;
}

export async function getProjectElementsPropertyPaginated(projectId, filter, propertyName, cursor) {
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
      Authorization: 'Bearer ' + token.access_token
    },
    body: JSON.stringify(jsonBody)
  };
  let resp = await fetch(graphql_url, options);
  let respJSON = await resp.json();
  return respJSON;
}

// export async function getProjectProperties(projectId, cursor) {
//   let token = await (await fetch('/api/auth/token')).json();
//   let jsonBody = {
//     query: `query GetProjectProperties {
//   project(projectId: "${projectId}") {
//     name
// 		aecDesigns{
// 			pagination{cursor}
// 			results{
// 				propertyDefinitions{
// 					pagination{cursor}
// 					results{
// 						name
// 					}
// 				}
// 			}
// 		}
//   }
// }`,
//     variables: undefined,
//     operationName: "GetProjectProperties"
//   };
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'Bearer ' + token.access_token
//     },
//     body: JSON.stringify(jsonBody)
//   };

//   disableAddButtons();

//   let resp = await fetch(graphql_url, options);
//   let respJSON = await resp.json();
//   if (!!respJSON.data.project.aecDesigns.results[0].propertyDefinitions.pagination.cursor) {
//     getPaginatedProperties(projectId, respJSON.data.project.aecDesigns.results[0].propertyDefinitions.pagination.cursor)
//   }
//   else {
//     enableAddButtons();
//   }
//   return respJSON.data.project.aecDesigns.results[0].propertyDefinitions.results;
// }

// async function getPaginatedProperties(projectId, cursor) {
//   let token = await (await fetch('/api/auth/token')).json();
//   let jsonBody = {
//     query: `query GetProjectProperties {
//   project(projectId: "${projectId}") {
//     name
// 		aecDesigns{
// 			pagination{cursor}
// 			results{
// 				propertyDefinitions(pagination:{cursor:"${cursor}"}){
// 					pagination{cursor}
// 					results{
// 						name
// 					}
// 				}
// 			}
// 		}
//   }
// }`,
//     variables: undefined,
//     operationName: "GetProjectProperties"
//   };
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'Bearer ' + token.access_token
//     },
//     body: JSON.stringify(jsonBody)
//   };

//   let resp = await fetch(graphql_url, options);
//   let respJSON = await resp.json();
//   if (!!respJSON.data.project.aecDesigns.results[0].propertyDefinitions.pagination.cursor) {
//     getPaginatedProperties(projectId, respJSON.data.project.aecDesigns.results[0].propertyDefinitions.pagination.cursor)
//   }
//   else {
//     enableAddButtons();
//   }
//   propertiesNames.push(...respJSON.data.project.aecDesigns.results[0].propertyDefinitions.results.map(p => p.name));
// }