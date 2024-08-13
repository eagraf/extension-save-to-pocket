import { CONSUMER_KEY, API_URL } from 'common/constants'
import { Base64 } from 'js-base64'
import { getSetting } from '../../interface'
import { getAccessToken } from '../../helpers'

/* Helper Functions
–––––––––––––––––––––––––––––––––––––––––––––––––– */

async function request(options, skipAuth) {
  //if (!CONSUMER_KEY) throw new Error('Invalid Auth Key')

  //options.data.consumer_key = CONSUMER_KEY

  const headers = new Headers({
    'X-Accept': 'application/json',
    'Content-Type': 'application/json',
  })

  if (!skipAuth) {
    const access_token = await getSetting('access_token')
    console.log("ACCESS TOKEN", access_token);
    headers.append('Authorization', 'Bearer ' + access_token);
  }


  const fetchSettings = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(options.data),
  }

  return fetch(API_URL + options.path, fetchSettings)
    .then(handleErrors)
    .then(handleSuccess)
}

async function getRequest(options, skipAuth) {
  //if (!CONSUMER_KEY) throw new Error('Invalid Auth Key')
  if (!skipAuth) options.data.access_token = await getAccessToken()

  //options.data.consumer_key = CONSUMER_KEY

  const headers = new Headers({
    'X-Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + options.token
  })

  const fetchSettings = {
    method: 'GET',
    headers: headers,
  }

  return fetch(API_URL + options.path, fetchSettings)
    .then(handleErrors)
    .then(handleSuccess)
}

function handleErrors(response) {
  const xErrorCode = response.headers.get('x-error-code')
  const xError = response.headers.get('x-error')

  // We can reject with the error code and message for better handling
  if (!response.ok) return Promise.reject({ xErrorCode, xError })

  return response
}

function handleSuccess(response) {
  return response ? response.json() : false
}

export { request, getRequest }
