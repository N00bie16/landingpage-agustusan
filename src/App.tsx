import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SCRIPT_URL: string | undefined = import.meta.env.VITE_WEB_APP_URL;

type Competition = {
  id: number;
  name: string;
  min_usia: number;
  max_usia: number;
  image: string;
};

const competitions: Competition[] = [
  {
    id: 1,
    name: "Balap Karung",
    min_usia: 7,
    max_usia: 15,
    image: "/images/lomba balap karung-rbg.png",
  },
  {
    id: 2,
    name: "Lomba Kelereng",
    min_usia: 5,
    max_usia: 12,
    image: "/images/lomba kelereng-rbg.png",
  },
  {
    id: 3,
    name: "Makan Kerupuk",
    min_usia: 5,
    max_usia: 12,
    image: "/images/lomba makan kerupuk-rbg.png",
  },
  {
    id: 4,
    name: "Paku Dalam Botol",
    min_usia: 7,
    max_usia: 15,
    image: "/images/lomba masukin paku ke dalam botol-rbg.png",
  },
  {
    id: 5,
    name: "Tarik Tambang",
    min_usia: 16,
    max_usia: 50,
    image: "/images/lomba tarik tambang-rbg.png",
  },
];

export default function App() {
  const [selectedLomba, setSelectedLomba] = useState<Competition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama: "",
    whatsapp: "",
    alamat: "",
    usia: "",
  });

  const handleOpenModal = (lomba: Competition) => {
    setSelectedLomba(lomba);
    setIsModalOpen(true);
    setErrorMsg(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLomba(null);
    setFormData({ nama: "", whatsapp: "", alamat: "", usia: "" });
    setErrorMsg(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "usia") {
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLomba) return;

    const usia = parseInt(formData.usia);

    if (isNaN(usia)) {
      setErrorMsg("Usia harus berupa angka.");
      return;
    }
    if (usia < selectedLomba.min_usia || usia > selectedLomba.max_usia) {
      setErrorMsg(
        `Maaf, lomba ${selectedLomba.name} khusus untuk usia ${selectedLomba.min_usia} - ${selectedLomba.max_usia} tahun.`,
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (!SCRIPT_URL) {
        throw new Error("Script URL not configured.");
      }

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          nama_lomba: selectedLomba.name,
          nama_lengkap: formData.nama,
          nomor_wa: formData.whatsapp,
          alamat: formData.alamat,
          usia: usia,
        }),
      });

      setToastMessage("Berhasil! Pendaftaran kamu sudah terdata.");
      handleCloseModal();

      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-red-200">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg whitespace-nowrap"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm sm:text-base">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="w-full md:w-full h-auto drop-shadow-2xl object-contain"
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

      <main className="max-w-4xl mx-auto px-4 mt-8 pb-10">
        <p className="text-xl md:text-2xl max-w-xl mx-auto font-bold font-poppins px-4 mt-2 text-center">
          Pilih cabang lombamu dan Daftar sekarang!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {competitions.map((lomba) => {
            return (
              <motion.div
                key={lomba.id}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleOpenModal(lomba)}
                className="p-1 hover:shadow-xl hover:shadow-red-500/20 border-transparent hover:border-red-100 active:bg-red-100 cursor-pointer transition-all flex flex-col group overflow-hidden rounded-2xl duration-300 ease-in-out"
              >
                <div className="relative w-full aspect-square overflow-hidden mt-2">
                  <motion.img
                    src={lomba.image}
                    alt={lomba.name}
                    className="w-full h-full object-contain p-2"
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 1.1, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                  {/* <div className="absolute inset-0 bg-linear-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                </div>

                <div className="flex-1 flex flex-col justify-between -mt-2">
                  <div className="mb-2 text-center">
                    <h3 className="font-extrabold text-xl md:text-2xl leading-tight mb-2 text-neutral-800 group-hover:text-red-600 transition-colors">
                      Daftar {lomba.name}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                      Usia {lomba.min_usia} - {lomba.max_usia} Thn
                    </span>
                  </div>

                  {/* <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-neutral-100 text-neutral-700 font-bold rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shadow-sm"
                  >
                    Daftar {lomba.name}
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button> */}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <footer className="bg-red-600 text-white py-4 mt-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <div>
            <h3 className="font-bold text-lg">Dirgahayu Republik Indonesia!</h3>
            <p className="text-sm text-red-200">
              Terus Melaju untuk Indonesia Maju.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end text-[10px] md:text-sm text-red-200 md:mt-0">
            <p>&copy; 2026 Panitia Agustusan. All rights reserved.</p>
            <p>Built by Khelasesa</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isModalOpen && selectedLomba && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-red-600 text-white p-5 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-bold leading-tight">
                    Pendaftaran Lomba
                  </h2>
                  <p className="text-red-100 text-sm font-medium mt-0.5">
                    {selectedLomba.name}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto">
                {errorMsg && (
                  <div className="mb-5 p-3.5 bg-red-50 text-red-700 rounded-xl flex items-start gap-2.5 border border-red-100">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium leading-relaxed">
                      {errorMsg}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="nama"
                      className="block text-sm font-semibold text-neutral-700 mb-1.5"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      required
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="block text-sm font-semibold text-neutral-700 mb-1.5"
                    >
                      Nomor WhatsApp/HP
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                      placeholder="08123456789"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="alamat"
                      className="block text-sm font-semibold text-neutral-700 mb-1.5"
                    >
                      Alamat
                    </label>
                    <input
                      type="text"
                      id="alamat"
                      name="alamat"
                      required
                      value={formData.alamat}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                      placeholder="Domisili atau Alamat RT/RW"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="usia"
                      className="block text-sm font-semibold text-neutral-700 mb-1.5"
                    >
                      Usia (Tahun)
                    </label>
                    <input
                      type="number"
                      id="usia"
                      name="usia"
                      required
                      min="1"
                      max="100"
                      value={formData.usia}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                      placeholder="Misal: 10"
                    />
                    <p className="text-xs text-neutral-500 mt-1.5 font-medium">
                      Batas usia lomba ini: {selectedLomba.min_usia} -{" "}
                      {selectedLomba.max_usia} Tahun
                    </p>
                  </div>

                  <div className="pt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                          Memproses...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
