import { lighten } from 'polished'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { styled } from '@mui/system'
import { AccountConnect } from '@cardinal/namespaces-components'
import { Wallet } from '@saberhq/solana-contrib'
import { useUTCNow } from 'providers/UTCNowProvider'
import { contrastColorMode } from './utils'

export const StyledWalletButton = styled(WalletMultiButton)`
  color: rgb(55, 65, 81, 1);
  &:hover {
    background: none !important;
  }
  .wallet-adapter-button {
    padding: 0px;
  }
`
export const TitleText = styled('div')`
  @media (max-width: 550px) {
    font-size: 14px;
  }
`

// Dialect
import * as anchor from '@project-serum/anchor'
import { useState, useEffect, useMemo } from 'react'
import { WalletContextState } from '@solana/wallet-adapter-react'

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  '2ZzCZYLqCKoTgC8UVcdS1ehUWx55i4CAVaCXrfNYg6c7'
)

import {
  Backend,
  Config,
  defaultVariables,
  DialectContextProvider,
  DialectThemeProvider,
  DialectUiManagementProvider,
  DialectWalletAdapter,
  IncomingThemeVariables,
  NotificationsButton,
} from '@dialectlabs/react-ui'

const walletToDialectWallet = (
  wallet: WalletContextState
): DialectWalletAdapter => ({
  publicKey: wallet.publicKey!,
  connected:
    wallet.connected &&
    !wallet.connecting &&
    !wallet.disconnecting &&
    Boolean(wallet.publicKey),
  signMessage: wallet.signMessage,
  signTransaction: wallet.signTransaction,
  signAllTransactions: wallet.signAllTransactions,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  diffieHellman: wallet.wallet?.adapter?._wallet?.diffieHellman
    ? async (pubKey) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return wallet.wallet?.adapter?._wallet?.diffieHellman(pubKey);
      }
    : undefined,
})

// END DIALECT

export const Header = () => {
  const router = useRouter()
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()
  
  const { clockDrift } = useUTCNow()

    // DIALECT
  const [dialectWalletAdapter, setDialectWalletAdapter] =
  useState<DialectWalletAdapter>(() => walletToDialectWallet(wallet));

  useEffect(() => {
    setDialectWalletAdapter(walletToDialectWallet(wallet));
  }, [wallet]);

  const dialectConfig = useMemo(
    (): Config => ({
      backends: [Backend.DialectCloud],
      environment: 'production',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
    }),
    []
  )

  return (
    <div>
      {clockDrift && (
        <div
          className="flex w-full items-center justify-center rounded-md py-2 text-center"
          style={{
            color: '#9647FB',
            background: lighten(
              0.15,
              '#383838' || '#000'
            ),
          }}
        >
          <div className="text-xs font-semibold text-yellow-500">
            Warning{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://status.solana.com/"
              className="text-blue-400"
            >
              Solana
            </a>{' '}
            clock is {Math.floor(clockDrift / 60)} minutes{' '}
            {clockDrift > 0 ? 'behind' : 'ahead'}. Rewards are now shown aligned
            to solana clock.
          </div>
        </div>
      )}
      <div
        className={`flex h-20 justify-between px-5 text-white`}
        style={{ color: '#FFFFFF' }}
      >
        <div className="flex items-center gap-3">
          <a
            target="_blank"
            href="https://sentries.io"
            className="flex cursor-pointer text-xl font-semibold"
          >
              <div className="flex flex-row">
                <img
                  className="flex h-[55px] flex-col"
                  src="https://www.sentries.io/images/Logo.svg"
                />
              </div>
          </a>
          {ctx.environment.label !== 'mainnet-beta' && (
            <div className="cursor-pointer rounded-md bg-[#9945ff] p-1 text-[10px] italic text-white">
              {ctx.environment.label}
            </div>
          )}
          {ctx.environment.label !== 'mainnet-beta' ? (
            <div className="mt-0.5">
              
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="relative my-auto flex items-center align-middle">
          {wallet.connected && wallet.publicKey ? (
            <>
            <AccountConnect
              dark={
                '#383838'
                  ? contrastColorMode('#383838')[1]
                  : true
              }
              connection={ctx.secondaryConnection}
              environment={ctx.environment.label}
              handleDisconnect={() => wallet.disconnect()}
              wallet={wallet as Wallet}
            />
            <DialectContextProvider
              wallet={dialectWalletAdapter}
              config={dialectConfig}
              dapp={DIALECT_PUBLIC_KEY}
              gate={() =>
                new Promise((resolve) => setTimeout(() => resolve(true), 3000))
              }
            >
              <DialectThemeProvider>
                <DialectUiManagementProvider>
                <NotificationsButton
                  dialectId="dialect-notifications"
                  notifications={[]}
                  pollingInterval={15000}
                  channels={['web3']}
                />
                </DialectUiManagementProvider>
              </DialectThemeProvider>
            </DialectContextProvider>
            </>
          ) : (
            <StyledWalletButton
              style={{
                fontSize: '14px',
                zIndex: 10,
                height: '38px',
                border: 'none',
                background: 'none',
                backgroundColor: 'none',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
