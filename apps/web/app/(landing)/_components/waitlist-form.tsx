'use client'

import { api } from '@/lib/api'
import { delay } from '@/lib/utils'
import { CircleCheckBigIcon } from '@avelin/icons'
import { buttonVariants } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@avelin/ui/form'
import { inputVariants } from '@avelin/ui/input'
import { toast } from '@avelin/ui/sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'motion/react'
import { type RefObject, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { sectionVariants } from './variants'

const waitlistFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
})
type WaitlistFormSchema = z.infer<typeof waitlistFormSchema>

export function WaitlistForm({
  status,
  setStatus,
}: {
  status: 'idle' | 'submitting' | 'success' | 'error'
  setStatus: (status: 'idle' | 'submitting' | 'success' | 'error') => void
}) {
  // 1. Define your form.
  const form = useForm<WaitlistFormSchema>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: '',
    },
  })

  // 2. Define a submit handler.
  async function handleJoinWaitlist(values: WaitlistFormSchema) {
    setStatus('submitting')

    const start = performance.now()
    const { error } = await api.waitlist.join.post({
      email: values.email,
    })
    const elapsed = performance.now() - start

    if (error) {
      setStatus('idle')

      switch (error.status) {
        // @ts-ignore
        case 403:
          toast.error("We couldn't add you to the waitlist.", {
            description: 'Waitlist is disabled.',
          })
          break
        default:
          toast.error("We couldn't add you to the waitlist.", {
            description: 'Something went wrong.',
          })
          break
      }

      return
    }

    if (elapsed <= 2000) {
      await delay(3000 - elapsed)
    }

    setStatus('success')
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const content = useMemo(() => {
    switch (status) {
      case 'idle':
      case 'error':
        return (
          <FormView
            key="form"
            form={form}
            handleJoinWaitlist={handleJoinWaitlist}
          />
        )
      case 'submitting':
        return <SubmittingView key="submitting" />
      case 'success':
        return <SuccessView key="success" />
    }
  }, [status])

  return (
    <motion.div
      className="flex flex-col items-center gap-4 sm:gap-6 !tracking-normal *:!tracking-normal"
      variants={sectionVariants}
    >
      <div className="w-[50px] h-[1px] bg-color-border-subtle mb-9 sm:mb-5" />
      <span className="sm:text-xl text-lg text-white font-medium leading-none">
        Join the waitlist for early access.
      </span>
      <div className="flex flex-col gap-1 items-center text-color-text-quaternary">
        <span className="!tracking-normal">
          Our private alpha is launching soon.
        </span>
        <span className="!tracking-normal">
          We'll let you know when it's ready for you to join.
        </span>
      </div>
      <div className="w-[300px] sm:w-[400px] h-14 flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {content}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function FormView({
  handleJoinWaitlist,
  form,
  ref,
}: {
  handleJoinWaitlist: (values: WaitlistFormSchema) => Promise<void>
  form: ReturnType<typeof useForm<WaitlistFormSchema>>
  ref?: RefObject<HTMLDivElement>
}) {
  return (
    <motion.div
      ref={ref}
      className="flex gap-2 sm:gap-4 w-[300px] sm:w-[400px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleJoinWaitlist)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <motion.input
                    {...field}
                    className={cn(
                      inputVariants(),
                      'w-[225px] sm:w-[300px]',
                      'data-[error=true]:not-focus:ring-offset-1 data-[error=true]:ring-2 data-[error=true]:ring-red-7 data-[error=true]:bg-red-2',
                    )}
                    data-error={!!fieldState.error}
                    placeholder="Email address"
                    initial={{ opacity: 0, translateX: -15, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      translateX: 0,
                      scale: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      translateX: -15,
                      scale: 0.95,
                    }}
                    transition={{ ease: 'easeInOut' }}
                    style={{ borderRadius: 10, zIndex: '1' }}
                  />
                </FormControl>
                <FormMessage className="text-red-11" />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <motion.button
        layout
        layoutId="join-button"
        className={cn(
          buttonVariants({ variant: 'default' }),
          'bg-white group w-full flex-1',
        )}
        style={{ borderRadius: 10, zIndex: '2' }}
        type="submit"
        onClick={form.handleSubmit(handleJoinWaitlist)}
      >
        <motion.span
          // className="w-[50px]"
          layout="position"
          layoutId="join-button-text"
          exit={{ filter: 'blur(5px)' }}
        >
          Join
        </motion.span>
      </motion.button>
    </motion.div>
  )
}

export function SubmittingView({
  ref,
}: {
  ref?: RefObject<HTMLDivElement>
}) {
  return (
    <motion.div ref={ref} className="flex gap-4 w-[400px]">
      <motion.button
        layoutId="join-button"
        layout
        className={cn(
          buttonVariants({ variant: 'default' }),
          'bg-white group w-full flex-1 hover:bg-white',
        )}
        style={{ borderRadius: 10, zIndex: '2' }}
      >
        <motion.span
          className="w-[75px]"
          layout="position"
          layoutId="join-button-text"
          exit={{ filter: 'blur(5px)' }}
        >
          Joining...
        </motion.span>
      </motion.button>
    </motion.div>
  )
}

const CircleCheckIcon = motion.create(CircleCheckBigIcon)

export function SuccessView({ ref }: { ref?: RefObject<HTMLDivElement> }) {
  return (
    <motion.div ref={ref} className="flex gap-4 w-[400px]">
      <motion.button
        layoutId="join-button"
        layout
        className={cn(
          buttonVariants({ variant: 'default' }),
          'bg-green-9 group w-full flex-1 hover:bg-green-9 text-color-text-primary',
        )}
        style={{ borderRadius: 10, zIndex: '2' }}
      >
        <motion.span
          layout="position"
          layoutId="join-button-text"
          className="flex gap-2 items-center"
          exit={{ filter: 'blur(5px)' }}
        >
          <AnimatePresence>
            <motion.span key="text">You're on the waitlist.</motion.span>
            <CircleCheckIcon key="check" />
          </AnimatePresence>
        </motion.span>
      </motion.button>
    </motion.div>
  )
}
