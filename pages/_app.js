import '../styles/globals.css'
import styles from '../styles/App.module.css'
import CeramicClient from '@ceramicnetwork/http-client';
import { useEffect, useState, Fragment } from 'react';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { ThreeIdConnect,  EthereumAuthProvider } from '@3id/connect'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { DID } from 'dids'
import DataModels from './components/DataModels';
import Image from 'next/image';

const API_URL = 'https://ceramic-clay.3boxlabs.com';

function MyApp() {
  const [testDoc, setTestDoc] = useState();
  const [loadedDoc, setLoadedDoc] = useState();
  const [updatedDoc, setUpdatedDoc] = useState();
  const [streamId, setStreamId] = useState();
  const [ceramic, setCeramic] = useState();
  const [ethAddresses, setEthAddresses] = useState();
  const [ethereum, setEthereum] = useState();
  const [commits, setCommits] = useState([]);
  const [appStarted, setAppStarted] = useState(false);

  const [skillName, setSkillName] = useState('');
  const [skillID, setSkillID] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillImageURL, setSkillImageURL] = useState('');
  const [skillData, setSkillData] = useState({});

  useEffect(() => {
    if(window.ethereum) {
      setEthereum(window.ethereum);
      (async() => {
        try {
          const addresses = await window.ethereum.request({ method: 'eth_requestAccounts'})
          setEthAddresses(addresses);
        }
        catch(e) { 
          console.log(e);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if(ethereum && ethAddresses) {
      (async () => {
        const newCeramic = new CeramicClient(API_URL);

        const resolver = {
          ...ThreeIdResolver.getResolver(newCeramic),
        }
        const did = new DID({ resolver })
        newCeramic.did = did;
        const threeIdConnect = new ThreeIdConnect()
        const authProvider = new EthereumAuthProvider(ethereum, ethAddresses[0]);
        await threeIdConnect.connect(authProvider)

        const provider = await threeIdConnect.getDidProvider();
        newCeramic.did.setProvider(provider);
        await newCeramic.did.authenticate();

        setCeramic(newCeramic);
      })();
    }
  }, [ethereum, ethAddresses]);

  useEffect(() => {
    if(ceramic) {
      (async () => {
        /*
        const doc = await TileDocument.create(ceramic, {hello: 'benwar'})
        setTestDoc(JSON.stringify(doc.content));

        const streamId = doc.id.toString();
        setStreamId(streamId);

        const newLoadedDoc = await TileDocument.load(ceramic, streamId)
        setLoadedDoc(JSON.stringify(newLoadedDoc.content));

        await doc.update({foo: 'baz'}, {tags: ['baz']});
        const newUpdatedDoc = await TileDocument.load(ceramic, streamId)
        setUpdatedDoc(JSON.stringify(newUpdatedDoc.content));

        let newCommits = [];
        for(let commitID of newUpdatedDoc.allCommitIds) {
          const commitDoc = await TileDocument.load(ceramic, commitID);
          newCommits.push(commitDoc.content);
        }
        setCommits(newCommits);
        */
      })();
    }
  }, [ceramic, setCeramic, setTestDoc, setStreamId]);

  function getTestDocUI(testDoc, streamId) {
    let content = <h3>Test doc loading...</h3>
    let commitsUI = [];
    for(let commit of commits) {
      commitsUI.push(<div>{JSON.stringify(commit)}</div>);
    }

    if(testDoc && streamId) {
      content = <div className={styles.streamTestPanel}>
        <h2>Tests On Basic Streams</h2>
        <h3>Test doc: {testDoc}</h3>
        <div> {streamId} </div>
        <h3>Test doc from load: {loadedDoc}</h3>
        <h3>Test doc after update: {updatedDoc}</h3>
        <div>
          <h3>Commits: </h3>
          <div>
            {commitsUI}
          </div>
        </div>
      </div>;
    }
    return content
  }

  function getEthNeededPanel() {
    return <div className="csn-eth-panel">
      You need wallet or you will stay unsatisified
      <a className={styles.csnButtonLikeLink} href="https://metamask.io/" target="_blank" rel="noreferrer">
        Try MetaMask
      </a>
    </div>;
  }

  function getWaitingForEthPanel() {
    return <div className="csn-no-eth-accounts">
      Waiting for Ethereum accounts...
    </div>;
  }

  function getAppPanel() {
    return <div className={styles.csnApp}>
      <h1>Ceramic is here</h1>
      {getTestDocUI(testDoc, streamId)}
      <div>
        <DataModels ceramic={ceramic} />
      </div>
    </div>;
  }

  function getWaitingForDIDPanel() {
    return <div className="csn-waiting-for-did">
      Waiting for a decentralized ID...
    </div>
  }

  function handleSkillsSubmit(e) {
    let _skillData = {
      name: skillName,
      id: skillID,
      description: skillDesc
    }

    if(skillImageURL) {
      _skillData.image = skillImageURL;
    }

    setSkillData(_skillData);

    e.preventDefault();
  }

  function getLandingPage() {
    return (
      <div className={styles.csnLandingPage}>
        <div className={styles.csnTopBar}>
          <div className={styles.csnLogoPanel}>
            <h1 className={styles.csnLogoPanelTopHeading}>
              Need Work?
            </h1>
            <div className={styles.csnLogoPanelImage}>
              <Image alt="Job Slap Logo" title="Job Slap Logo" width="200" height="150" layout="intrinsic" src="/job-slap-1-200.png" />
            </div>
            <h1 className={styles.csnLogoPanelBottomHeading}>
              We got your app
            </h1>
          </div>
        </div>
        <div className={styles.csnMainBar}>
          <div className={styles.csnMainPanelContainer}>
          <div className={styles.csnMainProblemPanel  + ' ' + styles.csnMainPanel }>
              <div className={styles.csnMainProblemTitle }>
                Problem
              </div>
              <div className={styles.csnMainProblemContent}>
                <ul className={styles.csnMainList}>
                  <li>Unsatisfying job?</li>
                  <li>Feeling underappreciated?</li>
                  <li>Can't see a way out?</li>
                  <li><span className={styles.strikeout}>Maybe it's you?</span></li>
                  <li>It's definitely NOT you!</li>
                </ul>
              </div>
            </div>
            <div className={styles.csnMainCenterPanel  + ' ' + styles.csnMainPanel }>
              { 
                ethereum ? 
                (
                  ethAddresses ?  
                  (
                    ceramic ?
                    <button onClick={e => setAppStarted(true)}>Let's go!!</button> : 
                    getWaitingForDIDPanel()
                  ) 
                  :
                  getWaitingForEthPanel() 
                )
                :
                getEthNeededPanel()
              }
            </div>
            <div className={styles.csnMainSolutionPanel + ' ' + styles.csnMainPanel }>
              <div className={styles.csnMainSolutionTitle }>
                Solution
              </div>
              <div className={styles.csnMainSolutionContent}>
                <ul className={styles.csnMainList}>
                  <li>Your skills are held captive by centralized mega-corporations</li>
                  <li>Within every human lives magical potential</li>
                  <li>Identify your identities</li>
                  <li>Take control of your skills</li>
                </ul>
              </div>
            </div> 
          </div>
        
        </div>
        <div className={styles.csnFeaturesBar}>
          <div className={styles.csnFeatures}>
            <div className={styles.csnMainSolutionMagic}>
              With Job Slap your magic will fly free and you will become satisfied
            </div>
          </div>
        </div>
    </div>
    );
  }

  function getSkillsPage() {

    let logo = <Image  onClick={e => setAppStarted(false)} alt="Job Slap Logo" title="Job Slap Logo" width="160" height="120" layout="intrinsic" src="/job-slap-1-200.png" />

    let skillsContent = <div className={styles.csnSkillsPage}>
      <div className={styles.csnSkillsPageHeadingRow}>
        <div onClick={e => setAppStarted(false)}>
          {logo}
        </div>
      </div>
      <div className={styles.csnSkillsPageMainRow}>
        <div className={styles.csnSkillsFormContainer }>
          <div className={styles.csnSkillsFormContainerHeading}>

          </div>
          <div className={styles.csnSkillsFormContainerContent}>
            <form onSubmit={e => handleSkillsSubmit(e)}>
              <div className={styles.csnFormRow}>
                <div className={styles.csnFormLabel}>
                  Skill
                </div>
                <div className={styles.csnFormInput}>
                  <input type="text" name="skill-name" value={skillName} onChange={e => setSkillName(e.target.value)} />
                </div>
              </div>
              <div className={styles.csnFormRow}>
                <div className={styles.csnFormLabel}>
                  ID
                </div>
                <div className={styles.csnFormInput}>
                  <input type="text" name="skill-id" value={skillID} onChange={e => setSkillID(e.target.value)} />
                </div>
              </div>
              <div className={styles.csnFormRow}>
                <div className={styles.csnFormLabel}>
                  Description
                </div>
                <div className={styles.csnFormInput}>
                  <textarea name="skill-desc" value={skillDesc} onChange={e => setSkillDesc(e.target.value)} rows={4}>
                  </textarea>
                </div>
              </div>
              <div className={styles.csnFormRow}>
                <div className={styles.csnFormLabel}>
                  Image URL
                </div>
                <div className={styles.csnFormInput}>
                  <input type="text" name="skill-image-url" value={skillImageURL} onChange={e => setSkillImageURL(e.target.value)} />
                </div>
              </div>
              <div className={styles.csnFormRow}>
                <input type="submit" name="submit" value="submit" />
              </div>
              
            </form>
          </div>
        </div>
        <div className={styles.csnSkillsContainer }>
          <div className={styles.csnSkillsContainerHeading}>
            <h1>Your Skills</h1>
          </div>
          <div className={styles.csnSkillsContainerContent}>
            <DataModels skillData={skillData} ceramic={ceramic} />
          </div>

        </div>
      </div>
    </div>
    return skillsContent;
  }

  return (
    <div className={styles.csnApp}>
      {
        (ceramic && appStarted) ?
          getSkillsPage() :
          getLandingPage()
      }
    </div>
 
  );
}

export default MyApp;
