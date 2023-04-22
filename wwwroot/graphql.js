let graphql_url = 'https://developer-stg.api.autodesk.com/aeccloudinformationmodel/2022-11/graphql';

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
  return respJSON.data;
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
  return respJSON.data;
}

export async function getDesignElements() {
  return '';
}