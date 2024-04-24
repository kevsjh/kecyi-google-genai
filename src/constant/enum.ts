export enum AgentChatTypeEnum {
    STOCKAGENT = "STOCKAGENT",
    CUSTOMERSERVICE = "CUSTOMERSERVICE",
}


export const stockAgentSuggestionMessages = [
    {
        heading: 'List Trending Stocks',
        subheading: 'in the market',
        message: `List trending stocks`
    },
    {
        heading: 'What is the stock data',
        subheading: 'for Google',
        message: 'What is the stock data for Google'
    }
]



export const portfolioCopilotSuggestionMessages = [
    {
        heading: 'List Trending Stocks',
        subheading: 'in the market',
        message: `List trending stocks`
    },
    {
        heading: 'Show',
        subheading: 'my portfolio',
        message: 'Show my current portfolio'
    }
]




export const transactionCopilotSuggestionMessages = [
    {
        heading: 'Report Fraud Transaction',
        subheading: '',
        message: `report a fraud transaction`
    },
    {
        heading: 'Purchase Insurance',
        subheading: 'Travel Insurance',
        message: `purchase travel insurance`
    },

]