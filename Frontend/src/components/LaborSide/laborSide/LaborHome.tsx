import { useSelector } from 'react-redux';
import './LaborHome.css'
import { Link } from "react-router-dom";
import { RootState } from '../../../redux/store/store';
import { useEffect } from 'react';

const LaborHome = () => {
  const labor = useSelector((state: RootState) => state.labor.formData)  
  // useEffect(() => {
  //   console.log('this is labor',labor)
  // })
  return (
    <div className='labor-home flex flex-col justify-center items-center'>
      <div className="mainText mt-14 text-[45px]">
        <h1 className='font-bold '>Build Your Reputaion</h1>
        <h1 className='font-bold pl-44 text-[#00409A]'>Grow Professionally</h1>
      </div>
      <div className="smallText text-[19px] font-thin mt-9">
        <h4>Earn ratings and reviews from satisfied clients , A higher rating boosts your</h4>
        <h4>visibility on the platform, helping you attract more clients and grow your business.</h4>
      </div>
      <div className="buttons flex p-8 space-x-28">
        <div className="bcomeaLabor  bg-[#1C3D7A] w-auto rounded-[13px]">
          <Link className='p-4 flex text-white' to={'/labor/registerPage'}>Become a Labor</Link>
        </div>
        <div className="FrequentlyQuestions   dark:bg-[#D5FBF4] w-auto rounded-[13px]">
          <button className='p-4 dark:text-[#000000] '>Frequntily asking questions</button>
        </div>
      </div>
    </div>
  )
}

export default LaborHome
