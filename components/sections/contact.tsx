'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Contact() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })

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
                        <form
                            action="https://formsubmit.co/avinashchangrani99@gmail.com"
                            method="POST"
                            className="space-y-6"
                        >
                            <input
                                type="hidden"
                                name="_subject"
                                value="New Contact Form Submission from Portfolio!"
                            />
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Your email address"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="subject"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Subject
                                </label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    placeholder="Subject of your message"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Your message..."
                                    className="min-h-[150px] resize-none"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full gap-2"
                                size="lg"
                            >
                                <FaPaperPlane className="h-5 w-5" />
                                <span>Send Message</span>
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
