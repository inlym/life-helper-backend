interface HefengRequestParams {
  key: string

  location: string

  type?: string | number
}

export interface HefengRequestOptions {
  baseURL: string
  url: string
  params: HefengRequestParams
}
