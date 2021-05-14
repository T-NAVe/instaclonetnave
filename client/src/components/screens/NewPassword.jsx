import React, {useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import M from "materialize-css"

const NewPassword = () => {
    // eslint-disable-next-line
    const history = useHistory()
    const [password, setPassword] = useState('')
    const {token} = useParams()
    const postData = ()=>{
        console.log(token)
        // eslint-disable-next-line
        fetch('/new-password',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                password,
                token
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#d32f2f red darken-2"})
            }else{
                M.toast({html:data.message, classes:"#43a047 green darken-1"})
                history.push("/signin")                
            }
        }).catch(err=>console.log(err))
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="brand-logo">instagram</h2>
                <input
                type="password"
                placeholder="enter new password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                />                
                <button 
                className="btn waves-effect waves-light blue lighten-2" type="submit" 
                name="action"
                onClick={()=>postData()}
                >Change password
                </button>
            </div>
        </div>
        
    )
}

export default NewPassword
