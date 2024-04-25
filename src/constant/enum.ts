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


export const customerServiceAgentSuggestionMessages = [
    {
        heading: 'What are the ',
        subheading: 'top credit cards',
        message: 'What are the best credit cards in singapore'
    },
    {
        heading: 'I want to purchase',
        subheading: 'stocks',
        message: 'I want to purchase stocks'
    }
]



export const liveAgentCopilotSuggestionMessages = [
    {
        heading: 'What does',
        subheading: 'FWD insurance policy cover',
        message: `What does FWD insurance policy cover`
    },
    {
        heading: 'What are the ',
        subheading: 'top credit cards',
        message: 'What are the best credit cards in singapore'
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
        heading: 'Report',
        subheading: 'Fraud Transaction',
        message: `report a fraud transaction`
    },
    {
        heading: 'Purchase Insurance',
        subheading: 'Travel Insurance',
        message: `purchase travel insurance`
    },

]