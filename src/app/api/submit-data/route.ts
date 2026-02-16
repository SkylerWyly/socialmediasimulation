
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { firebaseConfig } from '@/lib/firebase-config';

// This function ensures the private key is correctly formatted
function formatPrivateKey(key: string | undefined): string {
  if (!key) return '';
  // If the key already contains newlines, it's likely correctly formatted.
  // Otherwise, replace the escaped newlines.
  if (key.includes('\n')) {
    return key;
  }
  return key.replace(/\\n/g, '\n');
}

export async function POST(req: NextRequest) {
  try {
    // This is the email for the service account you created.
    // IMPORTANT: These variables are for the SERVER-SIDE and should NOT have the NEXT_PUBLIC_ prefix.
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyInput = process.env.FIREBASE_PRIVATE_KEY;

    if (!privateKeyInput || !clientEmail || !firebaseConfig.projectId) {
      console.error('Firebase credentials are not set in the environment.');
      return NextResponse.json(
        { error: 'Server configuration error. Firebase credentials are not set.' },
        { status: 500 }
      );
    }
    
    const privateKey = formatPrivateKey(privateKeyInput);

    // Initialize Firebase Admin SDK if not already initialized
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: firebaseConfig.projectId,
            clientEmail: clientEmail,
            privateKey: privateKey,
          }),
          databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
        });
      } catch (error: any) {
        console.error('Firebase Admin Initialization Error:', error.stack);
        return NextResponse.json(
          { error: 'Firebase Admin Initialization failed.', details: error.message },
          { status: 500 }
        );
      }
    }
    
    const db = admin.firestore();
    const data = await req.json();

    if (!data || !data.participantId) {
      return NextResponse.json(
        { error: 'Missing or invalid participantId in the submitted data.' },
        { status: 400 }
      );
    }
    
    // Use the participantId as the document ID in the 'submissions' collection
    const docRef = db.collection('submissions').doc(data.participantId);
    
    // Set the data for that document
    await docRef.set(data);

    return NextResponse.json(
      { message: 'Data submitted successfully', docId: docRef.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing request:', error.stack);
    return NextResponse.json(
      { error: 'Failed to submit data.', details: error.message },
      { status: 500 }
    );
  }
}
