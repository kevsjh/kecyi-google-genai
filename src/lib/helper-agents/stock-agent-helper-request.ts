import { apiBaseURL } from '@/config/api-config';
import { firebaseAdminFirestore } from '@/config/firebase-admin-config';
import { IUserStockPortfolio, StockGraphData, StockNews, } from '@/types';
import 'server-only'
import { firestoreAutoId } from '../utils';
import { use } from 'react';
import { tr } from 'date-fns/locale';



const url = "https://www.searchapi.io/api/v1/search";


export interface IStockData {
    title: string;
    symbol: string;
    exchange: any;
    price: number;
    currency: string;
    date: string;
    price_change: any;
    delta?: number;
    moveAmount: any;
    price_change_movement: any;
    ticker: string;
}

function flattenAnnualFinancialData(data: any) {
    try {
        const annualFinancialData = data?.financials.annual
        const annualData = annualFinancialData?.map((item: any) => {
            return {
                year: item.year,
                currency: item.currency,
                currentYearRevenue: item?.revenue?.value,
                lastYearRevenue: item?.revenue?.last_year_value,
                revenueChangePercentage: item?.revenue?.price_change?.percentage,
                revenueChangeAmount: item?.revenue?.price_change?.amount,
                revenueChangeMovement: item?.revenue?.price_change?.movement,
                currentYearNetIncome: item?.net_income?.value,
                lastYearNetIncome: item?.net_income?.last_year_value,
                netIncomeChangePercentage: item?.net_income?.price_change?.percentage,
                netIncomeChangeAmount: item?.net_income?.price_change?.amount,
                netIncomeChangeMovement: item?.net_income?.price_change?.movement,
            }
        })
        // remove the last element in annualData if it exists
        if (annualData?.length > 1) {
            annualData.pop()
        }

        // console.log(annualData)
        // flatten it to 

        const flattenedData = annualData?.reduce((acc: any, item: any) => {
            Object.entries(item).forEach(([key, value]: [string, any]) => {
                acc[key] = acc[key] || [];
                acc[key].push(value);
            });
            return acc;
        }, {});

        // Extract keys
        const keys = Object.keys(flattenedData);

        // Construct the header string
        const header = keys.join(" | ");

        // Construct the rows
        const rows = [];
        const numRows = flattenedData[keys[0]].length;

        for (let i = 0; i < numRows; i++) {
            const rowValues = keys.map(key => flattenedData[key][i]);
            const rowString = rowValues.join(" | ");
            rows.push(rowString);
        }
        // Combine header and rows
        const result = [header, ...rows].join("\n");

        if (result === undefined || result?.length === 0) {
            return ''
        }

        return `Financial Data \n ${result}`


    } catch (err) {
        console.error(`Error in flattenAnnualFinancialData`, err)
        return ''
    }

}


export async function requestTrendingStock({ window }: { window: string }) {
    try {


        const res = await fetch(`${apiBaseURL}/api/stock/trending`, {
            method: 'GET',
        })

        // placeholder in case of error


        let trendingTickers = [
            {
                ticker: 'GOOG:NASDAQ',
                name: 'Google'
            },
            {
                ticker: 'AAPL:NASDAQ',
                name: 'Apple'
            }
        ]

        if (res.status === 200) {
            const { data } = await res.json()

            if (data !== undefined) {

                trendingTickers = data
            }
        }




        const promiseTask: Promise<IStockData | undefined>[] = []


        for (let i = 0; i < trendingTickers.length; i++) {
            const element = trendingTickers[i];


            promiseTask.push(googleFinanceRequest({
                query: element.ticker,
                window: window ?? '1D'
            }))
        }

        const result = await Promise.all(promiseTask)

        const filteredResult: IStockData[] = []

        result.forEach((item) => {
            if (item) {
                filteredResult.push(item)
            }
        })

        return filteredResult
    } catch (error) {
        console.error(`Error in requestTrendingStock: ${error}`)
        return undefined

    }
}



