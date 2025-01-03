import { Link } from "react-router-dom"
import AnimatedPage from "../AnimatedPage/Animated"

const UserHome = () => {

  return (
    <div className="flex justify-between">
      <AnimatedPage>
        <h1>Welcom to user Home page!</h1>
      </AnimatedPage>
      
      <div className="rightSide p-11  ">
       <Link to={'/login'}> <a href="" className="w-12 p-3 rounded-lg bg-[#8dcbdd] text-white border" >Login</a></Link>
      </div>
    </div>
  )
}

export default UserHome
