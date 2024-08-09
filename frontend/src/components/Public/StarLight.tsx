import React, { useEffect } from 'react'


import CampImage from '@assets/images/camp2-removebg-preview.png'

type Props = {}

const StarLight = (props: Props) => {
  const generateStars = (n: number) => {
    let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
    for (let i = 2; i <= n; i++) {
      value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
    }
    return value;
  };
  
  useEffect(() => {
    const stars1 = document.querySelector('.stars') as HTMLElement;
    const stars2 = document.querySelector('.stars2') as HTMLElement;
    const stars3 = document.querySelector('.stars3') as HTMLElement;

    if (stars1) stars1.style.boxShadow = generateStars(700);
    if (stars2) stars2.style.boxShadow = generateStars(200);
    if (stars3) stars3.style.boxShadow = generateStars(100);
  }, []);

  return (
    <div className='fixed inset-0 w-screen h-screen z-[-1]'>
      <div className='star-container'>
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
    </div>
  )
}

export default StarLight