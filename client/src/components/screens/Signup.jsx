import React,{ useEffect, useState } from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {

    const history = useHistory()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] =useState('')
    const [url, setUrl] =useState(undefined)

    useEffect(() => {
        if(url){
            uploadFields()
        }
        // eslint-disable-next-line
    }, [url])
    const uploadPic = ()=>{
        
        const data = new FormData()
        data.append('file', image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "tnave")
        fetch('	https://api.cloudinary.com/v1_1/tnave/image/upload',{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
        
    }
    const uploadFields = ()=>{
        // eslint-disable-next-line
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: "Invalid Email", classes:"#d32f2f red darken-2"})
        }
        fetch('/signup',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic:url
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
    const postData = ()=>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
        // eslint-disable-next-line
        
    }


    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="brand-logo">instagram</h2>
                <input 
                type="text"
                placeholder="name"
                value={name}
                onChange={e=>setName(e.target.value)}
                />
                <input 
                type="email"
                placeholder="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                />
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light blue lighten-2">
                        <span>Upload profile image</span>
                        <input 
                        type="file"
                        onChange={(e)=>setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>                
            </div>
                <button 
                className="btn waves-effect waves-light blue lighten-2" type="submit" 
                name="action"
                onClick={()=>postData()}
                >Sign up
                </button>
                <h5>
                    <Link to="/signin"> Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup
