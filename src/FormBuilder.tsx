import * as React from 'react'
import { Fragment, useEffect, useState } from 'react'
import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	Text,
	Select,
	Button,
	Heading,
	Editable,
	EditablePreview,
	EditableInput,
	IconButton,
	Divider,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useToast,
} from '@chakra-ui/react'

import PreviewForm from './components/PreviewForm'

import { VscTrash } from 'react-icons/vsc'
import { IoAdd } from 'react-icons/io5'

import { FormType } from './interfaces'

const FormBuilder: React.FC = (): React.ReactElement => {
	const toast = useToast()

	const initialForm: FormType = {
		form: [
			{
				name: 'Section title',
				rows: [
					{
						columns: [
							{
								name: '',
								type: 'input',
								size: '1/4',
							},
						],
					},
				],
			},
		],
	}

	const [formData, setFormData] = useState<FormType>(initialForm)
	const [formName, setFormName] = useState<string>('')
	useEffect(() => {
		setFormData({
			form: [
				{
					name: 'Section title',
					rows: [
						{
							columns: [
								{
									name: '',
									type: 'input',
									size: '1/4',
								},
							],
						},
					],
				},
			],
		})
		setFormName('')
	}, [])

	const newSection = (sectionIndex: number): void => {
		const form = formData.form
		const newSection = initialForm.form[0]
		form.splice(sectionIndex + 1, 0, newSection)
		setFormData({ form })
	}

	const deleteSection = (sectionIndex: number): void => {
		const form = formData.form
		form.splice(sectionIndex, 1)
		setFormData({ form })
	}

	const newRow = (
		sectionIndex: number,
		isNewLine: boolean,
		rowIndex: number,
		columnIndex: number,
	): void => {
		const formClone = formData.form

		const rows = formData.form[sectionIndex].rows
		if (isNewLine) {
			const newLine = initialForm.form[0].rows[0]
			rows.splice(rowIndex + 1, 0, newLine)
			formClone[sectionIndex].rows = rows
			setFormData({ form: formClone })
		} else {
			const row = formData.form[sectionIndex].rows[rowIndex]
			const newLine = initialForm.form[0].rows[0].columns[0]
			row.columns.splice(columnIndex + 1, 0, newLine)
			formClone[sectionIndex].rows[rowIndex] = row
			setFormData({ form: formClone })
		}
	}

	const deleteRow = (
		sectionIndex: number,
		rowIndex: number,
		columnIndex: number,
	): void => {
		const formClone = formData.form

		const row = formClone[sectionIndex].rows[rowIndex].columns
		if (row.length === 1) {
			const rows = formData.form[sectionIndex].rows
			rows.splice(rowIndex, 1)
			formClone[sectionIndex].rows = rows
		} else {
			row.splice(columnIndex, 1)
			formClone[sectionIndex].rows[rowIndex].columns = row
		}
		setFormData({ form: formClone })
	}

	const changeFieldHandler = (
		sectionIndex: number,
		rowIndex: number,
		columnIndex: number,
		{
			target,
		}:
			| React.ChangeEvent<HTMLSelectElement>
			| React.ChangeEvent<HTMLInputElement>,
	): void => {
		const formClone = formData.form
		formClone[sectionIndex].rows[rowIndex].columns[columnIndex][target.name] =
			target.value
		setFormData({ form: formClone })
	}

	const handleChangeSectionName = (
		sectionIndex: number,
		newValue: string,
	): void => {
		const form = formData.form
		form[sectionIndex].name = newValue
		setFormData({ form })
	}

	const saveFormHandler = async (): Promise<void> => {
		if (!formName || formName.trim().length <= 0) {
			toast({
				position: 'top',
				description: 'Form name is required',
				status: 'error',
				duration: 5000,
				isClosable: true,
			})
			return
		}
		/*
		 *  Save the form
		 *  where ever you wish as json
		 *  POST /endpoint -d formData
		 */
		toast({
			position: 'top',
			description: `Success message`,
			status: 'success',
			duration: 5000,
			isClosable: true,
		})
		setFormData({
			form: [
				{
					name: 'Section title',
					rows: [
						{
							columns: [
								{
									name: '',
									type: 'input',
									size: '1/4',
								},
							],
						},
					],
				},
			],
		})
		setFormName('')
	}

	const isSameRowAllowed = (
		sectionIndex: number,
		rowIndex: number,
	): boolean => {
		const columns = formData.form[sectionIndex].rows[rowIndex].columns
		const rowSize = columns.reduce(
			(acc, curr) => acc + parseInt(curr.size.replace('/4', '')),
			0,
		)
		return rowSize < 4
	}

	const isAllowedSize = (
		sectionIndex: number,
		rowIndex: number,
		columnIndex: number,
		size: number,
	): boolean => {
		const columns = formData.form[sectionIndex].rows[rowIndex].columns
		const currentColumnSize = parseInt(
			columns[columnIndex].size.replace('/4', ''),
		)
		const rowSize =
			columns.reduce(
				(acc, curr) => acc + parseInt(curr.size.replace('/4', '')),
				0,
			) - currentColumnSize
		return size + rowSize <= 4 || columns.length === 1
	}
	return (
		<Flex direction="column" maxWidth="900px" margin="0 auto" py="22px">
			<Box
				bg="white"
				boxShadow="0 2px 12px rgba(0,0,0, .1)"
				borderRadius="3px"
				p="22px"
			>
				<Heading as="h1" fontSize="lg" color="gray.600">
					Form Builder
				</Heading>
				<Flex direction="column" mt="30px">
					<FormControl width="100%">
						<FormLabel htmlFor="formName" fontSize="sm" color="gray.600">
							Form name
						</FormLabel>
						<Input
							height="35px"
							fontSize="xs"
							boxShadow="0 2px 12px rgba(0,0,0, .1)"
							placeholder="Form name"
							name="formName"
							id="formName"
							size="sm"
							borderRadius="5px"
							bg="white"
							width="100%"
							maxWidth="300px"
							mb="20px"
							onChange={({
								target,
							}: React.ChangeEvent<HTMLInputElement>): void => {
								setFormName(target.value)
							}}
							value={formName || ''}
						/>
					</FormControl>
					{formData.form.map((section, sectionIndex) => (
						<Flex align="center" key={sectionIndex} mb="30px">
							<Flex
								direction="column"
								bg="white"
								boxShadow="0 2px 12px rgba(0,0,0, .1)"
								align="flex-start"
								padding="18px"
								width="100%"
								flex={1}
							>
								<Flex align="center">
									<Editable
										textAlign="left"
										value={section.name || ''}
										fontSize="sm"
										fontWeight="bold"
										color="gray.600"
										selectAllOnFocus
										placeholder="Section title"
										onChange={(newValue: string): void =>
											handleChangeSectionName(sectionIndex, newValue)
										}
									>
										<Flex direction="column">
											<Flex align="center">
												<EditablePreview />
												<EditableInput
													border="1px solid #E2E8F0"
													borderRadius="3px"
												/>
											</Flex>
											<Text fontSize="10px" color="gray.500" mt="-5px">
												Click on the section name to edit
											</Text>
										</Flex>
									</Editable>
								</Flex>
								{section.rows.map((row, rowIndex) => (
									<Fragment key={rowIndex}>
										{row.columns.map((column, columnIndex) => (
											<Flex
												align="flex-start"
												justify="space-between"
												mt="18px"
												width="100%"
												key={columnIndex}
											>
												<FormControl width="100%">
													<FormLabel
														htmlFor="name"
														fontSize="sm"
														color="gray.600"
													>
														Type
													</FormLabel>
													<Select
														height="35px"
														fontSize="xs"
														boxShadow="0 2px 12px rgba(0,0,0, .1)"
														placeholder="Type"
														name="type"
														size="sm"
														borderRadius="5px"
														onChange={(
															e: React.ChangeEvent<HTMLSelectElement>,
														): void =>
															changeFieldHandler(
																sectionIndex,
																rowIndex,
																columnIndex,
																e,
															)
														}
														defaultValue={column.type}
													>
														<option value="input">Input</option>
														<option value="textarea">Textarea</option>
														<option value="select">Select</option>
														<option value="radio">Radio buttons</option>
														<option value="checkbox">Checkbox</option>
													</Select>
												</FormControl>
												{['select', 'radio', 'checkbox'].includes(
													column.type,
												) && (
													<FormControl width="100%" ml="18px">
														<FormLabel
															htmlFor="name"
															fontSize="sm"
															color="gray.600"
														>
															Options
														</FormLabel>
														<Input
															placeholder="Options"
															height="35px"
															fontSize="xs"
															boxShadow="0 2px 12px rgba(0,0,0, .1)"
															name="options"
															borderRadius="5px"
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>,
															): void =>
																changeFieldHandler(
																	sectionIndex,
																	rowIndex,
																	columnIndex,
																	e,
																)
															}
															value={column.options || ''}
														/>
														<Text fontSize="sm" color="gray.500" ml="2px">
															Seprate by Comma(,)
														</Text>
													</FormControl>
												)}
												<FormControl width="100%" ml="18px">
													<FormLabel
														htmlFor="name"
														fontSize="sm"
														color="gray.600"
													>
														Name
													</FormLabel>
													<Input
														placeholder="Name"
														height="35px"
														fontSize="xs"
														boxShadow="0 2px 12px rgba(0,0,0, .1)"
														name="name"
														borderRadius="5px"
														onChange={(
															e: React.ChangeEvent<HTMLInputElement>,
														): void =>
															changeFieldHandler(
																sectionIndex,
																rowIndex,
																columnIndex,
																e,
															)
														}
														value={column.name || ''}
													/>
												</FormControl>

												<FormControl width="100%" ml="18px">
													<FormLabel
														htmlFor="name"
														fontSize="sm"
														color="gray.600"
													>
														Size
													</FormLabel>
													<Select
														height="35px"
														fontSize="xs"
														boxShadow="0 2px 12px rgba(0,0,0, .1)"
														name="size"
														size="sm"
														borderRadius="5px"
														onChange={(e): void =>
															changeFieldHandler(
																sectionIndex,
																rowIndex,
																columnIndex,
																e,
															)
														}
														defaultValue={column.size}
													>
														<option
															value="1/4"
															disabled={
																!isAllowedSize(
																	sectionIndex,
																	rowIndex,
																	columnIndex,
																	1,
																)
															}
														>
															1/4
														</option>
														<option
															value="2/4"
															disabled={
																!isAllowedSize(
																	sectionIndex,
																	rowIndex,
																	columnIndex,
																	2,
																)
															}
														>
															2/4
														</option>
														<option
															value="3/4"
															disabled={
																!isAllowedSize(
																	sectionIndex,
																	rowIndex,
																	columnIndex,
																	3,
																)
															}
														>
															3/4
														</option>
														<option
															value="4/4"
															disabled={
																!isAllowedSize(
																	sectionIndex,
																	rowIndex,
																	columnIndex,
																	4,
																)
															}
														>
															4/4
														</option>
													</Select>
												</FormControl>
												<Flex align="center" justify="space-between">
													<Menu>
														<MenuButton
															as={Button}
															bg="gray.600"
															color="white"
															height="35px"
															width="45px"
															minWidth="45px"
															boxShadow="0 2px 12px rgba(0,0,0, .1)"
															_hover={{ bg: 'gray.600' }}
															_active={{ bg: 'gray.600' }}
															ml="22px"
														>
															<IoAdd color="white" size={22} />
														</MenuButton>
														<MenuList>
															<MenuItem
																onClick={(): void =>
																	newRow(
																		sectionIndex,
																		false,
																		rowIndex,
																		columnIndex,
																	)
																}
																isDisabled={
																	!isSameRowAllowed(sectionIndex, rowIndex)
																}
															>
																Same row
															</MenuItem>
															<MenuItem
																onClick={(): void =>
																	newRow(
																		sectionIndex,
																		true,
																		rowIndex,
																		columnIndex,
																	)
																}
															>
																New row
															</MenuItem>
														</MenuList>
													</Menu>
													{columnIndex > 0 || rowIndex > 0 ? (
														<IconButton
															aria-label="Delete row"
															icon={<VscTrash color="white" size={22} />}
															fontSize="xs"
															fontWeight="bold"
															bg="gray.600"
															_hover={{ bg: 'gray.600' }}
															_active={{ bg: 'gray.600' }}
															height="35px"
															width="45px"
															minWidth="45px"
															boxShadow="0 2px 12px rgba(0,0,0, .1)"
															onClick={(): void =>
																deleteRow(sectionIndex, rowIndex, columnIndex)
															}
															ml="12px"
														/>
													) : (
														<></>
													)}
												</Flex>
											</Flex>
										))}
										{rowIndex < section.rows.length - 1 && (
											<Flex mt="20px" width="100%" flex={1} align="center">
												<Text fontSize="xs" color="gray.600" width="60px">
													New row
												</Text>
												<Divider
													borderColor="gray.600"
													orientation="horizontal"
													width="100%"
												/>
											</Flex>
										)}
									</Fragment>
								))}
							</Flex>
							<Flex direction="column" align="center" ml="12px">
								{sectionIndex > 0 && (
									<IconButton
										aria-label="Delete section"
										icon={<VscTrash color="white" size={22} />}
										fontSize="xs"
										fontWeight="bold"
										bg="gray.600"
										_hover={{ bg: 'gray.600' }}
										_active={{ bg: 'gray.600' }}
										height="35px"
										width="45px"
										minWidth="45px"
										boxShadow="0 2px 12px rgba(0,0,0, .1)"
										onClick={(): void => deleteSection(sectionIndex)}
									/>
								)}
								<IconButton
									aria-label="Add section"
									icon={<IoAdd color="white" size={22} />}
									color="white"
									fontSize="xs"
									fontWeight="bold"
									bg="gray.600"
									_hover={{ bg: 'gray.600' }}
									_active={{ bg: 'gray.600' }}
									height="35px"
									width="45px"
									minWidth="45px"
									boxShadow="0 2px 12px rgba(0,0,0, .1)"
									onClick={(): void => newSection(sectionIndex)}
									mt="8px"
								/>
							</Flex>
						</Flex>
					))}
					<Button
						onClick={(): Promise<void> => saveFormHandler()}
						width="200px"
						height="35px"
						size="sm"
						bg="green.400"
						color="white"
						_hover={{ bg: 'green.400' }}
						_focus={{ outline: 0, boxShadow: 'outline' }}
						alignSelf="flex-end"
					>
						Submit
					</Button>
				</Flex>
			</Box>
			<Box
				bg="white"
				boxShadow="0 2px 12px rgba(0,0,0, .1)"
				borderRadius="3px"
				p="22px"
				mt="20px"
			>
				<Heading g as="h1" fontSize="lg" color="gray.600" mb="20px">
					Form preview
				</Heading>
				<PreviewForm data={formData} />
			</Box>
		</Flex>
	)
}

export default FormBuilder
