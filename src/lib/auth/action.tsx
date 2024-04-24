'use server'

import { cookies } from 'next/headers'
import { firebaseAdminAuth, firebaseAdminFirestore, initFirebaseAdminApp } from '@/config/firebase-admin-config'
import { IUserStockPortfolio, IUserTransaction, Session } from '@/types'
import { FieldValue } from 'firebase-admin/firestore'


initFirebaseAdminApp()

export async function getAuthByCookie(): Promise<Session | undefined> {
    try {
        const sessionObj = cookies().get('session')
        const session = sessionObj?.value
        if (session === undefined || session?.length === 0) {
            return undefined
        }
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)

        return {
            user: {
                id: decodedClaims.uid,
                email: decodedClaims.email ?? '',
            }
        }

    } catch (err) {
        return undefined
    }

}


export async function onSignInRequest({ idToken }: { idToken: string }) {

    try {
        const expiresIn = 60 * 60 * 24 * 7 * 1000;
        const cookie = await firebaseAdminAuth.createSessionCookie(idToken, { expiresIn })
        cookies().set({
            name: 'session',
            value: cookie,
            httpOnly: true,
            secure: false,
        })
        return true

    } catch (err) {
        console.error(`Error in onSignInRequest: ${err}`)
        return false
    }
}



export async function onSignOutRequest() {

    try {

        cookies().delete('session')
        return true

    } catch (err) {
        console.error(`Error in onSignOutRequest: ${err}`)
        // sign out regardless of error
        return true
    }
}




const validMerchantList = [
    {
        title: 'GOOGLE*GSUITE',
        type: 'Software Subscription',
        range: (140 - 30 + 1),
        minValue: 10,

    },
    {
        title: 'GOOGLE*GCLOUD',
        type: 'Software Transaction',
        range: (140 - 30 + 1),
        minValue: 10,

    },
    {
        title: 'Pak Cik Nasi Lemak',
        type: 'Food',
        range: (40 - 10 + 1),
        minValue: 10,

    }
    ,
    {
        title: 'MCD',
        type: 'Food',
        range: (40 - 10 + 1),
        minValue: 10,

    },
    {
        title: 'AirBnB',
        type: 'Accomodation',
        range: (1200 - 200 + 1),
        minValue: 200,

    },
    {
        title: 'ShangriLa Hotel',
        type: 'Hotel Accomodation',
        range: (1200 - 200 + 1),
        minValue: 200,

    },
    {
        title: 'AirAsia',
        type: 'Flight',
        range: (1200 - 200 + 1),
        minValue: 200,

    },
    {
        title: 'Starbucks',
        type: 'Beverage',
        range: (30 - 10 + 1),
        minValue: 10,

    },
    {
        title: 'Ah Beng Coffee Shop',
        type: 'Beverage',
        range: (30 - 10 + 1),
        minValue: 10,

    }
]


const fraudMerchantList = [
    {
        title: 'Remote Control Rodeo',
        type: 'Shopping Purchase',
    },
    {
        title: 'Skyblade Chronicles Game In App Purchase',
        type: 'In App Purchase',
    },
    {
        title: 'Lost Temple of Mahjong Game In App Purchase',
        type: 'In App Purchase',
    },
    {
        title: 'Snoozeville',
        type: 'Online Purchase',
    },
    {
        title: 'The Inkwell Emporium',
        type: 'Theme Park Purchase',
    },

]


/**
 * use to simulate user data
 */
export async function populateUserData() {
    try {
        const sessionObj = cookies().get('session')
        const session = sessionObj?.value
        if (session === undefined || session?.length === 0) {
            return undefined
        }
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)
        const uid = decodedClaims.uid
        const email = decodedClaims.email
        const displayName = decodedClaims.name
        const photoURL = decodedClaims.picture

        // check if user profile already exists 
        const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)
        const userDoc = await userDocRef.get()
        const userData = userDoc.data()

        // if user profile exists, early exit
        if (userDoc.exists && userData) {
            return {
                status: true
            }
        }
        const random4Digit = Math.floor(1000 + Math.random() * 9000)
        const userDataBody = {
            uid,
            email,
            displayName,
            photoURL,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            bankAccountAmount: Math.floor(Math.random() * (1500000 - 250000 + 1)) + 250000,
            cardLast4: random4Digit.toString()
        }


        const userTransactionColRef = userDocRef.collection('transactions')

        // randomize 4 digit 


        // generate 25 dummy transactions for user
        // where 5 of the transactions are fraudulent
        const transactions: IUserTransaction[] = []
        for (let i = 0; i < 20; i++) {

            // get a random index from validMerchantList
            const randomIndex = Math.floor(Math.random() * validMerchantList.length)
            const element = validMerchantList[randomIndex]
            const range = element.range
            const minValue = element.minValue
            const amount = Math.floor(Math.random() * range) + minValue
            const transaction: IUserTransaction = {
                id: userTransactionColRef.doc().id,
                when: new Date(2024, 3, Math.floor(Math.random() * 23) + 1),
                merchant: element.title,
                amount: amount,
                currency: 'SGD',
                note: ``,
                status: 'paid',
                cardLast4: random4Digit.toString(),
                type: element.type
            }
            transactions.push(transaction)
        }

        for (let i = 0; i < 5; i++) {
            const element = fraudMerchantList[i]
            const fraudTransaction: IUserTransaction = {
                id: userTransactionColRef.doc().id,
                when: new Date(2024, 3, Math.floor(Math.random() * 23) + 1),
                merchant: element.title,
                amount: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
                currency: 'EUR',
                note: ``,
                status: 'possible-fraud',
                cardLast4: random4Digit.toString(),
                type: element.type
            }
            transactions.push(fraudTransaction)
        }

        const batch = firebaseAdminFirestore.batch()
        transactions.forEach(transaction => {
            const docId = transaction.id

            const transactionDocRef = userTransactionColRef.doc(docId)
            batch.set(transactionDocRef, transaction)
        })

        batch.set(userDocRef, userDataBody)

        await batch.commit()

        return {
            status: true
        }
    } catch (err) {
        console.error(`Error in populateUserData: ${err}`)
        return {
            error: 'Something went wrong. Please try again.',
            status: false
        }
    }
}


