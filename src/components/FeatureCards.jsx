import React from 'react';
import { motion } from 'framer-motion';

const featureCardsData = [
  {
    title: "Secure & Private Voting",
    description: "Leveraging cutting-edge encryption and blockchain principles to ensure every vote is secure, private, and tamper-proof. Your identity and choices remain protected."
  },
  {
    title: "Real-time Results & Analytics",
    description: "Witness election outcomes unfold live with our real-time results dashboard. Gain insights with advanced analytics, providing transparency and immediate feedback."
  },
  {
    title: "Intuitive User Interface",
    description: "Designed with simplicity in mind, our platform offers an exceptionally user-friendly experience, making voting accessible and straightforward for everyone, regardless of technical expertise."
  },
  {
    title: "Transparent & Verifiable Process",
    description: "Every action on our platform is meticulously logged and auditable, allowing for complete transparency and verification of election integrity from start to finish."
  },
  {
    title: "Multi-Platform Accessibility",
    description: "Access the voting platform from any device – desktop, tablet, or mobile. Our responsive design ensures a seamless experience across all screen sizes."
  },
  {
    title: "Dedicated Support & Resources",
    description: "We provide comprehensive support and resources to guide users and administrators. From FAQs to dedicated assistance, we are here to ensure a smooth election process."
  }
];

const descriptionVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: { opacity: 1, height: "auto", marginTop: "1rem", transition: { duration: 0.3, ease: "easeOut" } },
};

const cardVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.03, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)" }, // Adjusted shadow
};

const FeatureCards = () => {
  return (
    <section className="feature-cards-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="features-title"
      >
        Why Choose Our Platform?
      </motion.h2>
      <div className="feature-card-grid">
        {featureCardsData.map((card, index) => (
          <motion.div
            key={index}
            className={`feature-card feature-card-gradient-${(index % 6) + 1}`}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ delay: 0.5 + index * 0.15 }}
          >
            <h3>{card.title}</h3>
            <motion.p
              variants={descriptionVariants}
              initial="hidden"
              animate="hidden" /* Initially hidden */
              whileHover="visible" /* Becomes visible on hover */
            >
              {card.description}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards; 