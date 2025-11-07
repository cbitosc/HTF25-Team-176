import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/mockApi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [role, setRole] = useState('customer')
  const [companyDetails, setCompanyDetails] = useState({
    name: '',
    registrationNumber: '',
    address: '',
    description: ''
  })
  const nav = useNavigate()

  function submit(e) {
    e.preventDefault()
    if (isRegistering) {
      try {
        if (role === 'vendor') {
          // Register vendor with pending status
          const user = api.registerVendor(email, password, companyDetails)
          alert('Registration submitted for approval. You will be notified once approved.')
          setIsRegistering(false)
        } else {
          // Register customer
          const user = api.register(email, password, role)
          localStorage.setItem('ecom_user', JSON.stringify(user))
          alert('Registered successfully!')
          nav('/')
        }
      } catch (err) {
        alert(err.message)
      }
    } else {
      try {
        const user = api.login(email, password)
        if (user.status === 'pending' && user.role === 'vendor') {
          alert('Your vendor account is pending approval.')
          return
        }
        localStorage.setItem('ecom_user', JSON.stringify(user))
        alert('Logged in as ' + user.email)
        nav(user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/')
      } catch (err) {
        alert(err.message)
      }
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px' }}>
      <h2>{isRegistering ? 'Create Account' : 'Sign In'}</h2>
      <form onSubmit={submit} className="card">
        <div className="form-row">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required 
          />
        </div>

        {isRegistering && (
          <>
            <div className="form-row">
              <label>Account Type</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            {role === 'vendor' && (
              <>
                <h3 style={{ color: 'var(--warm-yellow)', marginTop: '20px' }}>Company Details</h3>
                <div className="form-row">
                  <label>Company Name</label>
                  <input 
                    value={companyDetails.name}
                    onChange={e => setCompanyDetails(prev => ({
                      ...prev, name: e.target.value
                    }))}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Registration Number</label>
                  <input 
                    value={companyDetails.registrationNumber}
                    onChange={e => setCompanyDetails(prev => ({
                      ...prev, registrationNumber: e.target.value
                    }))}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Business Address</label>
                  <textarea 
                    value={companyDetails.address}
                    onChange={e => setCompanyDetails(prev => ({
                      ...prev, address: e.target.value
                    }))}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Business Description</label>
                  <textarea 
                    value={companyDetails.description}
                    onChange={e => setCompanyDetails(prev => ({
                      ...prev, description: e.target.value
                    }))}
                    required
                  />
                </div>
              </>
            )}
          </>
        )}

        <button className="button" style={{ width: '100%', marginTop: '20px' }}>
          {isRegistering ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <p className="small" style={{ textAlign: 'center', marginTop: '20px' }}>
        {isRegistering ? (
          <>Already have an account? <button 
            onClick={() => setIsRegistering(false)}
            style={{ background: 'none', border: 'none', color: 'var(--warm-yellow)', cursor: 'pointer', padding: 0 }}
          >Sign In</button></>
        ) : (
          <>Need an account? <button 
            onClick={() => setIsRegistering(true)}
            style={{ background: 'none', border: 'none', color: 'var(--warm-yellow)', cursor: 'pointer', padding: 0 }}
          >Create One</button></>
        )}
      </p>
    </div>
  )
}