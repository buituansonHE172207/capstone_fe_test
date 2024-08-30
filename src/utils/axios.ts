import { TestType } from '#src/types/test.js'
import { META } from '#utils/env.ts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { redirect } from 'vike/abort'
import useAuthStore from '#stores/authState.js'
import generateChecksum from './helper/checkSum'

// axios.defaults.baseURL = (import.meta.env.PUBLIC_ENV__META__BASE_URL ?? 'http://localhost:3000') as string

// axios.defaults.withCredentials = true;
const responseBody = <T>(response: AxiosResponse<T>): T => {
  return response.data
}

axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  const csrfToken = useAuthStore.getState().csrfToken
  const campusCode = useAuthStore.getState().campusCode
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['Check-sum'] = generateChecksum(
    `PublicKey1${campusCode} PublicKey2`,
    META.CHECKSUM_KEY,
  )
  config.headers['X-CSRF-Token'] = csrfToken
  return config
})

axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse
    switch (status) {
    case 400:
      if (data.errors) {
        const modelStateErrors: string[] = []
        for (const key in data.errors) {
          if (data.errors[key]) {
            modelStateErrors.push(data.errors[key])
          }
        }
        throw modelStateErrors.flat()
      }
      toast.error(data.title)
      break
    case 401:
      toast.error(data.title)
      redirect('/login')
      break
    case 403:
      toast.error('You are not allowed to do that!')
      break
    case 500:
      throw redirect('/login')
      break
    default:
      break
    }
    return Promise.reject(error.response)
  },
)

const requests = {
  get: (url: string, token?: string, params?: URLSearchParams) =>
    axios
      .get(url, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      })
      .then(responseBody),
  post: (url: string, token?: string, body?: object) =>
    axios
      .post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      })
      .then(responseBody),
  put: (url: string, token?: string, body?: object) =>
    axios
      .put(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      })
      .then(responseBody),
  del: (url: string, token?: string) =>
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(responseBody),
  postFile: (url: string, token?: string, data?: FormData) =>
    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'multipart/form-data',
        },
      })
      .then(responseBody),
  putFile: (url: string, token?: string, data?: FormData) =>
    axios
      .put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'multipart/form-data',
          // Thêm bất kỳ header nào khác mà bạn cần
        },
      })
      .then(responseBody),
}

const Account = {
  login: (values: object) => requests.post(META.BASE_URL + '/auth/login', '', values),
  register: (values: string) => requests.post('account/register', values),
}

const Slide = {
  list: (token?: string) => requests.get(META.BACKEND + '/sliders/list', token),
  getId: (token?: string) => requests.get(META.BACKEND + '/slider/get', token),
}

const TestAgent = {
  list: (token?: string) => requests.get(META.BACKEND + '/test/list', token),
  add: (token?: string, body?: TestType) => requests.post(META.BACKEND + '/test/add', token, body),
}

const agent = {
  Account,
  Slide,
  TestAgent,
}

export default agent
