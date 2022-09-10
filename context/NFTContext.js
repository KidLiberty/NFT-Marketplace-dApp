import React, { useState, useEffect } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import axios from 'axios'
import { create } from 'ipfs-http-client'

import { MarketAddress, MarketAddressABI } from './constants'

const projectId = '2EZum75KPy9XY7mTOUDXHxNmgsT'
const projectSecret = '886090a87ca800eb2474708a571a9fa4'
const auth =
  'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64')
const options = {
  host: 'ipfs.infura.io',
  protocol: 'https',
  port: 5001,
  apiPath: 'api/v0',
  headers: {
    authorization: auth
  }
}
const dedicatedEndpoint = 'https://bs-openlake.infura-ipfs.io'
const ipfsClient = create(options)

export const NFTContext = React.createContext()

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const nftCurrency = 'MATIC'

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.')
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    })

    if (accounts.length) {
      setCurrentAccount(accounts[0])
    } else {
      console.log('No accounts found.')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.')
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    setCurrentAccount(accounts[0])

    window.location.reload()
  }

  const uploadToIPFS = async file => {
    try {
      const added = await ipfsClient.add({ content: file })
      const url = `${dedicatedEndpoint}${added.path}`
      console.log(url)
    } catch (err) {
      console.log('Error uploading file to IPFS.')
    }
  }

  const NFTContextValue = {
    nftCurrency,
    connectWallet,
    currentAccount,
    uploadToIPFS
  }

  return (
    <NFTContext.Provider value={NFTContextValue}>
      {children}
    </NFTContext.Provider>
  )
}
