import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
class InputHeler {
      
      static updateDoc = async (message,chatID) => {
        await updateDoc(doc(db, "chats", chatID), {
            messages: arrayUnion(message),
          });
      }
       static uploadDoc = async (currentUser,props) => {
        try {
          let docRef = ref(storage, currentUser.uid + '/');
          docRef = ref(docRef, Math.random().toString() + '/' + props.file.name);
          const uploadDoc = uploadBytesResumable(docRef, props.file);
          const docUrlPromise = new Promise((resolve, reject) => {
            uploadDoc.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
              },
              (error) => {
                console.log('upload failure', error);
                reject(error);
              },
              async () => {
                try {
                  const docUrl = await getDownloadURL(uploadDoc.snapshot.ref);
                  const docURLString = docUrl.toString();
                  console.log('Download URL:', docURLString);
                  resolve(docURLString);
                } catch (error) {
                  console.log('Error obtaining download URL:', error);
                  reject(error);
                }
              }
            );
          });
          const docURL = await docUrlPromise;
          return docURL;
        } catch (error) {
          console.log('Error uploading document:', error);
          return null;
        }
      };
      
}
export default InputHeler;

