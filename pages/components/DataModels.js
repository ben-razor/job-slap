import CeramicClient from '@ceramicnetwork/http-client';
import { useEffect, useState } from 'react';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { ThreeIdConnect,  EthereumAuthProvider } from '@3id/connect'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore';
import { DID } from 'dids'

import { ModelManager } from '@glazed/devtools'
import { model as basicProfileModel } from '@datamodels/identity-profile-basic'
import { model as cryptoAccountsModel } from '@datamodels/identity-accounts-crypto'
import { model as webAccountsModel } from '@datamodels/identity-accounts-web'
import { model as basicSkillModel} from '@datamodels/basic-skill'

function DataModels(props) {
    const [published, setPublished] = useState();
    const [schemaURL, setSchemaURL] = useState();
    const [basicProfile, setBasicProfile] = useState();
    const [dataStore, setDataStore] = useState();
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
                setBasicProfile(JSON.stringify(basicProfile));
            })();
        }
    }, [ceramic, setPublished]);

    useEffect(() => {
        if(dataStore && skillData) {
            (async() => {
                let date = new Date().toISOString();
                
                let _skillData = { ... skillData };
                _skillData.issuedDate = date;
                
                await dataStore.set('basicSkill', skillData); 

                const skillDetails = await dataStore.get('basicSkill');
            })
        }
   }, [dataStore, skillData]);

    return <div className="data-models">
        <h2>Tests On Data Models</h2>
        <div>
            Published:
            {JSON.stringify(published)}
        </div>
        <div>
            Schema URL: {schemaURL}
        </div>
        <div>
            Basic Profile: {basicProfile}
        </div>
    </div>
}

export default DataModels;