import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './contract.d';

const contractPath = path.join(__dirname, 'contract.json');
const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));

export const contract = contractFromJson<Contract>(contractJson);

export const db = postgres({
  contract,
  url: process.env['DATABASE_URL']!,
});
