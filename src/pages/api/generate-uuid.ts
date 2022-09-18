import { v4 as uuidv4 } from 'uuid';


import type { NextApiRequest, NextApiResponse } from "next";
export default function  handler(req: NextApiRequest, res: NextApiResponse) {
   return res.status(200).json(uuidv4());
}

