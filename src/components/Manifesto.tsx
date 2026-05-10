import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const Manifesto: React.FC = () => (
  <section className="max-w-3xl mx-auto py-16 text-center" id="manifesto">
    <motion.h2
      className="text-2xl md:text-4xl font-display text-resonance-cream mb-8"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      custom={0}
    >
      Our Manifesto
    </motion.h2>
    <motion.p
      className="text-lg font-body italic text-resonance-muted mb-6"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      custom={1}
    >
      We built this for the unposted thought.
    </motion.p>
    <motion.div
      className="border-l-4 border-resonance-gold pl-4 text-resonance-cream"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      custom={2}
    >
      <p className="mb-4">
        The world has enough platforms for performance. We built one for presence. Resonance exists for the thoughts you almost deleted, the feelings you couldn't caption, and the parts of yourself you haven't introduced yet.
      </p>
      <p className="mb-4">
        We believe that sharing something true is an act of courage. And that the right space — quiet, intentional, without algorithmic noise — can hold that courage without cheapening it.
      </p>
      <p className="mb-4">
        Here, your expression is not content. It is signal. And signal deserves to travel to the people it will actually reach.
      </p>
      <p className="italic text-sm text-resonance-muted">
        Built with care. Designed to protect your depth. Free to join.
      </p>
    </motion.div>
  </section>
);

export default Manifesto;
