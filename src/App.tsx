import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Competition } from "@/data";

import { competitions } from "@/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";

const SCRIPT_URL: string | undefined = import.meta.env.VITE_WEB_APP_URL;

type AudioFile = {
  name: string;
  base64: string;
  type: string;
};

export default function App() {
  const [selectedLomba, setSelectedLomba] = useState<Competition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Ukuran file audio terlalu besar (Maks 10MB");
        setAudioFile(null);
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = (event.target?.result as string).split(",")[1];
        setAudioFile({
          name: file.name,
          base64: base64String,
          type: file.type,
        });
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    } else {
      setAudioFile(null);
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

    if (selectedLomba.requiresAudio && !audioFile) {
      setErrorMsg("Harap unggah file audio/lagu tari-tariannya");
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
          audio_name: audioFile ? audioFile.name : "",
          audio_base64: audioFile ? audioFile.base64 : "",
          audi0_mimeType: audioFile ? audioFile.type : "",
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

      <Header />

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
                role="button"
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

      <Footer />

      <Modal
        isModalOpen={isModalOpen}
        selectedLomba={selectedLomba}
        handleCloseModal={handleCloseModal}
        errorMsg={errorMsg}
        formData={formData}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
