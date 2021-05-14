import React,{useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])

    // eslint-disable-next-line
    const {state, dispatch} =useContext(UserContext)

    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            
            setData(result.posts)
        })
    },[])

    const likePost = (postId)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>console.log(err))
    }
    const unLikePost = (postId)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>console.log(err))
    }

    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }                
            })
            
            setData(newData)
        }).catch(err=>{console.log(err)})
    }
    const deleteComment = (commentId, postId)=>{
        fetch('/uncomment',{
            method:"put",
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt"),
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                commentId,
                postId
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }                
            })            
            setData(newData)
        })
        .catch(err=>{console.log(err)})
    }

    const deletePost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        }).catch(err=>{console.log(err)})
    }


    return (
        <div className="Home">
            {
                data.map(item=>{
                    
                    return(
                    <div className="card home-card input-field" key={item._id}>
                        
                        <h5 style={{padding:"6px"}}><img className="miniature" src={item.postedBy.pic} alt="" style={{height:"20px", width:"20px", borderRadius:"100%"}} /> <Link  to={item.postedBy._id !== state._id? `/profile/${item.postedBy._id}`: '/profile' }>{item.postedBy.name}</Link>
                        {// Esto funciona porque en JavaScript, <true && expresión> siempre evalúa a expresión, y <false && expresión> siempre evalúa a false.
                            item.postedBy._id === state._id
                            && <i className="material-icons" style={{float:"right"}}
                            onClick={()=>{deletePost(item._id)}}
                            >delete</i>
                        }
                        
                        
                        </h5>
                        <div className="card image">
                            <img src={item.photo} alt="" />                    
                        </div>
                        <div className="card-content">
                            {
                                item.likes.includes(state._id)
                                ?
                                (
                                    <i className="material-icons" style={{color:"red"}}
                                    onClick={()=>{unLikePost(item._id)}}
                                    >favorite</i>
                                )
                                :
                                (
                                    <i className="material-icons"  style={{color:"black"}}
                                    onClick={()=>{likePost(item._id)}}
                                    >favorite_border</i>
                                )
                            }
                            
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                item.comments.map(record=>{
                                    return(
                                        <h6 key={record._id}><span style={{fontWeight:"400"}}
                                        ><b>{record.postedBy.name}</b> {record.text}</span>
                                        {
                                            record.postedBy._id === state._id
                                            && <i className="material-icons" style={{float:"right"}}
                                            onClick={()=>{deleteComment(record._id ,item._id)}}
                                            >delete</i>
                                        } 
                                        </h6>
                                    )
                                })
                            }
                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                makeComment(e.target[0].value, item._id)
                                e.target[0].value = "" 
                            }}>
                            <input type="text" placeholder="add comment"
                            />
                            </form>
                            
                        </div>
                    </div>        
                    )
                })
            }

        </div>
    )
}

export default Home
