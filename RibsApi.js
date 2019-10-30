class RibsApi {
  /**
   * @param baseUrl string that contains the base url with the slash of end that will be called
   * @param mode getting mode of the url, cors, no-cors, ...
   * @param credentials of the url like same-origin
   */
  constructor(baseUrl, mode, credentials) {
    let startUrl = '';

    if (!window.origin && mode !== 'cors') {
      startUrl = `${window.location.protocol}//${window.location.hostname}${(window.location.port ? `:${window.location.port}` : '')}`;
    }

    this.baseUrl = `${startUrl}${baseUrl}`;
    this.mode = mode;
    this.credentials = credentials;
  }

  /**
   * method to get a url by get method
   * @param url
   * @param format
   * @returns {Promise<Response>}
   */
  get(url, format = 'json') {
    return this.execRequest('GET', url, format);
  }

  /**
   * method to send a request with post method to a url with datas
   * datas can be a form data or an object that will be transform to a FormData object
   * @param url
   * @param data
   * @param format
   * @returns {*}
   */
  post(url, data, format = 'json') {
    let formData;

    if (!(data instanceof FormData)) {
      formData = new FormData();

      for (const tempData in data) {
        formData.append(tempData, data[tempData]);
      }
    } else {
      formData = data;
    }

    return this.execRequest('POST', url, format, formData);
  }

  /**
   * method that send all types of request to a given url
   * @param method
   * @param url
   * @param format
   * @param body
   * @returns {Promise<Response>}
   */
  execRequest(method, url, format, body = null) {
    let postUrl = url;

    if (url[0] === '/') {
      postUrl = url.substr(1);
    }

    const request = new Request(`${this.baseUrl}${postUrl}`, {
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

        if (format === 'json') {
          return response.json();
        }

        return response.text();
      })
      .then((responseValue) => {
        if ('format' === 'html') {
          const parser = new DOMParser();
          const parsedDocument = parser.parseFromString(responseValue, "text/html");

          this.deleteScriptTagDom();
          this.insertScriptTagInDom(parsedDocument);
        }

          return responseValue;
      });
  }

  /**
   * method to delete script tags in parent document
   */
  deleteScriptTagDom() {
    document.querySelectorAll('script[data-ribsajaxscript]').forEach((element) => {
      document.body.removeChild(element);
    });
  }

  /**
   * method to insert script tags in parent document
   * @param parsedDocument
   */
  insertScriptTagInDom(parsedDocument) {
      parsedDocument.querySelectorAll('script').forEach((element) => {
        const script = parsedDocument.createElement("script");
        script.src = element.src;
        script.dataset.ribsajaxscript = '';
        document.body.appendChild(script);
      });
  }
}

export default RibsApi;
