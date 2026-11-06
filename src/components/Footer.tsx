export default function Footer() {
  return (
    <footer className="bg-red-600 text-white py-4 mt-12">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <div>
          <h2 className="font-bold text-xl tracking-wide text-yellow-200">
            Dirgahayu Republik Indonesia!
          </h2>
          <p className="text-sm text-white">
            Terus Melaju untuk Indonesia Maju.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end text-[10px] md:text-sm text-white md:mt-0">
          <p>&copy; 2026 Panitia Agustusan. All rights reserved.</p>
          <p>Built by Khelasesa</p>
        </div>
      </div>
    </footer>
  );
}
