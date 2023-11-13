import { toTypedRxJsonSchema, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema, type RxCollection } from "rxdb"

export const SoruSchemeLiteral = {
	title: "soru",
	description: "",
	version: 0,
	// keyCompression: true,
	primaryKey: "id",
	type: "object",
	properties: {
		id: {
			type: "string",
			maxLenght: 50
		},
		dogruSayisi: {
			type: "number"
		},
		yanlisSayisi: {
			type: "number"
		},
		bosSayisi: {
			type: "number"
		},
		ders: {
			type: "string"
		}
	},
	required: ["dogruSayisi", "yanlisSayisi", "bosSayisi"]
}

const schemaTyped = toTypedRxJsonSchema(SoruSchemeLiteral);

export type SoruType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const SoruSchema: RxJsonSchema<SoruType> = SoruSchemeLiteral;

export type SoruDocMethods = {

}

export type SoruCollectionMethods = {

}

export type SoruCollection = RxCollection<SoruType, SoruDocMethods, SoruCollectionMethods>

