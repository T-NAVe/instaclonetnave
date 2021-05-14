import React,{useEffect} from 'react'
import {useParams} from 'react-router-dom'
import M from 'materialize-css'

const Redirect = () => {
    const {confirmationCode} = useParams()

    useEffect(() => {
        fetch(`/auth/confirm/${confirmationCode}`,{method:"get"})
        .then(res=>res.json())
        .then(data=>{
            M.toast({html:data.message, classes:"#43a047 green darken-1"})
        }).catch(err=>{console.log(err)})
        
// eslint-disable-next-line
    },[])
    return (
        <div className="progress #ffebee red lighten-5">
        <div className="indeterminate #ef5350 red lighten-1"></div>
        </div>        
    )
}

export default Redirect