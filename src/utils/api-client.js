import {queryCache} from 'react-query'
import { useContext } from 'react';

const backendEndpoint = process.env.REACT_APP_BACKEND_URL;

async function client(
  endpoint, method, 
  {data, headers: customHeaders, ...customConfig} = {},
) {
  const { user, logOutUser } = useContext(DataContext);
  const accessToken = user._accessToken;

  const config = {
    method: method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${backendEndpoint}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      queryCache.clear()
      await logOutUser()
      // refresh the page for them
      window.location.assign(window.location)
      return Promise.reject({message: 'Please re-authenticate.'})
    }
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
