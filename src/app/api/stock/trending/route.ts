import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs'

export async function GET(request: NextRequest, response: NextResponse) {

    // get random 3 trending tickers
    const randomIndices = Array.from({ length: 3 }, () => Math.floor(Math.random() * sampleTrendingTickers.length));
    // get the ticker from the random index
    // make sure the randomIndices are unique

    const data: { ticker: string, name: string }[] = []

    for (const randomIndex of randomIndices) {
        const ticker = sampleTrendingTickers[randomIndex]
        // push data only if ticker has not exists in data
        if (!data.find((d) => d.ticker === ticker.Symbol)) {

            data.push({
                'ticker': ticker.Symbol,
                'name': ticker.Shortname
            })
        }
    }


    return NextResponse.json({
        data,
    }, { status: 200 });

}


const sampleTrendingTickers = [
    { "Symbol": "MSFT:NASDAQ", "Shortname": "Microsoft Corporation" },
    { "Symbol": "AAPL:NASDAQ", "Shortname": "Apple Inc." },
    { "Symbol": "NVDA:NASDAQ", "Shortname": "NVIDIA Corporation" },
    { "Symbol": "GOOG:NASDAQ", "Shortname": "Alphabet Inc." },
    { "Symbol": "AMZN:NASDAQ", "Shortname": "Amazon.com, Inc." },
    { "Symbol": "META:NASDAQ", "Shortname": "Meta Platforms, Inc." },
    { "Symbol": "AVGO:NASDAQ", "Shortname": "Broadcom Inc." },
    { "Symbol": "VISA:VIE", "Shortname": "Visa Inc." },
    { "Symbol": "JPM:NYSE", "Shortname": "JP Morgan Chase & Co." },
    { "Symbol": "TSLA:NASDAQ", "Shortname": "Tesla, Inc." },
    { "Symbol": "WMT:NYSE", "Shortname": "Walmart Inc." },
    { "Symbol": "XOM:NYSE", "Shortname": "Exxon Mobil Corporation" },
    { "Symbol": "MA:NYSE", "Shortname": "Mastercard Incorporated" },
    { "Symbol": "UNH:NYSE", "Shortname": "UnitedHealth Group Incorporated" },
    { "Symbol": "PG:NYSE", "Shortname": "Procter & Gamble Company (The)" },
    { "Symbol": "JNJ:NYSE", "Shortname": "Johnson & Johnson" },
    { "Symbol": "HD:NYSE", "Shortname": "Home Depot, Inc. (The)" },
    { "Symbol": "ORCL:NYSE", "Shortname": "Oracle Corporation" },
    { "Symbol": "MRK:NYSE", "Shortname": "Merck & Company, Inc." },
    { "Symbol": "COST:NASDAQ", "Shortname": "Costco Wholesale Corporation" },
    { "Symbol": "CVX:NYSE", "Shortname": "Chevron Corporation" },
    { "Symbol": "BAC:NYSE", "Shortname": "Bank of America Corporation" },
    { "Symbol": "CRM:NYSE", "Shortname": "Salesforce, Inc." },
    { "Symbol": "NFLX:NASDAQ", "Shortname": "Netflix, Inc." },
    { "Symbol": "AMD:NASDAQ", "Shortname": "Advanced Micro Devices, Inc." },
    { "Symbol": "KO:NYSE", "Shortname": "Coca-Cola Company (The)" },
    { "Symbol": "PEP:NASDAQ", "Shortname": "Pepsico, Inc." },
    { "Symbol": "ADBE:NASDAQ", "Shortname": "Adobe Inc." },
    { "Symbol": "DIS:NYSE", "Shortname": "Walt Disney Company (The)" },
    { "Symbol": "WFC:NYSE", "Shortname": "Wells Fargo & Company" },
    { "Symbol": "ACN:NYSE", "Shortname": "Accenture plc" },
    { "Symbol": "CSCO:NASDAQ", "Shortname": "Cisco Systems, Inc." },
    { "Symbol": "MCD:NYSE", "Shortname": "McDonald's Corporation" },
    { "Symbol": "TMUS:NASDAQ", "Shortname": "T-Mobile US, Inc." },
    { "Symbol": "QCOM:NASDAQ", "Shortname": "QUALCOMM Incorporated" },
    { "Symbol": "INTU:NASDAQ", "Shortname": "Intuit Inc." },
    { "Symbol": "AMAT:NASDAQ", "Shortname": "Applied Materials, Inc." },
    { "Symbol": "VZ:NYSE", "Shortname": "Verizon Communications Inc." },
    { "Symbol": "IBM:NYSE", "Shortname": "International Business Machines" },
    { "Symbol": "AXP:NYSE", "Shortname": "American Express Company" },
    { "Symbol": "CMCSA:NASDAQ", "Shortname": "Comcast Corporation" },
    { "Symbol": "INTC:NASDAQ", "Shortname": "Intel Corporation" },
    { "Symbol": "UBER:NYSE", "Shortname": "Uber Technologies, Inc." },
    { "Symbol": "TXN:NASDAQ", "Shortname": "Texas Instruments Incorporated" },
    { "Symbol": "NOW:NYSE", "Shortname": "ServiceNow, Inc." },
    { "Symbol": "BX:NYSE", "Shortname": "Blackstone Inc." },
    { "Symbol": "PFE:NYSE", "Shortname": "Pfizer, Inc." },
    { "Symbol": "MS:NYSE", "Shortname": "Morgan Stanley" },
    { "Symbol": "NKE:NYSE", "Shortname": "Nike, Inc." },
    { "Symbol": "PM:NYSE", "Shortname": "Philip Morris International Inc" },
    { "Symbol": "MU:NASDAQ", "Shortname": "Micron Technology, Inc." },
    { "Symbol": "UPS:NYSE", "Shortname": "United Parcel Service, Inc." },
    { "Symbol": "BKNG:NASDAQ", "Shortname": "Booking Holdings Inc. Common St" },
    { "Symbol": "BLK:NYSE", "Shortname": "BlackRock, Inc." },
    { "Symbol": "BA:NYSE", "Shortname": "Boeing Company (The)" },
    { "Symbol": "ABNB:NASDAQ", "Shortname": "Airbnb, Inc." },
    { "Symbol": "CB:NYSE", "Shortname": "Chubb Limited" },
    { "Symbol": "SBUX:NASDAQ", "Shortname": "Starbucks Corporation" },
    { "Symbol": "PANW:NASDAQ", "Shortname": "Palo Alto Networks, Inc." },
    { "Symbol": "MAR:NASDAQ", "Shortname": "Marriott International" },
    { "Symbol": "CL:NYSE", "Shortname": "Colgate-Palmolive Company" },
    { "Symbol": "EQIX:NASDAQ", "Shortname": "Equinix, Inc." },
    { "Symbol": "PYPL:NASDAQ", "Shortname": "PayPal Holdings, Inc." },
    { "Symbol": "FDX:NYSE", "Shortname": "FedEx Corporation" },
    { "Symbol": "MNST:NASDAQ", "Shortname": "Monster Beverage Corporation" },
    { "Symbol": "MSI:NYSE", "Shortname": "Motorola Solutions, Inc." },
    { "Symbol": "COF:NYSE", "Shortname": "Capital One Financial Corporation" },
    { "Symbol": "HLT:NYSE", "Shortname": "Hilton Worldwide Holdings Inc." },
    { "Symbol": "MMM:NYSE", "Shortname": "3M Company" },
    { "Symbol": "FTNT:NASDAQ", "Shortname": "Fortinet, Inc." },
    { "Symbol": "GM:NYSE", "Shortname": "General Motors Company" },
    { "Symbol": "AIG:NYSE", "Shortname": "American International Group, I" },
    { "Symbol": "ADSK:NASDAQ", "Shortname": "Autodesk, Inc." },
    { "Symbol": "TFC:NYSE", "Shortname": "Truist Financial Corporation" },
    { "Symbol": "FORD:NASDAQ", "Shortname": "Ford Motor Company" },
    { "Symbol": "PSA:NYSE", "Shortname": "Public Storage" },
    { "Symbol": "COR:NYSE", "Shortname": "Cencora, Inc." },
    { "Symbol": "NUE:NYSE", "Shortname": "Nucor Corporation" },
    { "Symbol": "MCHP:NASDAQ", "Shortname": "Microchip Technology Incorporat" },
    { "Symbol": "KHC:NASDAQ", "Shortname": "The Kraft Heinz Company" },
    { "Symbol": "SRE:NYSE", "Shortname": "DBA Sempra" },
    { "Symbol": "LEN:NYSE", "Shortname": "Lennar Corporation" },
    { "Symbol": "AEP:NASDAQ", "Shortname": "American Electric Power Company" },
    { "Symbol": "KMB:NYSE", "Shortname": "Kimberly-Clark Corporation" },
    { "Symbol": "LULU:NASDAQ", "Shortname": "lululemon athletica inc." }
]