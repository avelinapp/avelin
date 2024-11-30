'use client'

import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@avelin/ui/cn'
import { Button, ButtonTooltipProps } from '@avelin/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@avelin/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@avelin/ui/popover'
import { forwardRef, useState } from 'react'

type ComboboxProps = {
  name?: string
  namePlural?: string
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  options?: Array<{ value: string; label: string; keywords?: string[] }>
  tooltip?: ButtonTooltipProps
}

export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      name = 'option',
      namePlural = 'options',
      value,
      onValueChange,
      disabled,
      options = [],
      tooltip,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false)

    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant='secondary'
            size='xs'
            role='combobox'
            aria-expanded={open}
            className='w-[200px] justify-between'
            disabled={disabled}
            tooltip={tooltip}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : `Select ${name}...`}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-fit min-w-[100px] p-0 shadow-lg border-color-border-subtle'
          align='start'
        >
          <Command>
            <CommandInput placeholder={`Search ${name}...`} />
            <CommandList>
              <CommandEmpty>No {namePlural} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    className='whitespace-nowrap'
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange?.(currentValue)
                      setOpen(false)
                    }}
                    keywords={option.keywords}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

Combobox.displayName = 'Combobox'
