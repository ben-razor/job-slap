import CeramicClient from '@ceramicnetwork/http-client';
import { useEffect, useState } from 'react';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { ThreeIdConnect,  EthereumAuthProvider } from '@3id/connect'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore';
import { DID } from 'dids'
import Image from 'next/image';
import styles from '../../styles/App.module.css'

import { ModelManager } from '@glazed/devtools'
import { model as basicProfileModel } from '@datamodels/identity-profile-basic'
import { model as cryptoAccountsModel } from '@datamodels/identity-accounts-crypto'
import { model as webAccountsModel } from '@datamodels/identity-accounts-web'
import { model as basicSkillModel} from '@datamodels/basic-skill'
import { model as basicSkillsModel} from '@datamodels/basic-skills'

function DataModels(props) {
    const [published, setPublished] = useState();
    const [schemaURL, setSchemaURL] = useState();
    const [dataStore, setDataStore] = useState();
    const [skills, setSkills] = useState();
    const [submitting, setSubmitting] = useState(false);
    const ceramic = props.ceramic;

    const skillData = props.skillData;

    useEffect(() => {
        if(ceramic) {
            (async() => {
                const manager = new ModelManager(ceramic)
                manager.addJSONModel(basicSkillsModel)
                
                const publishedModel = await manager.toPublished();                 
                setPublished(publishedModel);

                const model = new DataModel({ ceramic,  model: publishedModel});
                const schemaURL = model.getSchemaURL('BasicSkills');
                const _dataStore = new DIDDataStore({ ceramic, model });
                setDataStore(_dataStore);
                setSchemaURL(schemaURL);

                // let basicSkillsSchema = 'ceramic://k3y52l7qbv1fry38qqu50ty1fmaiuvj3ir7yjey5y7vegawmn8y3b9c6o3fonj4sg';
                let basicSkillsSchema = 'ceramic://k3y52l7qbv1frym9z6lkz0xo3muo74qsuexcvf1lzhock8mzas9xcuyaulmar0zr4';
                let doc1 = await TileDocument.load(ceramic, basicSkillsSchema);

                let basicSkillSchema = 'ceramic://k3y52l7qbv1frxtahhchzdvrsjl88pu6k3b8ons0p4wkcp8qm9r9kec3divx12l8g';
                let doc2 = await TileDocument.load(ceramic, basicSkillSchema);

                console.log('after doc1 and doc2');

            })();
        }
    }, [ceramic, setPublished]);

    useEffect(() => {
        if(dataStore && skillData && Object.keys(skillData).length) {
            (async() => {
                let allSkills = await dataStore.get('basicSkills');
                if(!allSkills) {
                    allSkills = { skills: [] }
                }

                let date = new Date().toISOString();
                
                let _skillData = { ... skillData };
                _skillData.issuedDate = date;
                
                console.log(' pre set ');
                allSkills.skills.push(_skillData);
                await dataStore.set('basicSkills', allSkills); 
                console.log(' post set');

                setSkills(allSkills.skills);
                /*
                const commits = await ceramic.loadStreamCommits('k2t6wyfsu4pg082s7kwnxst1ya3imoihfnegjbyg5q0jrrpnxvpb8vvayydvbj');

                console.log(JSON.stringify(skillDetails));

                const index = await dataStore.getIndex();
                const it = dataStore.iterator();

                for await (let item of it) {
                    console.log(item);
                }

                let queries = [];

                const doc = await TileDocument.load(ceramic, 'ceramic://k2t6wyfsu4pg082s7kwnxst1ya3imoihfnegjbyg5q0jrrpnxvpb8vvayydvbj');
                let i = 0;
                for(let commitID of doc.allCommitIds.reverse()) {
                    queries.push({streamId: commitID.toString()});  
                    const commitDoc = await TileDocument.load(ceramic, commitID);
                    console.log('commit content: ', JSON.stringify(commitDoc.content))
                    if(++i >= 3) {
                        break;
                    }
                }                

                //let stream = await ceramic.loadStream('kjzl6cwe1jw14978uoi1vnvv0cjeask999m41xh27jtnhk59vlonocowa0yvd33');
                //console.log('stream: ', stream.content)

                console.log('queries: ', queries);
                queries = [
                    {
                        streamId: "k6zn3rc3iwguciahe4y0x952rn036i46amejauqayxm50aq6d53cai8ceaab93uscv6goa6t2wsq4jh97r1zynhw9iytmrpobx35v8bbl4ggvf201ubn8gm",
                    }
                ];
                const docs = await ceramic.multiQuery(queries);
                for(let streamId of Object.keys(docs)) {
                    console.log(streamId);
                    console.log(docs[streamId].content);
                }

                setSkills(skillDetails);
                */
            })();
        }
    }, [dataStore, skillData]);

    function displaySkill(allSkills) {
        let skillRecords = [];

        let key = 0;
        for(let skillDetails of allSkills) {
            let skillPanel = <div className={styles.csnSkillRecord} key={key}>
                <div className={styles.csnSkillRecordLeft}>
                    {skillDetails.image &&
                        <div className={styles.csnSkillImage}>
                            <img alt={"Image for skill " + skillDetails.name} src={skillDetails.image} width="50" height="50" />
                        </div>
                    }
                </div>
                <div className={styles.csnSkillRecordRight}>
                    <div className={styles.csnSkillImage}>
                        {skillDetails.name}
                    </div>
                    <div className={styles.csnSkillImage}>
                        {skillDetails.description}
                    </div>
                </div>
            </div>;
            skillRecords.push(skillPanel);
            key++;
        }
        return skillRecords;
    }

    return <div className="data-models">
        <div>
            {JSON.stringify(published)}
        </div>
        <div>
            Schema URL: {schemaURL}
        </div>
        <div>
            { skills && displaySkill(skills) }
        </div>
    </div>
}

export default DataModels;