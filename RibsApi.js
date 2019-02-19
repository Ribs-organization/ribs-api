class RibsApi {
  /**
   * @param baseUrl string that contains the base url with the slash of end that will be called
   * @param mode getting mode of the url, cors, no-cors, ...
   * @param credentials of the url like same-origin
   */
  constructor(baseUrl, mode, credentials) {
    this.baseUrl = baseUrl;
    this.mode = mode;
    this.credentials = credentials;
  }

  /**
   * method to get a url by get method
   * @param url
   * @returns {Promise<Response>}
   */
  get(url) {
    return this.execRequest('GET', url);
  }

  /**
   * method to send a request with post method to a url with datas
   * datas can be a form data or an object that will be transform to a FormData object
   * @param url
   * @param data
   * @returns {*}
   */
  post(url, data) {
    let formData;

    if (!(data instanceof FormData)) {
      formData = new FormData();

      for (const tempData in data) {
        formData.append(tempData, data[tempData]);
      }
    } else {
      formData = data;
    }

    return this.execRequest('POST', url, formData);
  }

  /**
   * method that send all types of request to a given url
   * @param method
   * @param url
   * @param body
   * @returns {Promise<Response>}
   */
  execRequest(method, url, body = null) {
    const request = new Request(`${this.baseUrl}${url}`, {
      method,
      mode: this.mode,
      body,
      credentials: this.credentials,
    });

    return fetch(request)
    .then((response) => {
      if (response.status !== 200) {
        return 'error';
      }

      return response.json();
    });
  }
}

export default RibsApi;
