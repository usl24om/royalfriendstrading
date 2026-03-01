import React from 'react'
import heroimg from "../assets/hero.png"
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useScroll } from 'framer-motion';

const Hero = () => {
useScroll();


  return (
    <div id='home' >
      <section className='bg-heroBg text-white flex items-center pt-36 md:h-screen '>
        <div className='container mx-auto flex flex-col md:flex-row items justify-between p-8 overflow-y-hidden gap-12 h-full '>
        {/* left side */}
        <div className='md:w-1/2 '>
            <h1  className='mt-[100px] text-3xl font-bold font-Secoundary md:w-3/5 leading-snug  '>Start Your Journey of Trading</h1> 
      <p  className='mt-6  '>Founded in 2025, ROYAL FRIENDS TRADING (PRIVATE)
LIMITED is a Pakistan-based diversified trading company
operating in multiple industries. With a focus on quality,
innovation, and customer satisfaction, we aim to become a
leader in e-commerce, petroleum trading, crypto
investments, cash & carry, property investment, andh
garment trading.
With our headquarters in Islamabad, we serve both
domestic and international markets, ensuring high-standard
business practices and compliance with regulatory
requirements.</p>
        <button className='flex justify-center gap-2'><a href="#contact" className='mt-7 text-white bg-heroBg hover:bg-white hover:text-black gap-2 flex items-center py-2 px-2 rounded-lg font-bold '>
         Get Started<FaArrowAltCircleRight className='text-center' /></a></button>
        </div>
         

         <div className='md:w-1/2 h-full'>
        <img src={heroimg} alt="heroimg" className='w-full object-cover md:pt-10' />
         </div>


        </div>

      </section>
    </div>
  )
}

export default Hero
