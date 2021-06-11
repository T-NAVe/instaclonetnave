import React, {useState} from 'react'
import { useHistory} from 'react-router-dom'
import M from "materialize-css"

const Reset = () => {

    const history = useHistory()
    const [email, setEmail] = useState('')
    const postData = ()=>{
        // eslint-disable-next-line
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: "Invalid Email", classes:"#d32f2f red darken-2"})
        }
        fetch('/reset-password',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email
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
                type="email"
                placeholder="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                />                
                <button 
                className="btn waves-effect waves-light blue lighten-2" type="submit" 
                name="action"
                onClick={()=>postData()}
                >Reset Password
                </button>
            </div>
        </div>
        
    )
}

export default Reset
