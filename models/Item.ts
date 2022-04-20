export namespace Item {
	export interface Model {
		id: string,
		stock: {
			id: string,
			name: string,
			description?: string,
			imageUrl: string,
			barCode: string,
			unit?: {
				id?: string,
				name?: string
			},
			height: number,
			width: number,
			length: number,
			weight: number,
			category: {
				id: string,
				name: string,
				icon: string,
				displayOrder: number,
				deleted: boolean
			},
			attributeValue?: [
				{
					id: string,
					attribute: {
						id: string,
						name: string,
						description: string,
						icon: string,
						displayOrder: number,
						deleted: true
					},
					icon: string,
					displayOrder: number,
					value: string
				}
			],
			deleted: boolean
		},
		box: string,
		amount: number,
		value: number,
		sku: string,
		itemStatus: string
	}
}