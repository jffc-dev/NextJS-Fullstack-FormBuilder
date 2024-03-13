'use client'

import { MdTextFields } from 'react-icons/md'
import { ElementsType, FormElement, FormElementInstance } from '../FormElements'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import useDesigner from '../hooks/useDesigner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Switch } from '../ui/switch'

const type: ElementsType = 'TextField'

const extraAttributes = {
  label: 'Text field',
  helperText: 'Helper text',
  required: false,
  placeHolder: 'Value here...'
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50)
})

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

const DesignerComponent = ({ elementInstance }: {elementInstance: FormElementInstance}) => {
  const element = elementInstance as CustomInstance
  const { label, required, placeHolder, helperText } = element.extraAttributes
  return (
    <div className='flex flex-col gap-2 w-full'>
      <Label>{label}
        {required && '*'}
      </Label>
      <Input readOnly disabled placeholder={placeHolder}/>
      {helperText && <p className='text-muted-foreground text-[0.8rem]'>{helperText}</p>}
    </div>
  )
}

const FormComponent = ({ elementInstance }: {elementInstance: FormElementInstance}) => {
  const element = elementInstance as CustomInstance
  const { label, required, placeHolder, helperText } = element.extraAttributes
  return (
    <div className='flex flex-col gap-2 w-full'>
      <Label>{label}
        {required && '*'}
      </Label>
      <Input placeholder={placeHolder}/>
      {helperText && <p className='text-muted-foreground text-[0.8rem]'>{helperText}</p>}
    </div>
  )
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

const PropertiesComponent = ({ elementInstance }: {elementInstance: FormElementInstance}) => {
  const element = elementInstance as CustomInstance
  const { updateElement } = useDesigner()
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  const applyChanges = (values: propertiesFormSchemaType) => {
    const { label, helperText, required, placeHolder } = values
    updateElement(element.id,
      {
        ...element,
        extraAttributes: {
          label,
          helperText,
          required,
          placeHolder
        }
      }
    )
  }

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)} className='space-y-3'
      onSubmit={(e) => { e.preventDefault() }}>
        <FormField
          control={form.control}
          name='label'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br/> It will be displayed above the field
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name='placeHolder'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
                />
              </FormControl>
              <FormDescription>
                The Placeholder of the field.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name='helperText'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper text</FormLabel>
              <FormControl>
                <Input {...field}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
                />
              </FormControl>
              <FormDescription>
                The Helper text of the field. <br/>
                It will be displayed below the field.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name='required'
          render={({ field }) => (
            <FormItem className='flex items-center justify-between rounded-lg
              border p-3 shadow-sm'>
              <div className='space-y-0.5'>
                <FormLabel>Required</FormLabel>

                <FormDescription>
                  The field is or not required. <br/>
                </FormDescription>
              </div>

              <FormControl>
                <Switch checked={field.value}
                  onCheckedChange={field.onChange}
                ></Switch>
              </FormControl>

              <FormMessage/>
            </FormItem>
          )}
          />
      </form>
    </Form>
  )
}

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: MdTextFields,
    label: 'Text Field'
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent
}