import React, { useEffect, useState } from 'react'
import { useEthers, shortenAddress, useLookupAddress } from '@usedapp/core'
import Web3Modal from 'web3modal'

import WalletConnectProvider from '@walletconnect/web3-provider'

export const Web3ModalButton = () => {
  const { account, activate, deactivate } = useEthers()
  const [showModal, setShowModal] = useState(false)
  // const [activateError, setActivateError] = useState('')
  const [provider, setProvider] = useState(null)
  const { error } = useEthers()
//   useEffect(() => {
//     if (error) {
//       setActivateError(error.message)
//     }
//   }, [error])

  const activateProvider = async () => {
    const providerOptions = {
      injected: {
        display: {
          name: 'Metamask',
          description: 'Connect with the provider in your Browser',
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc:{
              44787: 'https://alfajores-forno.celo-testnet.org',
              42220: 'https://forno.celo.org'
          }
        },
      },
    }

    const web3Modal = new Web3Modal({
      providerOptions,
    })

    try {
      const provider = await web3Modal.connect()
      await activate(provider)
    } catch (error) {
      console.log('web3modal error', error.message)
    }
  }

  return (
    <>
      {account ? (
          <button onClick={() => deactivate()}>Disconnect</button>
      ) : (
        <button onClick={activateProvider}>Connect</button>
      )}
    </>
  )
}