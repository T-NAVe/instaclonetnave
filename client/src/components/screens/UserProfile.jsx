import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    // eslint-disable-next-line
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()

    useEffect(()=>{

        
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setProfile(result)

            
            //setPics(result.mypost)
        }).catch(err=>{console.log(err)})    

    // eslint-disable-next-line
    },[])

    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result.following)
            dispatch({type:"UPDATE",payload:{following:result.following, followers:result.followers}})
            setProfile((previousState)=>{
                //another solution is to replicate previos api call
                //but we can also append the new data recived
                return {
                    ...previousState,
                    user:{
                        ...previousState.user,
                        followers:[...previousState.user.followers,result._id]
                    }
                }
            })
            console.log(result)
            localStorage.setItem("user",JSON.stringify(result))
        })
    }
    const unFollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        })
        .then(res=>res.json())
        .then(result=>{
            dispatch({type:"UPDATE",payload:{following:result.following, followers:result.followers}})
            setProfile((previousState)=>{
                const newFollower = previousState.user.followers.filter(item=>item !== result._id)
                //another solution is to replicate previos api call
                //but we can also append the new data recived
                return {
                    ...previousState,
                    user:{
                        ...previousState.user,
                        followers:newFollower
                    }
                }
            })
            console.log(result)
            localStorage.setItem("user",JSON.stringify(result))
        })
        
    }

    return (
        <>
        {userProfile?
        (
        <div style={{maxWidth:"60%", margin:"0 auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    boxShadow:"0 4px 2px -2px #B0B0B0"
                }}>

                <div className="container">
                    <div className="outer" style={{backgroundImage: `url(${userProfile.user.pic})`}}>
                </div>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex", justifyContent:"space-between", width:"%108"}}>
                        <h6> {userProfile.posts.length} posts</h6>
                        <h6> {userProfile.user.followers.length} followers</h6>
                        <h6> {userProfile.user.following.length} following</h6>
                    </div>
                    {
                        state.following.every(item=>item!==userid)?
                        <button  style={{margin:"10px"}}
                        className="btn waves-effect waves-light blue lighten-2" type="submit" 
                        name="action"
                        onClick={()=>followUser()}
                        >Follow
                        </button>
                        :
                        <button style={{margin:"10px"}}
                        className="btn waves-effect waves-light blue lighten-2" type="submit" 
                        name="action"
                        onClick={()=>unFollowUser()}
                        >UnFollow
                        </button>
                    }


                </div>
            </div>
            <div className="gallery">
                { 
                    userProfile.posts.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>
        )
        :
        (
        <div className="progress #ffebee red lighten-5">
            <div className="indeterminate #ef5350 red lighten-1"></div>
        </div>              
        )
        }
        
        </>
    )
}

export default Profile