export async function yahooFinancialRequest({ query }: { query: string }) {


    // https://query1.finance.yahoo.com/v8/finance/chart/NAUKRI.NS?region=US&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance
    const yahooUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}%20&quotesCount=1`
    const options = {
        headers: {
            method: 'GET',
            // simulate browser user agent
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
        }
    }

    return fetch(yahooUrl, options).then(response => response.json()).then(data => {
        const { quotes } = data
        // we exepct quotes not to be empty
        if (quotes === undefined || quotes.length === 0) {
            return undefined
        }


        // safely extract the first quote
        const { exchDisp, symbol } = quotes[0]

        // (detect the if symbol contains - to indicate crypto or currency)
        // check if symbol contains - to indicate crypto or currency
        if (symbol.includes('-')) {
            return symbol
        }
        return `${symbol}:${exchDisp}`
    }
    ).catch(error => {
        console.error('Error caught in yahooFinancialRequest:', error);
        return undefined
    });


}

export async function googleFinanceRequest({ query, window }: {
    query: string,
    window: string
}) {

    const params = new URLSearchParams({
        "engine": "google_finance",
        "q": query,
        // "window": window,
        "api_key": process.env.SEARCH_API_KEY!
    });

    return fetch(`${url}?${params}`)
        .then(response => response.json())
        .then(data => {
            if (data?.summary === undefined) {
                console.error(`No summary found for ${query}`)
                return undefined
            }
            const { title, stock, exchange, price, currency, date: originalDate,
                price_change
            } = data?.summary

            const { q } = data?.search_parameters


            // we extract only the last 50
            const originalGraph: StockGraphData[] = data?.graph.slice(-50);





            const currentYear = new Date().getFullYear();
            const graph = originalGraph?.map((item) => {
                return {
                    ...item,
                    price: Number(item.price?.toFixed(2)),
                    date: new Date(`${item.date}, ${currentYear}`).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }).toString()
                }
            })


            const financialData = flattenAnnualFinancialData(data)



            const news: StockNews[] = data?.news

            // given the date is in format of "Apr 17, 05:48:21 AM UTC-04:00
            // convert it to sgt

            const date = new Date(`${originalDate}, ${currentYear}`).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });

            // extract summary data
            return {
                title,
                symbol: stock,
                exchange,
                price,
                currency,
                date,
                price_change,
                // price change is only available for default 1D
                delta: price_change?.percentage,
                moveAmount: price_change?.amount,
                price_change_movement: price_change?.movement,
                ticker: q,
                graph,
                news,
                financialData

            }
        })
        .catch(error => {
            console.error('Error caught in googleFinanceRequest:', error);
            return undefined
        });
}


// submit purchase transaction
export async function purchaseStockAction({ uid, symbol, price, numberOfShares }: { uid: string, symbol: string, price: number, numberOfShares: number, }) {
    const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)

    // convert sgd price
    const totalSharePrice = parseFloat(((price * 1.36) * numberOfShares).toFixed(2));
    try {

        const userTransactionRef = userDocRef.collection('transactions').doc()
        const userPortfolioColRef = userDocRef.collection('portfolios')


        userPortfolioColRef.where('symbol', '==', symbol).get()

        const queryResponse = await Promise.all([
            userDocRef.get(),
            userPortfolioColRef.where('symbol', '==', symbol).limit(1).get()
        ])

        const userDoc = queryResponse[0]

        const userPortfolioResponse = queryResponse[1]

        let portfolioId = ''

        let portfolioAmount = totalSharePrice
        let numberOfSharesInPortfolio = numberOfShares
        let portfolioPrice = price


        if (userPortfolioResponse.docs.length === 0) {
            portfolioId = firestoreAutoId()
        } else {
            portfolioId = userPortfolioResponse.docs[0].id
            const portfolioData = userPortfolioResponse.docs[0].data()
            portfolioAmount = portfolioData?.amount + totalSharePrice
            numberOfSharesInPortfolio = portfolioData?.numberOfShares + numberOfShares
            portfolioPrice = portfolioData?.price



        }

        const userData = userDoc.data()

        if (!userDoc.exists && userData === undefined) {
            return {
                status: false,
                error: 'User not found'
            }
        }

        const totalAmount = userData?.bankAccountAmount
        if (totalSharePrice > totalAmount) {
            return {
                status: false,
                error: 'You have insufficient funds and balance in your account. '
            }
        }
        const updatedUserBankAccountAmount = parseFloat((totalAmount - totalSharePrice).toFixed(2));
        const cardLast4 = userData?.cardLast4 ?? Math.floor(1000 + Math.random() * 9000)

        const userPortfolioDoc = userPortfolioColRef.doc(portfolioId)


        const transactionBody = {
            amount: totalSharePrice,

            cardLast4,
            currency: 'SGD',
            id: userTransactionRef.id,
            merchant: `${symbol} * ${numberOfShares} stock purchase`,
            note: `Stock purchase of ${numberOfShares} shares of ${symbol}`,
            status: 'paid',
            type: 'Stock Purchase',
            when: new Date(),
        }


        await Promise.all([
            firebaseAdminFirestore.runTransaction(async (t) => {
                t.set(userDocRef, {
                    bankAccountAmount: updatedUserBankAccountAmount,
                    updatedAt: new Date()
                }, { merge: true })
            }),
            firebaseAdminFirestore.runTransaction(async (t) => {
                t.set(userTransactionRef, transactionBody, { merge: true })
            }),
            firebaseAdminFirestore.runTransaction(async (t) => {
                t.set(userPortfolioDoc, {
                    id: portfolioId,
                    symbol,
                    price,
                    numberOfShares: numberOfSharesInPortfolio,
                    amount: portfolioAmount,
                    createdAt: new Date(),

                }, { merge: true })
            })
        ])
        return {
            status: true,
        }
    } catch (err) {
        console.error(`Error in purchaseStockAction`, err)
        return {
            status: false,
            error: 'Something went wrong. Please try again later.'
        }
    }
}

function userPortfolioToTableString(transactions: IUserStockPortfolio[]): string {
    // Get the headers from the first transaction object
    const headers = Object.keys(transactions[0] || {}).filter(header => header !== 'deltaPercentage' && header !== 'createdAt');

    // Create the table header row
    const tableHeader = headers.join(' | ');

    // Create the table rows
    const tableRows = transactions.map(transaction => {
        const row = headers.map(header => transaction[header as keyof IUserStockPortfolio] || '');
        return row.join(' | ');
    });

    // Join the header and rows together
    const table = [tableHeader, ...tableRows].join('\n');

    return table;
}
export async function getUserPortfolio({ uid }: { uid: string }) {
    const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)
    const userPortfolioColRef = userDocRef.collection('portfolios')
    try {
        const q = await userPortfolioColRef.orderBy('createdAt', 'desc').get()

        const userPortfolioData: IUserStockPortfolio[] = []
        // map data to IUserStockPortfolio
        q.forEach((doc) => {
            const data = doc.data()
            userPortfolioData.push({
                id: doc.id,
                symbol: data.symbol,
                price: data.price,
                numberOfShares: data.numberOfShares,
                amount: data.amount,
                createdAt: data.createdAt.toDate().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),

            })
        })

        const portfolioTableString = userPortfolioToTableString(userPortfolioData)
        return {
            portfolios: userPortfolioData,
            portfolioTableString
        }

    } catch (err) {
        console.error('Error in getUserPortfolio', err)
        return undefined
    }

}



// submit purchase transaction
export async function sellStockAction({ uid, symbol, sharesToSell }: { uid: string, symbol: string, sharesToSell: number }) {
    const userDocRef = firebaseAdminFirestore.collection('users').doc(uid)

    try {

        const userTransactionRef = userDocRef.collection('transactions').doc()
        const userPortfolioColRef = userDocRef.collection('portfolios')


        userPortfolioColRef.where('symbol', '==', symbol).get()

        const queryResponse = await Promise.all([
            userDocRef.get(),
            userPortfolioColRef.where('symbol', '==', symbol).limit(1).get()
        ])

        const userDoc = queryResponse[0]

        const userPortfolioResponse = queryResponse[1]


        const userData = userDoc.data()

        if (!userDoc.exists && userData === undefined) {
            return {
                status: false,
                error: 'User not found'
            }
        }
        const totalAmount = userData?.bankAccountAmount

        if (userPortfolioResponse.docs.length === 0) {
            return {
                status: false,
                error: 'You do not have any shares of this stock to sell.'
            }
        }
        const existingPortfolioData = userPortfolioResponse.docs[0]?.data()
        const portfolioId = existingPortfolioData.id

        const portfolioAmount = existingPortfolioData?.amount ?? 0
        const numberOfSharesInPortfolio = existingPortfolioData?.numberOfShares ?? 0
        const price = existingPortfolioData?.price ?? 0

        if (existingPortfolioData === undefined || numberOfSharesInPortfolio < sharesToSell) {
            return {
                status: false,
                error: 'You do not have enought shares of this stock to sell.'
            }
        }

        // convert sgd price
        const totalSellAmount = parseFloat(((price * 1.36) * sharesToSell).toFixed(2));

        const updatedAmount = parseFloat(Math.max(portfolioAmount - totalSellAmount, 0).toFixed(2));

        const updatedUserBankAccountAmount = parseFloat((totalAmount + updatedAmount).toFixed(2));

        const updatedNumberOfShares = Math.max(numberOfSharesInPortfolio - sharesToSell, 0);

        const toDelete = (updatedNumberOfShares === 0 || updatedAmount === 0) ? true : false

        const userPortfolioDoc = userPortfolioColRef.doc(portfolioId)


        const transactionBody = {
            amount: totalSellAmount,

            cardLast4: 'none',
            currency: 'SGD',
            id: userTransactionRef.id,
            merchant: `${symbol} * ${sharesToSell} stock sold`,
            note: `Stock sold of ${sharesToSell} shares of ${symbol}`,
            status: 'credit',
            type: 'Stock Sold',
            when: new Date(),
        }


        await Promise.all([
            firebaseAdminFirestore.runTransaction(async (t) => {
                t.set(userDocRef, {
                    bankAccountAmount: updatedUserBankAccountAmount,
                    updatedAt: new Date()
                }, { merge: true })

            }),
            toDelete ? firebaseAdminFirestore.runTransaction(async (t) => {
                t.delete(userPortfolioDoc,)
            }) : firebaseAdminFirestore.runTransaction(async (t) => {
                t.set(userPortfolioDoc, {
                    numberOfShares: updatedNumberOfShares,
                    amount: updatedAmount,
                    createdAt: new Date(),
                }, { merge: true })
            }),
            firebaseAdminFirestore.runTransaction(async (t) => {
                t.set(userTransactionRef, transactionBody, { merge: true })
            })
        ])
        return {
            status: true,
        }
    } catch (err) {
        console.error(`Error in purchaseStockAction`, err)
        return {
            status: false,
            error: 'Something went wrong. Please try again later.'
        }
    }
}





