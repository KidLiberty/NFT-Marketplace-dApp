import React, { useState, useEffect, useContext } from 'react'
import Image from 'next/image'

import { NFTContext } from '../context/NFTContext'
import { Loader, NFTCard, Banner } from '../components'
import images from '../assets'
import { shortenAddress } from '../utils/shortenAddress'

const MyNFTs = () => {
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTContext)

  if (isLoading) {
    return (
      <div className='flex-start min-h-screen'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='flex w-full justify-start items-center flex-col min-h-screen'>
      <div className='w-full flexCenter flex-col'>
        <Banner
          text='Your NFTs'
          parentStyles='h-80 justify-center'
          childStyles='text-center mb-4'
        />
        <div className='flexCenter flex-col -mt-20 z-0'>
          <div className='flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full'>
            <Image
              src={images.creator1}
              className='rounded-full object-cover'
              objectFit='cover'
            />
          </div>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6'>
            {shortenAddress(currentAccount)}
          </p>
        </div>
      </div>

      {!isLoading && !nfts.length ? (
        <div className='flexCenter sm:p-4 p-16'>
          <h1 className='font-poppins dark:text-white text-nft-black-1 font-extrabold text-3xl mt-6'>
            No NFTs Owned
          </h1>
        </div>
      ) : (
        <div className='sm:px-4 p-12 w-full midmd:w-4/5 flexCenter flex-col bg-slate-400'>
          <div className='flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minglg:px-8'>
            Searchbar
          </div>
          <div className='mt-3 w-full flex flex-wrap'>
            {nfts.map(nft => {
              return <NFTCard key={nft.marketId} nft={nft} />
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyNFTs
