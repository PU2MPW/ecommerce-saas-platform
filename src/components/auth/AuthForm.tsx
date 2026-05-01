'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface AuthFormProps {
  mode: 'login' | 'signup' | 'recovery'
  tenantSlug?: string
}

export function AuthForm({ mode, tenantSlug = 'demo' }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const endpoint = mode === 'login' 
        ? '/api/auth/login' 
        : mode === 'signup' 
          ? '/api/auth/signup' 
          : '/api/auth/recovery'
      
      const body = mode === 'signup' 
        ? { email, password, name, tenantSlug }
        : mode === 'login'
          ? { email, password, tenantSlug }
          : { email, tenantSlug }
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'An error occurred')
      }
      
      if (mode === 'recovery') {
        setSuccess(data.message || 'Check your email for instructions')
      } else {
        // Redirect on success
        window.location.href = '/'
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  const title = mode === 'login' ? 'Entrar' 
    : mode === 'signup' ? 'Criar conta'
    : 'Recuperar senha'
    
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        
        {mode === 'signup' && (
          <Input
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            required
          />
        )}
        
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
        
        {mode !== 'recovery' && (
          <Input
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        )}
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}
        
        <Button type="submit" isLoading={loading} className="w-full">
          {title}
        </Button>
        
        <div className="text-center text-sm text-gray-600 space-y-2">
          {mode === 'login' && (
            <>
              <p>
                <a href="/auth/recovery" className="text-blue-600 hover:underline">
                  Esqueci minha senha
                </a>
              </p>
              <p>
                Não tem conta?{' '}
                <a href="/auth/signup" className="text-blue-600 hover:underline">
                  Criar conta
                </a>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p>
              Já tem conta?{' '}
              <a href="/auth/login" className="text-blue-600 hover:underline">
                Entrar
              </a>
            </p>
          )}
          {mode === 'recovery' && (
            <p>
              <a href="/auth/login" className="text-blue-600 hover:underline">
                Voltar para login
              </a>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}