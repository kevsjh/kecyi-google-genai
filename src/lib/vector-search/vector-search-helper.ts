import { IdDocument, Restriction } from "@langchain/community/vectorstores/googlevertexai";
import { flatten } from "flat";
import * as uuid from "uuid";

type metadataType = {
    [key: string]: string | number | boolean | string[] | null;
};

export interface CrowdingTag {
    crowdingAttribute: string;
}

export interface IndexDocumentDatapoint {
    datapointId: string;
    featureVector: number[];
    restricts?: Restriction[];
    crowdingTag?: CrowdingTag;
    IdDocument: IdDocument;

}
export interface ICrawlPage {
    title: string
    source: string
    webSourceId: string
    description?: string
}




export class VectorStoreDocumentDataPoint {
    document: IdDocument;

    constructor(document: IdDocument) {
        this.document = document;
        if (!this.document.id) {
            // eslint-disable-next-line no-param-reassign
            this.document.id = uuid.v4();
        }
    }

    getStringArrays(
        prefix: string,

        m: Record<string, any>
    ): Record<string, string[]> {
        let ret: Record<string, string[]> = {};

        Object.keys(m).forEach((key) => {
            const newPrefix = prefix.length > 0 ? `${prefix}.${key}` : key;
            const val = m[key];
            if (!val) {
                // Ignore it
            } else if (Array.isArray(val)) {
                // Make sure everything in the array is a string
                ret[newPrefix] = val.map((v) => `${v}`);
            } else if (typeof val === "object") {
                const subArrays = this.getStringArrays(newPrefix, val);
                ret = { ...ret, ...subArrays };
            }
        });

        return ret;
    }



    cleanMetadata(documentMetadata: Record<string, any>): {
        [key: string]: string | number | boolean | string[] | null;
    } {

        const stringArrays: Record<string, string[]>
            = this.getStringArrays(
                "",
                documentMetadata
            );

        const flatMetadata: metadataType = flatten(documentMetadata);
        Object.keys(flatMetadata).forEach((key) => {
            Object.keys(stringArrays).forEach((arrayKey) => {
                const matchKey = `${arrayKey}.`;
                if (key.startsWith(matchKey)) {
                    delete flatMetadata[key];
                }
            });
        });

        const metadata: metadataType = {
            ...flatMetadata,
            ...stringArrays,
        };
        return metadata;


    }

    metadataToRestrictions(

        documentMetadata: Record<string, any>
    ): Restriction[] {

        // Record<string, string[]>

        const metadata = this.cleanMetadata(documentMetadata);

        const restrictions: Restriction[] = [];
        for (const key of Object.keys(metadata)) {
            // Make sure the value is an array (or that we'll ignore it)
            let valArray;
            const val = metadata[key];
            if (val === null) {
                valArray = null;
            } else if (Array.isArray(val) && val.length > 0) {
                valArray = val;
            } else {
                valArray = [`${val}`];
            }

            // Add to the restrictions if we do have a valid value
            if (valArray) {
                // Determine if this key is for the allowList or denyList
                const listType = "allowList";

                // Create the restriction
                const restriction: Restriction = {
                    namespace: key,
                    [listType]: valArray,
                };

                // Add it to the restriction list
                restrictions.push(restriction);
            }
        }
        return restrictions;
    }

    buildDatapoint(vector: number[],): IndexDocumentDatapoint {
        if (!this.document.id) {
            // eslint-disable-next-line no-param-reassign
            this.document.id = uuid.v4();
        }
        const ret: IndexDocumentDatapoint = {
            datapointId: this.document.id,
            featureVector: vector,
            IdDocument: this.document
        };
        const restrictions = this.metadataToRestrictions(this.document.metadata);
        if (restrictions?.length > 0) {
            ret.restricts = restrictions;
        }
        return ret;
    }
}