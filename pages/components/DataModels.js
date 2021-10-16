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
    const ceramic = props.ceramic;

    useEffect(() => {
        if(ceramic) {
            (async() => {
                const manager = new ModelManager(ceramic)
                manager.addJSONModel(basicSkillModel)
                
                const publishedModel = await manager.toPublished();                 
                setPublished(publishedModel);

                const model = new DataModel({ ceramic,  model: publishedModel});
                const schemaURL = model.getSchemaURL('BasicSkill');
                const dataStore = new DIDDataStore({ ceramic, model });
                await dataStore.set('basicSkill', { name: 'Magic', id: 'benrazor.net/actual-real-magic', tags: ['magic'], issuedDate: '2021-10-15T16:49:21', record: 'content' }); 
                const basicProfile = await dataStore.get('basicSkill');

                setSchemaURL(schemaURL);
                setBasicProfile(JSON.stringify(basicProfile));
            })();
        }
    }, [ceramic, setPublished]);

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