export namespace Item {
	export interface Model {
		id: string,
		stock: {
			id: string,
			name: string,
			description: string,
			imageUrl: string,
			barCode: string,
			unit: {
				id: 0,
				name: string
			},
			height: 0,
			width: 0,
			length: 0,
			weight: 0,
			category: {
				id: 0,
				name: string,
				icon: string,
				displayOrder: 0,
				deleted: true
			},
			attributeValue: [
				{
					id: 0,
					attribute: {
						id: string,
						name: string,
						description: string,
						icon: string,
						displayOrder: 0,
						deleted: true
					},
					icon: string,
					displayOrder: 0,
					value: string
				}
			],
			deleted: true
		},
		box: string,
		amount: number,
		value: number,
		sku: string,
		itemStatus: string
	}
}