import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, X } from "lucide-react";
import type { Competition } from "@/data";

interface ModalProps {
  isModalOpen: boolean;
  selectedLomba: Competition | null;
  handleCloseModal: () => void;
  errorMsg: string | null;
  formData: {
    nama: string;
    whatsapp: string;
    alamat: string;
    usia: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export default function Modal({
  isModalOpen,
  selectedLomba,
  handleCloseModal,
  errorMsg,
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  isSubmitting,
}: ModalProps) {
  return (
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

                {selectedLomba.requiresAudio && (
                  <div>
                    <label
                      htmlFor="audio"
                      className="block text-sm font-semibold text-neutral-700 mb-1.5"
                    >
                      Upload Audio/Musik Tarian (Maks 10MB)
                    </label>
                    <input
                      type="file"
                      id="audio"
                      name="audio"
                      accept="audio/*"
                      required
                      onChange={handleFileChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                  </div>
                )}

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
  );
}
