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
                manager.addJSONModel(basicSkillModel)
                
                const publishedModel = await manager.toPublished();                 
                setPublished(publishedModel);

                const model = new DataModel({ ceramic,  model: publishedModel});
                const schemaURL = model.getSchemaURL('BasicSkill');
                const _dataStore = new DIDDataStore({ ceramic, model });
                setDataStore(_dataStore);
                setSchemaURL(schemaURL);
            })();
        }
    }, [ceramic, setPublished]);

    useEffect(() => {
        if(dataStore && skillData && Object.keys(skillData).length) {
            (async() => {
                let date = new Date().toISOString();
                
                let _skillData = { ... skillData };
                _skillData.issuedDate = date;
                
                await dataStore.set('basicSkill', skillData); 

                const skillDetails = await dataStore.get('basicSkill');

                setSkills(skillDetails);
            })();
        }
    }, [dataStore, skillData]);

    function displaySkill(skillDetails) {
        let skillPanel = <div className={styles.csnSkillRecord}>
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

        return skillPanel;
    }

    return <div className="data-models">
        <div>
            {JSON.stringify(published)}
        </div>
        <div>
            Schema URL: {schemaURL}
        </div>
        <div>
            Skills: {JSON.stringify(skills)}
        </div>
        <div>
            { skills && displaySkill(skills) }
        </div>
    </div>
}

export default DataModels;