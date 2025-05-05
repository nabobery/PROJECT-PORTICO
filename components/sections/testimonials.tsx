"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, MessageSquareQuote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const testimonials = [
  {
    quote: "Working with this developer was a game-changer for our project. Their technical expertise, attention to detail, and ability to solve complex problems made all the difference.",
    author: "Sarah Johnson",
    title: "Product Manager, TechInnovate",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
  },
  {
    quote: "Not only is their code clean and efficient, but they also brought innovative ideas that significantly improved our application's performance and user experience.",
    author: "Michael Chen",
    title: "CTO, WebSolutions Co.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    quote: "The level of communication and collaboration was exceptional. They understood our vision quickly and translated it into a flawless implementation that exceeded our expectations.",
    author: "Emily Rodriguez",
    title: "UI/UX Director, DesignFirm",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
  },
  {
    quote: "Their depth of knowledge in modern web technologies and ability to optimize performance made our application lightning fast. I'd work with them again in a heartbeat.",
    author: "David Park",
    title: "Engineering Lead, StartupX",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm font-medium text-primary mb-3"
          >
            <MessageSquareQuote size={18} />
            <span>Testimonials</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-center font-heading"
          >
            What People Say
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: 120 } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-primary"
          />
        </div>
        
        <div ref={ref} className="max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 pl-2 md:pl-4">
                  <TestimonialCard testimonial={testimonial} index={index} isInView={isInView} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious className="relative static transform-none" />
              <CarouselNext className="relative static transform-none" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index, isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
      className="h-full"
    >
      <Card className="h-full bg-background">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="mb-4 text-primary">
            <Quote className="h-8 w-8 opacity-80" />
          </div>
          
          <p className="italic text-muted-foreground mb-6 flex-grow">
            "{testimonial.quote}"
          </p>
          
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
              <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div>
              <h4 className="font-semibold">{testimonial.author}</h4>
              <p className="text-sm text-muted-foreground">{testimonial.title}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}