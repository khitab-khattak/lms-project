import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import Hero from '../common/Hero'
import FeaturedCategories from '../common/FeaturedCategories'
import FeaturedCourses from '../common/FeaturedCourses'

const Home = () => {
  return (
    <>
    <Header/>
    <Hero/>
    <FeaturedCategories/>
    <FeaturedCourses/>
    <Footer/>
    </>
  )
}

export default Home