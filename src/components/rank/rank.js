const Rank =(props)=>{
    return(<div>
        <div className="white f3">
             {`${props.user.name}, your current rank is...`}
        </div>
        <div className="white f3">
             {`#${props.user.entries}`}
        </div>
    </div>)
}

export default Rank;