import { api } from '@/services/apiClient'
import Router from 'next/router'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { type ReactNode, createContext, useEffect, useState } from 'react'
// import { toast } from 'react-toastify'

type AuthContextData = {
  user?: UserProps
  isAuthenticated: boolean
  signIn: (credentials: SignInProps) => Promise<void>
  signOut: () => void
  signUp: (credentials: SignUpProps) => Promise<void>
}

type UserProps = {
  id: string
  name: string
  email: string
}

type SignInProps = {
  email: string
  password: string
}

type SignUpProps = {
  name: string
  email: string
  password: string
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token')
    Router.push('/')
  } catch {
    console.log('erro ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>()
  const isAuthenticated = !!user

  useEffect(() => {
    const { '@nextauth.token': token } = parseCookies()
    if (token) {
      api
        .get('/me')
        .then((response) => {
          const { id, name, email } = response.data
          setUser({
            id,
            name,
            email,
          })
        })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/session', {
        email,
        password,
      })

      const { id, name, token } = response.data
      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 1 mês
        path: '/',
      })

      setUser({
        id,
        name,
        email,
      })

      // Passar para proximas requisiçõse o token

      api.defaults.headers.Authorization = `Bearer ${token}`
      //   toast.success('Seja bem vindo.')
      //Redirecionar o user para /dashboard
      Router.push('/dashboard')
    } catch (err) {
      //   toast.error('Erro ao logar')
      // biome-ignore lint/complexity/noUselessCatch: <explanation>
      throw err
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = await api.post('/users', {
        name,
        email,
        password,
      })

      //   toast.success('Cadastrado com sucesso!')
      //   Router.push('/')
    } catch (err) {
      //   toast.error('Erro as cadastrar')
      console.log(err)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  )
}
