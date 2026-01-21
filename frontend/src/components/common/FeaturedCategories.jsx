import React, { useState } from 'react'
import { apiUrl,token } from './Config';
import { useEffect } from 'react';
import axios from 'axios';

const FeaturedCategories = () => {
    const [categories,setCategories]=useState([]);
    const fetchCategories = async () => {
        const res = await axios.get(`${apiUrl}/fetch-categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (res.data.status === 200) {
          setCategories(res.data.categories);
          console.log(res.data.categories);
        }
        
      };

       useEffect(() => {
          fetchCategories();
        }, []);
      
  return (
    <section className='section-2'>
    <div className="container">
        <div className='section-title py-3  mt-4'>
            <h2 className='h3'>Explore Categories</h2>
            <p>Discover categories designed to help you excel in your professional and personal growth.</p>
        </div>
        <div className='row gy-3'>
           
                {categories.map((category)=>{
                   return (
                    <div key={category.id} className='col-6 col-md-6 col-lg-3' >
                        <div className='card shadow border-0'>
                            <div className='card-body'><a href="">{category.name}</a></div>
                        </div>
                        </div>)
                })}
          
        </div>      
    </div>
</section>
  )
}

export default FeaturedCategories