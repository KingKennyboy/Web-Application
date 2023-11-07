import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom"; 

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate();
  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const res = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    })

    const json = await res.json()

    if (!res.ok) {
      setIsLoading(false)
      setError(json.error)
    }

    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(json))
      dispatch({type: 'LOGIN', payload: json})
      setIsLoading(false)
      navigate('/displayProfile')
    }
  }

  return { login, isLoading, error }
}