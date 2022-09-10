const Banner = ({ banner, parentStyles, childStyles }) => {
  return (
    <div
      className={`relative w-full flex items-center z-0 overflow-hidden nft-gradient ${parentStyles}`}
    >
      <p
        className={`text-bold text-5xl dark:text-white font-poppins font-semibold leading-70 ${childStyles}`}
      >
        {banner}
      </p>
      <div className='absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-9 -left-16 -z-5' />
      <div className='absolute w-72 h-72 sm:w-56 sm:h-56 rounded-full white-bg -bottom-24 -right-14' />
    </div>
  )
}

export default Banner
