"use client"


import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function Register () {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState <string | null> ("")

    const router  = useRouter()

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(password !== confirmPassword){
            setError("Your password do not match")
        }

        try {
            const res = await fetch("/api/auth/register" , {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({email , password})
            })


            // we have stored the information coming from the page in the res

            const data = res.json()

            if(!res.ok){
                setError("Registration Failed")
            }

            router.push("/login")

        } catch (error) {
            console.log(error)
        }

    }

  return (
    <div>
      Register
    </div>
  )
}

export default Register
