import React, { useState, useEffect, useRef, useContext } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import { NFTContext } from '../context/NFTContext'

import { Banner, CreatorCard, Loader, NFTCard, SearchBar } from '../components'
import images from '../assets'
import { makeId } from '../utils/makeId'
import { getCreators } from '../utils/getTopCreators'
import { shortenAddress } from '../utils/shortenAddress'

const Home = () => {
  const { fetchNFTs } = useContext(NFTContext)
  const [nfts, setNfts] = useState([])
  const [nftsCopy, setNftsCopy] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hideButton, setHideButton] = useState(false)
  const [activeSelect, setActiveSelect] = useState('Recently Listed')
  const parentRef = useRef(null)
  const scrollRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    fetchNFTs().then(items => {
      setNfts(items)
      setNftsCopy(items)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    const sortedNfts = [...nfts]
    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price))
        break
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price))
        break
      case 'Recently Listed':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId))
        break
      default:
        setNfts(nfts)
        break
    }
  }, [activeSelect])

  const onHandleSearch = value => {
    const filteredNfts = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    )

    if (filteredNfts.length) {
      setNfts(filteredNfts)
    } else {
      setNfts(nftsCopy)
    }
  }

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy)
    }
  }

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

  const topCreators = getCreators(nftsCopy)

  return (
    <div className='flex justify-center sm:px-4 p-12'>
      <div className='w-full minmd:w-4/5'>
        <Banner
          text={
            <>
              Discover, collect, and sell <br /> extraordinary NFTs.
            </>
          }
          parentStyles='justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl'
          childStyles='md:text-4xl sm:text-2xl xs:text-xl text-left'
        />

        {!isLoading && !nfts.length ? (
          <h1 className='font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0'>
            That&apos;s weird.. no NFTs for sale!
          </h1>
        ) : isLoading ? (
          <Loader />
        ) : (
          <>
            <div>
              <h1 className='font-poppins font-semibold dark:text-white text-nft-black-1 text-2xl minlg:text-4xl ml-4 xs:ml-0'>
                Top Sellers
              </h1>
              <div
                className='relative flex-1 max-w-full flex mt-3'
                ref={parentRef}
              >
                <div
                  className='flex flex-row w-max overflow-x-scroll no-scrollbar select-none'
                  ref={scrollRef}
                >
                  {topCreators.map((creator, i) => {
                    return (
                      <CreatorCard
                        key={creator.seller}
                        rank={i + 1}
                        creatorImage={images[`creator${i + 1}`]}
                        creatorName={shortenAddress(creator.seller)}
                        creatorEths={creator.sum}
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
                          alt='right_arrow'
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
                  NFT Listings
                </h1>
                <div className='flex-2 sm:w-full flex flex-row sm:flex-col'>
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />
                </div>
              </div>
              <div className='mt-3 w-full flex flex-wrap justify-start md:justify-center'>
                {nfts.map(nft => {
                  return <NFTCard key={nft.tokenId} nft={nft} />
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
