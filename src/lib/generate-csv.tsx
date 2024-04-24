import { ISearchFurnitureResponseItem } from '@/types';
import Papa from 'papaparse'



export function flattenFurnitureItems(data: ISearchFurnitureResponseItem[]) {
    return data.reduce((acc: any, item: ISearchFurnitureResponseItem) => {
        // Destructure to remove vertices and flatten visualMatches
        const { vertices, visualMatches, ...rest } = item;
        return acc.concat(...visualMatches.map((match) => {
            //    remove position and source_favicon 

            delete match.source_favicon
            delete match.position
            return ({ ...rest, ...match })
        }));
    }, []);
}

// export function flattenFurnitureItems(data: ISearchFurnitureResponseItem[]) {
//     return data.map((item) => {
//         const { vertices, ...rest } = item; // Destructure to remove vertices



//         return { item: { ...rest, visualMatches: item.visualMatches.flat() } }; // Flatten visualMatches
//     });
// }
export default function generateCSVData({ data }: { data: any }) {

    try {
        const res: string = Papa.unparse(data)
        return res
    } catch (err) {
        console.log(`Error generating CSV data: d${err}`)
        return undefined
    }


}


