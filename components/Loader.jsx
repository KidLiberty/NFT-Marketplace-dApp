import React from 'react'
import Image from 'next/image'

import images from '../assets'

const Loader = () => {
  return (
    <div className='flexCenter w-full my-4'>
      <Image
        src={images.loader}
        alt='Loading...'
        width={100}
        height={100}
        objectFit='contain'
      />
    </div>
  )
}

export default Loader
