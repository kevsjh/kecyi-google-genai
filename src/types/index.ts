import { AgentChatTypeEnum } from '@/constant/enum'
import { Message } from 'ai'




export interface Chat extends Record<string, any> {
    id: string
    title: string
    createdAt: Date
    userId: string
    path: string
    messages: Message[]
    sharePath?: string
    agentChatType: AgentChatTypeEnum
}

export interface IContentData {
    objectFullPath: string;
    uid: string;
    createdAt: Date;
    objectURL: string;
    id: string;
    userFilename: string;
    type: string;
}

export interface TransactionCopilotChat extends Record<string, any> {
    id: string
    title: string
    createdAt: Date
    userId: string
    path: string
    messages: Message[]
    sharePath?: string
    // agentChatType: AgentChatTypeEnum
}





export type ServerActionResult<Result> = Promise<
    | Result
    | {
        error: string
    }
>

export interface Session {
    user: {
        id: string
        email: string
    }
}



export interface ClientChatSnippet {

    id: string,
    title: string,
    agentChatType: AgentChatTypeEnum,
    uid: string,
    path: string

}




export interface StockGraphData {
    price: number;
    currency: string;
    date: string;
    volume: number;
}




export interface StockNews {
    title: string;
    articles: Article[];
}

interface Article {
    snippet: string;
    link: string;
    source: string;
    date: string;
    thumbnail?: string;
}




export interface IUserTransaction {
    id: string;
    when: Date;
    merchant: string;
    amount: number,
    currency: string;
    note: string;
    status: string;
    type: string;
    cardLast4: string;
}


export type AIProviderProps<AIState = any, UIState = any, Actions = any> = {
    children: React.ReactNode;
    initialAIState?: AIState;
    initialUIState?: UIState;
    /** $ActionTypes is only added for type inference and is never used at runtime **/
    $ActionTypes?: Actions;
};

export type AIProvider<AIState = any, UIState = any, Actions = any> = (
    props: AIProviderProps<AIState, UIState, Actions>,
) => Promise<React.ReactElement>;



export interface IUserInsuranceData {
    insuranceType: string;
    price: number;
    premium: boolean;
    id: string; // Optional for existing insurance (use existingId from purchaseInsurance function)
    createdAt: Date; // Optional server-generated timestamp (use FieldValue.serverTimestamp() in purchaseInsurance)
}


export interface IUserStockPortfolio {
    amount: number;
    createdAt: Date;

    id: string;
    numberOfShares: number;
    price: number;
    symbol: string;
}