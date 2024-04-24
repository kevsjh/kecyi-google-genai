// get user transaction data by uid

import { firebaseAdminFirestore } from "@/config/firebase-admin-config"
import { IUserInsuranceData, IUserTransaction } from "@/types"
import { FieldValue } from "firebase-admin/firestore";

function transactionsToTableString(transactions: IUserTransaction[]): string {
    // Get the headers from the first transaction object
    const headers = Object.keys(transactions[0] || {}).filter(header => header !== 'cardLast4' && header !== 'note');

    // Create the table header row
    const tableHeader = headers.join(' | ');

    // Create the table rows
    const tableRows = transactions.map(transaction => {
        const row = headers.map(header => transaction[header as keyof IUserTransaction] || '');
        return row.join(' | ');
    });

    // Join the header and rows together
    const table = [tableHeader, ...tableRows].join('\n');

    return table;
}

export async function getUserAccountTransactionData({ uid }: { uid: string }) {
    try {
        const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)

        const userTransactionColRef = userDocRef.collection('transactions')

        const q = await userTransactionColRef.orderBy('when', 'desc').get()

        if (q.docs.length === 0) {
            return ''
        }

        // map docs data to IUserTransaction[]

        const userTransactions: IUserTransaction[] = q.docs.map(doc => {
            const data = doc.data()
            const transaction: IUserTransaction = {
                id: doc.id,
                when: data.when?.toDate()?.toLocaleDateString('en-GB'),
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


        const tableString = transactionsToTableString(userTransactions)
        return tableString

    } catch (err) {
        console.error(`Exception in getUserTransactionData: ${err}`)
        return ''
    }
}

export async function markTransactionAsReported({ id, uid }: { id: string, uid: string }) {

    try {
        const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)

        const transactionRef = userDocRef.collection('transactions').doc(id)

        // check if transaction exists
        const transactionDoc = await transactionRef.get()
        const data = transactionDoc.data()
        if (data === undefined) {
            return 'Transaction not found'
        }

        await firebaseAdminFirestore.runTransaction(async (t) => {
            t.update(transactionRef, { status: 'reported' })
        })

        return 'Transaction reported successfully'

    } catch (err) {
        console.error('Error in markTransactionAsReported', err)
        return 'Something went wrong. Please try again later.'
    }
}


export async function getUserInsurance({ uid }: { uid: string }) {

    try {
        const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)

        const userInsuranceRef = userDocRef.collection('insurance')
        // check if insurance exists
        const insuranceDoc = await userInsuranceRef.get()

        if (insuranceDoc.docs.length === 0) {
            return []
        }

        // map doc to IUserInsuranceData[]
        const userInsuranceData: IUserInsuranceData[] = insuranceDoc.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                insuranceType: data.insuranceType,
                price: data.price,
                premium: data.premium,
                createdAt: data.createdAt?.toDate()?.toLocaleDateString('en-GB')
            }
        })


        return userInsuranceData
    } catch (err) {
        console.error(`Error in getUserInsurance`, err)
        return []
    }

}


export async function purchaseInsurance({
    uid,
    insuranceType,
    price,
    premium,
    existingId,
}: {
    uid: string,
    insuranceType: string
    price: number
    premium: boolean
    existingId?: string
}) {
    const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)

    const userInsuranceRef = userDocRef.collection('insurance')
    const userTransactionRef = userDocRef.collection('transactions').doc()
    try {
        const insuranceRefId = existingId ? userInsuranceRef.doc(existingId) : userInsuranceRef.doc()

        let deltaPrice = price
        if (existingId) {
            const userCurrentInsurance = await userInsuranceRef.doc(existingId).get()
            const userInsuranceData = userCurrentInsurance.data()
            if (userInsuranceData?.premium || userInsuranceData?.premium === premium) {
                return {
                    status: false,
                    error: `You already have this ${insuranceType} insurance type.`
                }
            }
            // if we proceeding with the purchase

            deltaPrice = price - userInsuranceData?.price

        }

        const userDoc = await userDocRef.get()
        const currentBankAccountAmount = userDoc.data()?.bankAccountAmount

        const updatedBankAccount = currentBankAccountAmount - deltaPrice


        const transactionBody = {
            amount: deltaPrice,

            cardLast4: 'none',
            currency: 'SGD',
            id: userTransactionRef.id,
            merchant: `Kecyi ${insuranceType} insurance`,
            note: ``,
            status: 'paid',
            type: existingId ? 'Insurance Upgrade' : 'Insurance Purchase',
            when: new Date(),
        }

        await Promise.all([
            firebaseAdminFirestore.runTransaction(async (t) => {
                t.update(userDocRef, { bankAccountAmount: updatedBankAccount, updatedAt: FieldValue.serverTimestamp() })
            }),
            userTransactionRef.set(transactionBody),
            insuranceRefId.set({
                insuranceType,
                price,
                premium,
                id: insuranceRefId.id,
                createdAt: FieldValue.serverTimestamp(),
            }, {
                merge: true
            })
        ])




        return {
            status: true,

        }

    } catch (err) {
        console.error(`Error in purchaseInsurance`, err)
        return {
            status: false,
            error: 'Something went wrong. Please try again later.'
        }

    }


}