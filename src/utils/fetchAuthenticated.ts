const apiHost = import.meta.env.VITE_API_HOST
const waasApiHost = import.meta.env.VITE_WAAS_API_HOST

export const fetchAuthenticated = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
  childWalletJwt?: string
): Promise<Response> => {
  const token = localStorage.getItem('jwt')
  if (!token) {
    console.error('no token in localstorage')
    throw new Error('No token found in local storage')
  }

  const headers = { ...(init?.headers ?? {}), Authorization: `Bearer ${childWalletJwt ?? token}` }

  const host = childWalletJwt ? waasApiHost : apiHost

  return fetch(host + input, { ...init, headers })
}
