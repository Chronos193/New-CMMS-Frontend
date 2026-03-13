import React from 'react';
import { motion } from 'framer-motion';


// --- Reusable Card Component ---
const LoginCard = ({ title, description, Icon, buttonText, onClick }) => {
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 },
        },
    };

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            // Crisp white card against the snow-blue background
            className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-shadow duration-300 flex flex-col items-center text-center group relative overflow-hidden"
        >
            {/* Soft indigo gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon container - starts with soothing blue/purple, fills on hover */}
            <div className="w-14 h-14 bg-indigo-50/80 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
                <Icon className="w-7 h-7" strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-3 relative z-10">{title}</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed flex-grow relative z-10">
                {description}
            </p>

            {/* Button - starts slate, bursts to indigo on hover */}
            <button
                onClick={onClick}
                className="w-full bg-slate-800 hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-300 relative z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                {buttonText}
            </button>
        </motion.div>
    );
};

export default LoginCard;
