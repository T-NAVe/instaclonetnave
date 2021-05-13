import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'


const Profile = () => {
    const [mypics, setPics] = useState([])
    // eslint-disable-next-line
    const {state, dispatch} = useContext(UserContext)
  

    const uploadPic = (image)=>{                
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
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            })
            .then(res=>res.json())
            .then(result=>{
            localStorage.setItem("user", JSON.stringify({...state, pic:result.pic}))
            dispatch({type:"UPDATEPIC",payload:result.pic})
            
            }).catch(err=>console.log(err))      
        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        fetch('mypost',{
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        })
    // eslint-disable-next-line
    },[])

    return (
        <>
        {mypics&&state?
                <div style={{maxWidth:"60%", margin:"0 auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    boxShadow:"0 4px 2px -2px #B0B0B0"
                }}>

                <div className="container">
                <div className="outer" style={{backgroundImage: `url(${state.pic})`}}>
                    <div className="inner">
                    <input onChange={(e)=>uploadPic(e.target.files[0])} className="inputfile" type="file" name="pic" accept="image/*"/>
                    <label><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg></label>
                    </div>
                </div>
                </div>
                <div>
                    <h4>{state.name}</h4>
                    <h5>{state.email}</h5>
                    <div style={{display:"flex", justifyContent:"space-between", width:"%108"}}>
                        <h6 >{mypics.length} posts </h6>
                        <h6 style={{marginLeft:"5px"}}> {state.followers.length} followers</h6>
                        <h6 style={{marginLeft:"5px"}}> {state.following.length} following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>
        :
        <div className="progress #ffebee red lighten-5">
            <div className="indeterminate #ef5350 red lighten-1"></div>
         </div>   
        }

        </>
    )
}

export default Profile
