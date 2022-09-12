import React, { useState, useEffect, useRef, useContext } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import { NFTContext } from '../context/NFTContext'

import { Banner, CreatorCard, NFTCard } from '../components'
import images from '../assets'
import { makeId } from '../utils/makeId'

const Home = () => {
  const { fetchNFTs } = useContext(NFTContext)
  const [hideButton, setHideButton] = useState(false)
  const [nfts, setNfts] = useState([])
  const parentRef = useRef(null)
  const scrollRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    fetchNFTs().then(items => {
      setNfts(items)
      console.log(items)
    })
  }, [])

  const handleScroll = direction => {
    const { current } = scrollRef

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount
    } else {
      current.scrollLeft += scrollAmount
    }
  }

  const isScrollable = () => {
    const { current } = scrollRef
    const { current: parent } = parentRef
    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButton(false)
    } else {
      setHideButton(true)
    }
  }

  useEffect(() => {
    isScrollable()
    window.addEventListener('resize', isScrollable)
    return () => {
      window.removeEventListener('resize', isScrollable)
    }
  })

  return (
    <div className='flex justify-center sm:px-4 p-12'>
      <div className='w-full minmd:w-4/5'>
        <Banner
          banner='Discover, collect, and sell extraordinary NFTs.'
          parentStyles='justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl'
          childStyles='md:text-4xl sm:text-2xl xs:text-xl text-left'
        />

        <div>
          <h1 className='font-poppins font-semibold dark:text-white text-nft-black-1 text-2xl minlg:text-4xl ml-4 xs:ml-0'>
            Top Creators
          </h1>

          <div className='relative flex-1 max-w-full flex mt-3' ref={parentRef}>
            <div
              className='flex flex-row w-max overflow-x-scroll no-scrollbar select-none'
              ref={scrollRef}
            >
              {[6, 7, 8, 9, 10].map(i => {
                return (
                  <CreatorCard
                    key={`creator-${i}`}
                    rank={i}
                    creatorImage={images[`creator${i}`]}
                    creatorName={`0x${makeId(2)}...${makeId(4)}`}
                    creatorEths={10 - i * 0.5}
                  />
                )
              })}

              {!hideButton && (
                <>
                  <div
                    className='absolute w-8 h-8 top-45 left-0 minlg:w-12 minlg:h-12 cursor-pointer'
                    onClick={() => handleScroll('left')}
                  >
                    <Image
                      className={theme === 'light' ? 'filter invert' : ''}
                      src={images.left}
                      layout='fill'
                      objectFit='contain'
                      alt='left_arrow'
                    />
                  </div>
                  <div
                    className='absolute w-8 h-8 top-45 right-0 minlg:w-12 minlg:h-12 cursor-pointer'
                    onClick={() => handleScroll('right')}
                  >
                    <Image
                      className={theme === 'light' ? 'filter invert' : ''}
                      src={images.right}
                      layout='fill'
                      objectFit='contain'
                      alt='right'
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start'>
            <h1 className='flex-1 font-poppins font-semibold dark:text-white text-nft-black-1 text-2xl minlg:text-4xl sm:mb-4'>
              Top Bids
            </h1>
            <div>SearchBar</div>
          </div>
          <div className='mt-3 w-full flex flex-wrap justify-start md:justify-center'>
            {nfts.map(nft => {
              return <NFTCard key={nft.marketId} nft={nft} />
            })}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
              return (
                <NFTCard
                  key={`nft-${i}`}
                  nft={{
                    i,
                    name: `Nifty NFT ${i}`,
                    seller: `0x${makeId(2)}...${makeId(4)}`,
                    owner: `0x${makeId(2)}...${makeId(4)}`,
                    description: 'Cool NFT on sale!',
                    price: (10 - i * 0.53438).toFixed(2)
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
