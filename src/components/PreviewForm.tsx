import {
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Checkbox,
	CheckboxGroup,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Radio,
	RadioGroup,
	Select,
} from '@chakra-ui/react'
import React from 'react'
import { PreviewFormProps } from '../interfaces'

const sizes = {
	'4/4': '100%',
	'3/4': '74%',
	'2/4': '48%',
	'1/4': '22%',
}

const PreviewForm: React.FC<PreviewFormProps> = ({
	data,
}: PreviewFormProps): React.ReactElement => {
	return (
		<Tabs variant="unstyled" size="lg" display="flex" alignItems="flex-start">
			<TabList display="flex" flexDirection="column" alignItems="flex-end">
				{data.form.map((section, sectionIndex) => (
					<Tab
						key={sectionIndex}
						bg="white"
						color="gray.600"
						fontWeight="bold"
						fontSize="md"
						minWidth="150px"
						minHeight="50px"
						borderRadius="5px"
						my="5px"
						_selected={{
							color: 'white',
							bg: 'gray.600',
							minWidth: '180px',
							minHeight: '60px',
						}}
					>
						{section.name}
					</Tab>
				))}
			</TabList>
			<TabPanels
				mt="5px"
				ml="8px"
				bg="white"
				color="gray.600"
				borderRadius="5px"
				width="100%"
				minHeight={60 + (50 * (data.form.length - 1) + 5 * data.form.length)}
				padding="25px 16px"
			>
				{data.form.map((section, sectionIndex) => (
					<TabPanel key={sectionIndex}>
						{section.rows.map((row, rowIndex) => (
							<Flex
								align="flex-start"
								justify="flex-start"
								key={rowIndex}
								mt={rowIndex > 0 ? '12px' : '0px'}
							>
								{row.columns.map((column, columnIndex) => {
									return ((): React.ReactElement => {
										switch (column.type) {
											case 'input':
												return (
													<FormControl
														ml="18px"
														key={columnIndex}
														width={sizes[column.size]}
														my="6px"
													>
														<FormLabel
															htmlFor={column.name}
															fontSize="sm"
															color="gray.600"
														>
															{column.name || 'Label'}
														</FormLabel>
														<Input
															placeholder={column.name || 'Placeholder'}
															height="35px"
															fontSize="xs"
															boxShadow="0 2px 12px rgba(0,0,0, .1)"
															name={column.name}
															borderRadius="5px"
														/>
													</FormControl>
												)
											case 'textarea':
												return (
													<FormControl
														ml="18px"
														key={columnIndex}
														width={sizes[column.size]}
														my="6px"
													>
														<FormLabel
															htmlFor={column.name}
															fontSize="sm"
															color="gray.600"
														>
															{column.name || 'Label'}
														</FormLabel>
														<Textarea
															placeholder={column.name || 'Placeholder'}
															height="35px"
															fontSize="xs"
															boxShadow="0 2px 12px rgba(0,0,0, .1)"
															name={column.name}
															borderRadius="5px"
														/>
													</FormControl>
												)
											case 'select':
												return (
													<FormControl
														width={sizes[column.size]}
														my="6px"
														ml="18px"
														key={columnIndex}
													>
														<FormLabel
															htmlFor={column.name}
															fontSize="sm"
															color="gray.600"
														>
															{column.name || 'Label'}
														</FormLabel>
														<Select
															height="35px"
															fontSize="xs"
															boxShadow="0 2px 12px rgba(0,0,0, .1)"
															name={column.name}
															size="sm"
															borderRadius="5px"
														>
															{column.options &&
																column.options
																	.split(',')
																	.map((option: string, index: number) => (
																		<option value={option} key={index}>
																			{option}
																		</option>
																	))}
														</Select>
													</FormControl>
												)
											case 'checkbox':
												return (
													<FormControl
														width={sizes[column.size]}
														my="6px"
														ml="18px"
														key={columnIndex}
													>
														<FormLabel
															htmlFor={column.name}
															fontSize="sm"
															color="gray.600"
														>
															{column.name || 'Label'}
														</FormLabel>
														<CheckboxGroup isInline name={column.name}>
															{column.options &&
																column.options
																	.split(',')
																	.map((option: string, index: number) => (
																		<Checkbox value={option} key={index}>
																			{option}
																		</Checkbox>
																	))}
														</CheckboxGroup>
													</FormControl>
												)
											case 'radio':
												return (
													<FormControl
														width={sizes[column.size]}
														my="6px"
														ml="18px"
														key={columnIndex}
													>
														<FormLabel
															htmlFor={column.name}
															fontSize="sm"
															color="gray.600"
														>
															{column.name || 'Label'}
														</FormLabel>
														<RadioGroup name={column.name} isInline>
															{column.options &&
																column.options
																	.split(',')
																	.map((option: string, index: number) => (
																		<Radio value={option} key={index}>
																			{option}
																		</Radio>
																	))}
														</RadioGroup>
													</FormControl>
												)
											default:
												return <></>
										}
									})()
								})}
							</Flex>
						))}
					</TabPanel>
				))}
			</TabPanels>
		</Tabs>
	)
}

export default PreviewForm
