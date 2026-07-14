import { useState, useEffect } from 'react'
import { User } from '../context/AuthContext'

// Утилита для API запросов с авторизацией
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('hrp_token')?.replace(/"/g, '')
  
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'API Error')
  }
  
  return data
}

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiCall('/api/admin/users')
      setUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки пользователей')
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (userId: string, updates: { role?: string; banned?: boolean }) => {
    setError(null)
    try {
      const data = await apiCall('/api/admin/users', {
        method: 'PATCH',
        body: JSON.stringify({ userId, ...updates })
      })
      
      // Обновляем локальное состояние
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      ))
      
      return data.user
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления пользователя')
      throw err
    }
  }

  const deleteUser = async (userId: string) => {
    setError(null)
    try {
      await apiCall('/api/admin/users', {
        method: 'DELETE',
        body: JSON.stringify({ userId })
      })
      
      // Удаляем из локального состояния
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления пользователя')
      throw err
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser
  }
}

export interface Log {
  id: string
  time: string
  type: 'auth' | 'forum' | 'admin'
  text: string
  user_id?: string
}

export function useAdminLogs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiCall('/api/admin/logs')
      setLogs(data.logs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки логов')
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = async () => {
    setError(null)
    try {
      await apiCall('/api/admin/logs', { method: 'DELETE' })
      setLogs([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка очистки логов')
      throw err
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return {
    logs,
    loading,
    error,
    fetchLogs,
    clearLogs
  }
}