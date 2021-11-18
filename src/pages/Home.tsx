import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonItem, IonLabel, IonSelectOption, IonSelect, IonDatetime,
  IonInput, IonButton, IonList, IonRefresherContent, IonRefresher,
  IonSearchbar
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { getAllEntries } from '../databaseHandler';
import { Entry } from '../models';

const Home: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([])
  const [searchText, setText] = useState('')

  async function fetchData() {
    const allEntries = await getAllEntries();
    setEntries(allEntries);
  }

  async function searchHandler(searchText: string) {
    const result = await getAllEntries() as Entry[]
    searchText = searchText.toLowerCase();
    const actResult = result.filter(entries => entries.property.toLowerCase().indexOf(searchText) > -1)
    setEntries(actResult)
  }

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() =>{
    searchHandler(searchText)
  }, [searchText])

  function doRefresh(event: any) {
    fetchData();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.detail.complete();
    }, 1000);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>RentalZ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar value={searchText} onIonChange={e => setText(e.detail.value!)}></IonSearchbar>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {entries &&
          <IonList>
            {
              entries.map((c, i) =>
                <IonItem routerLink={'details/' + c.id} button key={i}>{c.property}</IonItem>
              )
            }
          </IonList>
        }
      </IonContent>
    </IonPage>
  );
};

export default Home;