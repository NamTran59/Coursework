import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonSelectOption, IonSelect, IonDatetime,
    IonInput, IonButton, useIonToast
  } from '@ionic/react';
  import { useState } from 'react';
  import { getAllEntries, insertEntry } from '../databaseHandler';
  
  const AddProperty: React.FC = () => {
    const [property, setProperty] = useState('')
    const [bedroom, setBedroom] = useState('')
    const [date] = useState(new Date().toISOString())
    const [price, setPrice] = useState('')
    const [furniture, setFurniture] = useState('')
    const [note, setNotes] = useState('')
    const [reporter, setReporter] = useState('')
    const [present] = useIonToast()
  
    const registerClick = async () => {
  
      const newEntry = { property: property, bedroom: bedroom, date: date, price: price, furniture: furniture, note: note, reporter: reporter };
      const allEntry = await getAllEntries();
  
      const duplicate = allEntry.filter(entry => 
        newEntry.property === entry.property && 
        newEntry.bedroom === entry.bedroom && 
        newEntry.date === entry.date &&
        newEntry.price === entry.price &&
        newEntry.reporter === entry.reporter);
  
      if (!property || !bedroom || !date || !price || !reporter) {
        present("Please enter in the required field", 2000);
      } 
  
      else if (duplicate.length === 0) {
        insertEntry(newEntry);
        present("Property has been added successfully", 2000);
      } 
      else present("Property already exist",2000);
    }
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>RentalZ</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonItem>
            <IonLabel position="stacked">Property Type (*)</IonLabel>
            <IonSelect onIonChange={event => setProperty(event.detail.value!)}>
              <IonSelectOption>Flat</IonSelectOption>
              <IonSelectOption>House</IonSelectOption>
              <IonSelectOption>Bungalow</IonSelectOption>
              <IonSelectOption>Mansion</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Bedrooms (*)</IonLabel>
            <IonSelect onIonChange={event => setBedroom(event.detail.value!)}>
              <IonSelectOption>Studio</IonSelectOption>
              <IonSelectOption>One</IonSelectOption>
              <IonSelectOption>Two</IonSelectOption>
              <IonSelectOption>Three</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Date (*)</IonLabel>
            <IonDatetime disabled value={date}/>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Monthly Rent Price (*)</IonLabel>
            <IonInput onIonChange={event => setPrice(event.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Furniture types </IonLabel>
            <IonSelect onIonChange={event => setFurniture(event.detail.value!)}>
              <IonSelectOption>Furnished</IonSelectOption>
              <IonSelectOption>Unfurnished</IonSelectOption>
              <IonSelectOption>Part Furnished</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Description Notes</IonLabel>
            <IonInput onIonChange={event => setNotes(event.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Reporter Name (*)</IonLabel>
            <IonInput onIonChange={event => setReporter(event.detail.value!)}></IonInput>
          </IonItem>
          <IonButton expand="block" onClick={registerClick}>Ok</IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default AddProperty;