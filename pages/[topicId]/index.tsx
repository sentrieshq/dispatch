import Head from 'next/head'
import { contrastColorMode } from 'common/utils'

import { useWallet } from '@solana/wallet-adapter-react'

import { DispatchProvider, ForumView, TopicView, DispatchAppProps, useForum, ForumContent } from '@usedispatch/forum'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { Header } from 'common/Header'
// import { useRole } from '@usedispatch/forum/dist/contexts/DispatchProvider'
// import { useForumData } from '@usedispatch/forum'
//import { isSuccess, isInitial, isPending, isNotFound } from '@usedispatch/forum/dist/utils/loading'
import { PublicKey, Cluster } from '@solana/web3.js'
import { Spinner } from '@usedispatch/forum/dist/components/common'
import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import router from 'next/router'

interface Props {
  forumURL: string;
  topicURL: string;
  children?: ReactNode | ReactNode[];
  cluster: Cluster;
}

function Forum(children: any) {
  const wallet = useWallet()
  let { query: { topicId } } = useRouter()
  const { connection, environment } = useEnvironmentCtx()
  const description = "Stake your Sentry NFT to start earning rewards."
  const title = "Sentries NFT Staking"
  const keyword = "Sentries NFTs, Sentries Validators, NFTs"
  const url = "https://sentries.io"
  const image = "https://sentries.io/images/og_stake_image.png"

  const buildForumPath = (collectionId: string = '5KARhGaAMiedrbEVVzotMCCTxDzNcMjKd9atkyhgmGZr') => {
    return `/`
  }
  const buildTopicPath = (collectionId: string = '5KARhGaAMiedrbEVVzotMCCTxDzNcMjKd9atkyhgmGZr', topicId: number) => {
    return `/${topicId}`
  }
  const collectionId = '5KARhGaAMiedrbEVVzotMCCTxDzNcMjKd9atkyhgmGZr'

  const TopicId = Number(topicId)
  const dispatchProps: DispatchAppProps = {
    wallet: wallet,
    connection: connection,
    buildForumPath: buildForumPath,
    buildTopicPath: buildTopicPath,
    children: children,
    cluster: 'mainnet-beta',
  }
  const topicViewProps = {
    collectionId: '5KARhGaAMiedrbEVVzotMCCTxDzNcMjKd9atkyhgmGZr',
    topicId: TopicId
  }
  useEffect(() => {
    const handleRouteChange = () => {
      router.push(window.location)
    };

    window.addEventListener("popstate", handleRouteChange);
    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [router])
  //const forumObject = useForum()
  // const Role = useRole()
  // const { forumData, update } = useForumData(new PublicKey('5KARhGaAMiedrbEVVzotMCCTxDzNcMjKd9atkyhgmGZr'), forumObject)
  
  return (
    <div
      style={{
        background: '#383838'
      }}
    >
    <Head>
        <title>Sentries Forum</title>
        <meta name="description" content="Stake your Sentry NFT increase your Power." />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:type" content="website"/>
        <meta property="og:title" content={title}/>
        <meta name="keywords" content={keyword}/>
        <meta property="og:url" content={url}/>
        <meta property="og:description" content={description}/>
        <meta property="og:image" content={image}/>
      </Head>
      <Header />
      <div
        className={`container mx-auto w-full`}
        style={{
          color:
            '#FFFFFF' ??
            contrastColorMode(
              '#383838' || '#000000'
            )[0],
        }}
      >
        <div className='description-content py-6 px-10 mb-4 mx-5'>
        <h2>Sentries Forum</h2>
        </div>
        <DispatchProvider
          {...dispatchProps}
        >
          <TopicView {...topicViewProps} />
        </DispatchProvider>
      </div>
    </div>
  )
}

export default Forum