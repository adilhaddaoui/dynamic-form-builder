interface RowInterface {
	[key: string]: string
	name: string
	type: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'
	options?: string
	size: '1/4' | '2/4' | '3/4' | '4/4'
}

interface FormInterface {
	name: string
	rows: Array<{ columns: RowInterface[] }>
}

export type FormType = {
	form: Array<FormInterface>
}

export interface PreviewFormProps {
	data: FormType
}
