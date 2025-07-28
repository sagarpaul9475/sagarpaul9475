import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Users, 
  BarChart3, 
  Play, 
  Award,
  Shield,
  Zap
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Cognitive Training",
      description: "Personalized exercises targeting attention, memory, executive function, and more."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "EEG Integration",
      description: "Real-time brain activity monitoring with neuro-feedback training."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Home Training",
      description: "Accessible cognitive training from the comfort of your home."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Professional Monitoring",
      description: "Clinicians can monitor progress and adjust training programs remotely."
    }
  ];

  const benefits = [
    "Improves attention span and focus",
    "Enhances memory retention",
    "Develops problem-solving skills",
    "Strengthens executive functions",
    "Provides real-time progress tracking",
    "Accessible for children with disabilities"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Cognitive Retraining
              <span className="text-blue-600 block">for Children</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive computerized program combining EEG neuro-feedback with home training 
              to help children with developmental disabilities improve their cognitive abilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Get Started
              </Link>
              <Link
                to="/about"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our integrated approach combines the latest technology with proven therapeutic methods 
              to deliver effective cognitive training for children with developmental disabilities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Transform Cognitive Development
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our evidence-based approach helps children with developmental disabilities 
                improve their cognitive skills through engaging, personalized training sessions.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="bg-green-100 p-1 rounded-full">
                      <Award className="w-4 h-4 text-green-600" />
                    </div>
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Start Your Journey Today
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of families who have already seen improvements in their 
                  children's cognitive abilities through our program.
                </p>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                >
                  Begin Training
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start your child's cognitive development journey with our comprehensive 
              training program designed specifically for children with disabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Get Started Free
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;