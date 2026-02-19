"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserProfile = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");
// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();
/**
 * Generates a cryptographically secure random string for uniqueUserId.
 */
function generateUniqueUserId() {
    return crypto.randomBytes(16).toString('hex'); // 32 characters long hex string
}
/**
 * Hashes an email address using SHA-256 for data minimization.
 */
function hashEmail(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
}
/**
 * Cloud Function triggered when a new user is created in Firebase Authentication.
 * Initializes the user's profile in Firestore.
 */
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
    const { uid, email } = user;
    if (!email) {
        console.warn(`User ${uid} created without an email address. Skipping Firestore profile creation.`);
        return null;
    }
    const uniqueUserId = generateUniqueUserId();
    const hashedEmail = hashEmail(email);
    const now = admin.firestore.Timestamp.now();
    const newUserProfile = {
        uid: uid,
        uniqueUserId: uniqueUserId,
        hashedEmail: hashedEmail,
        username: `user_${uid.substring(0, 8)}`, // Initial internal username, can be updated later
        displayName: `Guest_${uniqueUserId.substring(0, 8)}`, // Initial public display name
        displayNameSource: 'generated',
        isDisplayNameEditable: true, // Default to true, client-side age check will override
        roles: ['user'], // Default role
        // Age Tracking - These will be updated during client-side onboarding
        dateOfBirth: null,
        isUnder13: false,
        isUnder18: false,
        parentalConsentVerified: false,
        // Geolocation - To be collected client-side (coarse)
        city: null,
        state: null,
        // Comprehensive Opt-In/Opt-Out - All default to 'declined'
        policyOptInStatus: {
            consentAOSModeration: 'declined',
            persistentAiMemory: 'declined',
            aggregateTrainingOptIn: 'declined',
            neuralDataOptIn: 'declined',
            privacyPolicy_v1_0: 'declined', // Placeholder version
            parentalControlRelay_v1_0: 'declined',
            aiTransparencyArtifacts_v1_0: 'declined',
            marketing_emails_v1_0: 'declined',
        },
        // Audit Trails & Metadata
        termsAcceptedLog: [], // To be populated during onboarding
        createdAt: now,
        lastLogin: now,
        lastLobotomyTimestamp: null,
        // Gameplay Patterns
        gameplaySummary: {
            totalGamesPlayed: 0,
            achievementsUnlocked: [],
            lastPlayedGameMode: null,
        },
    };
    try {
        await db.collection('users').doc(uid).set(newUserProfile);
        console.log(`User profile created for UID: ${uid} with uniqueUserId: ${uniqueUserId}`);
        return null;
    }
    catch (error) {
        console.error(`Error creating user profile for UID: ${uid}`, error);
        return null;
    }
});
//# sourceMappingURL=index.js.map