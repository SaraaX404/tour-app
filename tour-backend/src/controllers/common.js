const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { initializeApp } = require('firebase/app');

// Firebase configuration
const firebaseConfig = {
    type: "service_account",
    project_id: "ceylongems-7f695", 
    private_key_id: "29e22bcc1f6fb93f4b125e747389983ef410edd9",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCrIETcxPJwbwDU\nxPaSWCtSXYXcjk3xHQY8iVB72wtlP4ONzBRxIi5bS+xe/zysL74AVgXndcFkGGdo\n/zMIuuZnj3nXchTN+F2108f2z4tMw2s8IojW4NzFMbBVS5rIfWzXF/+5c33BdOdU\nftRRQyPsXBMXcdCvCxfHw2k3S5+9iohD8aTioICRzr2ayhpx2wMpewL543OpoVIj\nksxd/C6/hV3Ehm0l0cKzUqwtX4iObu3gi/FYP7V5iUmdKWdLNM2N3z6pS3RSjTO+\nX8xFs3s0nQlVlYCmHV7CxT28gJwl6plh4kbQEX0c1PEN74itwu20GpqVy5kuKJCM\nLeeweoJTAgMBAAECggEAAmQUB5BKNt9GKrLfIxJPoKSlNHyvLW7otxB6wGWXa4Bk\nrSbXI5wvpko8RjjYtysqQ2+a64NOAsEDM4iv74T0/SjDB2CVASphh3iAXbwZR9Gf\nKPBD6y9UcP44ZtNZ7p0vV8itDlaaa4k08OLzbSM8AuxnvoxyNvqNCCx8cYUBTrD1\nSJUirSoCyUdsb55FjrlCHJrzrKIz5sVcX5Xra1dqKOBPobKpNoKCkGy2nA7bxYHa\nu66T1+704QpeILPL9ruTVUhzoEPvUTXyaYeXO+wYg+nJmtYlv+5PuKWi4ZShbWaD\nCxn2alfwfQ9OqFsDuh16d99nR7MFdKZvEaQ7nC0uqQKBgQDg+A0CyuKTy3EIaal4\nP769zB179yOR+5DouPu9874/vqGKcEgMO6maHOGcZzA5E9YE48eRojYh3+7DNiyZ\nYAUMDC/IvaviANUs3gJFxrHrUTpnPBmncwX1uBvp3vFFnYwxKnk0Sa87dQVGtiIx\nHPe4j107d2o30TEK8lTmjh9c3wKBgQDCuvRnTDQbYiAYDrpaKL/etGOxb6IA6CSY\nHu3RNSsnrSojGXNWPjNqBvDRrbsNxOIXnr37qnG5n5eWyNxfnfcrabOuAhzAsDxH\ngxQn2vz3bDNVOkN9Si+k+eFIJ+CxYwP6uudMCEnLNT3OCWz1Ng9aydHUysurcy13\nOm1jzcuVDQKBgB9g2ce67rF4ndJzkmywT3V/o9knlnGFKigbrRlIhw+zEisSECqM\no9JYFuvOxL4hUyepcauReYVuC4p04vGdn/aXOI8CTZgfT5yLdruuxCAzWzcM/fMK\nKxmjzVjofLSeDfDJoNA3OtbLMqozOz+ob7DxZiqmNE2GwxVoyYjC6AL3AoGASJYB\ntmOMZMyt4+nRgvv/kVcydhiDjcz6nw2gXkRwYqjEtTKucG5dId+WcsJMoHRMRruw\nW5gMLkIT8mvK4YVzdeY/yNQWvaizv4BXygdyFhRqChHeyFwX6GoQlKHwuo6LFDIJ\nN6k7QJkHAb83syvEi3YBVk2Fn9IeF3xa/EHg6h0CgYEAr4xZ2nz7CcKDOQJYtMf/\nA/XlTXn/79zjkb5e306UWtSeyITSNgeQG3l6Q+xVESRByu0tTu+JfycpEDuM2Pyr\nJmvlFTh1TBNrmSbNR5DdwZ19mFaypfRr4KsxnXjeCxaGKJendc/O4O8aqIGLMHMp\nhVP63NAId8jptZhHcxGsI5k=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-occsm@ceylongems-7f695.iam.gserviceaccount.com",
    client_id: "104938366490514163616",
    storageBucket: "ceylongems-7f695.appspot.com",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token", 
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-occsm%40ceylongems-7f695.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'fail',
                message: 'No file uploaded'
            });
        }

        // Create a storage reference
        const storageRef = ref(storage, `images/${Date.now()}-${req.file.originalname}`);

        // Upload file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, req.file.buffer);

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        res.status(200).json({
            status: 'success',
            data: {
                imageUrl: downloadURL
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
