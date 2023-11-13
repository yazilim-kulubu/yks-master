import { createRxDatabase, type RxDatabase } from "rxdb"
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie"
import { SoruSchema, type SoruCollection } from "./schemas/takip"


export type Database = RxDatabase<DatabaseCollections>
let dbPromise: Database | undefined = undefined

async function createDatabase() {
	const db = await createRxDatabase<DatabaseCollections>({
		name: "yksmaster",
		storage: getRxStorageDexie(),
	})

	await db.addCollections({
		soru: {
			schema: SoruSchema
		}
	})

	dbPromise = db
	return db
}

export const database = () => dbPromise ? dbPromise : createDatabase()

export type DatabaseCollections = {
	soru: SoruCollection
}

