import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonSelectOption, IonSelect, IonDatetime,
    IonInput, IonButton, useIonToast, IonBackButton, IonIcon, useIonAlert
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { trashSharp } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router';
import { getEntryById, deleteEntry, updateEntry, getAllEntries } from '../databaseHandler';
import { Entry } from '../models';


interface CWParams {
    id: string
}

const Details: React.FC = () => {
    const { id } = useParams<CWParams>()
    const [property, setProperty] = useState('')
    const [bedroom, setBedroom] = useState('')
    const [date, setDate] = useState(new Date().toISOString())
    const [price, setPrice] = useState('')
    const [furniture, setFurniture] = useState('')
    const [note, setNotes] = useState('')
    const [reporter, setReporter] = useState('')
    const [present] = useIonToast()
    const history = useHistory()
    const [alert] = useIonAlert()


    const handleUpdate = async () => {
        const newEntry = {
            id: Number.parseInt(id),
            property: property,
            bedroom: bedroom,
            date: date,
            price: price,
            furniture: furniture,
            note: note,
            reporter: reporter
        }
        const allEntry = await getAllEntries();
        const duplicate = allEntry.filter(entry =>
            newEntry.property === entry.property &&
            newEntry.bedroom === entry.bedroom &&
            newEntry.date === entry.date &&
            newEntry.price === entry.price &&
            newEntry.reporter === entry.reporter);

        if (!property || !bedroom || !price || !reporter) {
            present("Please enter in the required field", 2000);
        }

        else if (duplicate.length === 0) {
            updateEntry(newEntry);
            present("Updated", 2000);
        } else present("Property already exist", 2000);
    }

    async function fetchData() {
        const entry = await getEntryById(Number.parseInt(id)) as Entry
        setProperty(entry.property)
        setBedroom(entry.bedroom)
        setDate(entry.date)
        setPrice(entry.price)
        setFurniture(entry.furniture)
        setNotes(entry.note)
        setReporter(entry.reporter)

    }

    useEffect(() => {
        fetchData();
    }, [])

    function handleDelete() {
        alert({
            header: 'Delete this property?',
            message: 'Are you sure?',
            buttons: [
                'Cancel',
                {
                    text: 'Ok',
                    handler: () => {
                        deleteEntry(Number.parseInt(id))
                        present("Property deleted", 2000)
                        history.goBack()
                    }
                },
            ],
            onDidDismiss: () => false,
        })
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton slot="start">
                        <IonBackButton />
                    </IonButton>
                    <IonTitle>Details {id}</IonTitle>
                    <IonButton onClick={handleDelete} color="danger" slot="end">
                        <IonIcon icon={trashSharp}></IonIcon>
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonItem>
                    <IonLabel position="stacked">Property Type (*)</IonLabel>
                    <IonSelect value={property} onIonChange={event => setProperty(event.detail.value!)}>
                        <IonSelectOption>Flat</IonSelectOption>
                        <IonSelectOption>House</IonSelectOption>
                        <IonSelectOption>Bungalow</IonSelectOption>
                        <IonSelectOption>Mansion</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Bedrooms (*)</IonLabel>
                    <IonSelect value={bedroom} onIonChange={event => setBedroom(event.detail.value!)}>
                        <IonSelectOption>Studio</IonSelectOption>
                        <IonSelectOption>One</IonSelectOption>
                        <IonSelectOption>Two</IonSelectOption>
                        <IonSelectOption>Three</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Date (*)</IonLabel>
                    <IonDatetime readonly={true} value={date}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Monthly Rent Price (*)</IonLabel>
                    <IonInput value={price} onIonChange={event => setPrice(event.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Furniture types</IonLabel>
                    <IonSelect value={furniture} onIonChange={event => setFurniture(event.detail.value!)}>
                        <IonSelectOption>Furnished</IonSelectOption>
                        <IonSelectOption>Unfurnished</IonSelectOption>
                        <IonSelectOption>Part Furnished</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Notes</IonLabel>
                    <IonInput value={note} onIonChange={event => setNotes(event.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Reporter Name (*)</IonLabel>
                    <IonInput value={reporter} onIonChange={event => setReporter(event.detail.value!)}></IonInput>
                </IonItem>
                <IonButton expand="block" onClick={handleUpdate}>Update</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Details;