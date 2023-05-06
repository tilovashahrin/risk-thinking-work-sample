import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function MapData(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const results: any[] = []
    //process.cwd joins the current working directory to the path of the csv file
    const filePath = path.join(process.cwd(), 'public', 'sample_data.csv')
    
    const stream = fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.status(200).json(results)
        })
}