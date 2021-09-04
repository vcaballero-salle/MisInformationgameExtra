/*=====================================================================================================================
04-09-2021 
File contains functions which are used to post data to the firestore db
=====================================================================================================================*/
import firebase from './firebase'
import { db } from './initFirestore'

//after reading the excel sheet this function should post the object to the database
export function postStudy(object){
    let studyCol = db.collection("Studies");
    let studyDoc = studyCol.doc().add(object);  //saves the study and auto populates the id
};

//send the object which contains all of the reactions to the post
export function postReacts(object, particpantID){
    let userCol = db.collection("Participants");
    let participantDoc = userCol.doc(ParticipantID);
    let = participantDoc.update({'Study results': object, 'Completion Status': true });
};

//mTurk ID to be inserted into the study from qualtrics
//This function makes a document for new participants
export function postParticipant(object, participantID){
    let userCol = db.collection("Participants");
    let participantDoc = userCol.doc(participantID).set(object) //saves the participant and assigns them a new name
};
