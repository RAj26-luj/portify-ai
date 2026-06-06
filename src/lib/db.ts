import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL!;

export const client = new MongoClient(uri);