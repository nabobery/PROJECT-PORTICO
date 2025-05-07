'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaPaperPlane,
} from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

const contactSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    subject: z
        .string()
        .min(5, { message: 'Subject must be at least 5 characters' }),
    message: z
        .string()
        .min(10, { message: 'Message must be at least 10 characters' }),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    })

    function onSubmit(data: ContactFormValues) {
        setIsSubmitting(true)

        // Simulate form submission
        setTimeout(() => {
            console.log(data)
            setIsSubmitting(false)
            form.reset()

            toast({
                title: 'Message sent!',
                description:
                    "Thanks for reaching out. I'll get back to you soon.",
            })
        }, 1500)
    }

    return (
        <section id="contact" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 text-sm font-medium text-primary mb-3"
                    >
                        <FaEnvelope size={18} />
                        <span>Contact</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-center font-heading"
                    >
                        Get In Touch
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={
                            isInView
                                ? { opacity: 1, width: 120 }
                                : { opacity: 0, width: 0 }
                        }
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-1 bg-primary"
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-muted-foreground text-center max-w-2xl mt-4"
                    >
                        Have a project in mind or want to discuss potential
                        collaboration? Feel free to reach out, and I&apos;ll get
                        back to you as soon as possible.
                    </motion.p>
                </div>

                <div
                    ref={ref}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={
                            isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -50 }
                        }
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <h3 className="text-2xl font-bold font-heading">
                            Contact Information
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                                    <FaEnvelope className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Email</h4>
                                    <a
                                        href="mailto:avinashchangrani99@gmail.com"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        avinashchangrani99@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                                    <FaMapMarkerAlt className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Location</h4>
                                    <p className="text-muted-foreground">
                                        Bengaluru, India
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* <div className="rounded-lg bg-muted p-6 border border-border">
              <h4 className="font-semibold mb-2">Availability</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Currently available for freelance projects and full-time opportunities.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Time</span>
                  <span className="text-sm text-primary font-medium">24-48 hours</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">New Projects</span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </div>
                </div>
              </div>
            </div> */}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={
                            isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: 50 }
                        }
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your email address"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Subject of your message"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Your message..."
                                                    className="min-h-[150px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full gap-2"
                                    disabled={isSubmitting}
                                    size="lg"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className="animate-spin h-4 w-4 text-primary-foreground"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span>Sending message...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="h-5 w-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
