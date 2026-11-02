import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="relative bg-red-600 text-white overflow-hidden pb-4 pt-2 px-4">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-500 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-red-700 rounded-full blur-3xl opacity-50" />

      <div className="relative max-w-4xl mx-auto text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center flex-col"
        >
          <img
            src="/images/monumen-rbg.webp"
            alt="Garuda Pancasila"
            className="w-full md:w-full h-80 md:h-96 drop-shadow-2xl object-contain"
            referrerPolicy="no-referrer"
          />
          <p className="text-xl md:text-2xl text-yellow-200 max-w-xl mx-auto font-medium font-bebas px-4">
            Rayakan semangat kemerdekaan dengan mengikuti berbagai{" "}
            <br className="block md:hidden" />
            lomba seru!
          </p>
        </motion.div>
      </div>
    </header>
  );
}
