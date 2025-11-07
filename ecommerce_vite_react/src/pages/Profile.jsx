import React from 'react'
export default function Profile(){
  const user = JSON.parse(localStorage.getItem('ecom_user')||'null')
  if(!user) return <p>Please login</p>
  return (
    <div>
      <h2>Profile</h2>
      <div className="card">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  )
}
