import React, { useEffect, useRef, useState } from "react";
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
  const toastTimerRef = useRef<number | null>(null);
  const fileReadIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

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
    setAudioFile(null);
    fileReadIdRef.current += 1;
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
        setErrorMsg("Ukuran file audio terlalu besar (maksimal 10 MB).");
        setAudioFile(null);
        e.target.value = "";
        return;
      }
      if (!file.type.startsWith("audio/")) {
        setErrorMsg("File harus berupa audio.");
        setAudioFile(null);
        e.target.value = "";
        return;
      }

      const fileReadId = ++fileReadIdRef.current;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (fileReadId !== fileReadIdRef.current) return;
        const result = event.target?.result;
        if (typeof result !== "string") {
          setErrorMsg("File audio gagal dibaca. Silakan coba lagi.");
          return;
        }
        const separatorIndex = result.indexOf(",");
        if (separatorIndex === -1) {
          setErrorMsg("File audio gagal dikonversi. Silakan coba lagi.");
          return;
        }
        const base64String = result.slice(separatorIndex + 1);
        setAudioFile({
          name: file.name,
          base64: base64String,
          type: file.type,
        });
        setErrorMsg(null);
      };
      reader.onerror = () => {
        if (fileReadId === fileReadIdRef.current) {
          setErrorMsg("File audio gagal dibaca. Silakan coba lagi.");
        }
      };
      reader.readAsDataURL(file);
    } else {
      setAudioFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLomba || isSubmitting) return;

    const usia = Number(formData.usia);

    if (!Number.isInteger(usia)) {
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
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15_000);

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
        signal: controller.signal,
        body: JSON.stringify({
          nama_lomba: selectedLomba.name,
          nama_lengkap: formData.nama.trim(),
          nomor_wa: formData.whatsapp.trim(),
          alamat: formData.alamat.trim(),
          usia: usia,
          audio_name: audioFile ? audioFile.name : "",
          audio_base64: audioFile ? audioFile.base64 : "",
          audio_mimeType: audioFile ? audioFile.type : "",
        }),
      });

      setToastMessage("Berhasil! Pendaftaran kamu sudah terdata.");
      handleCloseModal();

      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      toastTimerRef.current = window.setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setErrorMsg("Permintaan terlalu lama. Silakan coba lagi.");
      } else {
        setErrorMsg("Terjadi kesalahan jaringan. Silakan coba lagi.");
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-red-200">
      <div id="app-content">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-red-700 focus:outline-none focus:ring-4 focus:ring-yellow-300"
        >
          Lewati ke konten utama
        </a>
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              role="status"
              aria-live="polite"
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

        <main
          id="main-content"
          tabIndex={-1}
          className="max-w-4xl mx-auto px-4 mt-8 pb-10 focus:outline-none"
        >
          <h1 className="text-xl md:text-2xl max-w-xl mx-auto font-bold font-poppins px-4 mt-2 text-center">
            Pilih cabang lombamu dan Daftar sekarang!
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {competitions.map((lomba) => {
              return (
                <motion.button
                  key={lomba.id}
                  type="button"
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleOpenModal(lomba)}
                  className="p-1 bg-transparent hover:shadow-xl hover:shadow-red-500/20 border-transparent hover:border-red-100 active:bg-red-100 cursor-pointer transition-all flex flex-col group overflow-hidden rounded-2xl duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
                >
                  <div className="relative w-full aspect-square overflow-hidden mt-2">
                    <motion.img
                      src={lomba.image}
                      alt=""
                      aria-hidden="true"
                      tabIndex={-1}
                      width="512"
                      height="512"
                      loading="lazy"
                      className="w-full h-full object-contain p-2"
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      whileTap={{ scale: 1.1, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 50 }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between -mt-2">
                    <div className="mb-2 text-center">
                      <span className="block font-extrabold text-xl md:text-2xl leading-tight mb-2 text-neutral-800 group-hover:text-red-600 transition-colors">
                        Daftar {lomba.name}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Usia {lomba.min_usia} - {lomba.max_usia} Thn
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </main>

        <Footer />
      </div>

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