export async function getUserTotalBalance() {
    try {

        const sessionObj = cookies().get('session')
        const session = sessionObj?.value
        if (session === undefined || session?.length === 0) {
            return Math.floor(Math.random() * (250000 - 12500 + 1)) + 12500
        }
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)
        const uid = decodedClaims.uid
        const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)
        const userDoc = await userDocRef.get()
        const userData = userDoc.data()

        const totalBalance = userData?.bankAccountAmount ?? Math.floor(Math.random() * (250000 - 12500 + 1)) + 12500
        return totalBalance
    } catch (err) {
        console.error(`Error in getUserTotalBalance: ${err}`)
        return Math.floor(Math.random() * (250000 - 12500 + 1)) + 12500
    }
}


export async function getUserTotalTransaction() {

    try {

        const sessionObj = cookies().get('session')
        const session = sessionObj?.value
        if (session === undefined || session?.length === 0) {
            return {
                userTotalBalance: Math.floor(Math.random() * (1500000 - 250000 + 1)) + 250000,
                userTransactions: [],
                totalUsage: 0
            }
        }
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)
        const uid = decodedClaims.uid
        const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)

        const userTransactionColRef = userDocRef.collection('transactions')
        const userTransactionQ = userTransactionColRef.orderBy('when', 'desc')



        const result = await Promise.all([
            userDocRef.get(),
            userTransactionQ.get()
        ])
        const userDoc = result[0]
        const userTotalBalance: number = userDoc.data()?.bankAccountAmount ?? Math.floor(Math.random() * (1500000 - 250000 + 1)) + 250000


        const qResponse = result[1]
        const userTransactions: IUserTransaction[] = qResponse.docs.map(doc => {
            const data = doc.data()
            const transaction: IUserTransaction = {
                // id: doc.id,
                id: doc.id,
                when: data.when?.toDate(),
                merchant: data.merchant,
                amount: data.amount,
                currency: data.currency,
                note: data.note,
                status: data.status,
                type: data.type,
                cardLast4: data.cardLast4
            }
            return transaction
        })
        let totalUsage = 0
        userTransactions.forEach(transaction => {
            const currency: string = transaction.currency
            const amount = transaction.amount
            let finalAmount = amount
            if (currency?.toLowerCase() === 'eur') {
                // convert eur to sgd
                finalAmount = amount * 1.45
            }
            totalUsage += finalAmount
        })

        return {
            userTotalBalance,
            userTransactions,
            totalUsage,
        }
    } catch (err) {
        console.error('Error in getUserTotalTransaction: ', err)
        return {
            userTotalBalance: Math.floor(Math.random() * (1500000 - 250000 + 1)) + 250000,
            userTransactions: [],
            totalUsage: 0
        }
    }
}







export async function getUserTotalPortfolio() {

    try {

        const sessionObj = cookies().get('session')
        const session = sessionObj?.value
        if (session === undefined || session?.length === 0) {
            return {
                totalPortfolio: 0,
                userPortfolios: [],

            }
        }
        const decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true)
        const uid = decodedClaims.uid
        const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)

        const userPortfoliosColRef = userDocRef.collection('portfolios')
        const userPortfoliosColQ = userPortfoliosColRef.orderBy('createdAt', 'desc')

        const qResponse = await userPortfoliosColQ.get()
        const userPortfolios: IUserStockPortfolio[] = qResponse.docs.map(doc => {
            const data = doc.data()
            const portfolio: IUserStockPortfolio = {
                // id: doc.id,
                id: doc.id,

                createdAt: data.createdAt?.toDate(),
                symbol: data.symbol,
                amount: data.amount,
                numberOfShares: data.numberOfShares,
                price: data.price,
                // currency: data.currency,

            }
            return portfolio
        })
        let totalPortfolio = 0
        userPortfolios.forEach(portfolio => {

            const amount = portfolio.amount ?? 0


            totalPortfolio += amount
        })

        return {
            totalPortfolio: Math.floor(totalPortfolio),
            userPortfolios,
        }
    } catch (err) {
        console.error('Error in getUserTotalPortfolio: ', err)
        return {
            totalPortfolio: 0,
            userPortfolios: [],

        }
    }
}