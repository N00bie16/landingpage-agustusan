import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
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
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const appContent = document.getElementById("app-content") as HTMLElement | null;
    document.body.style.overflow = "hidden";
    appContent?.setAttribute("inert", "");
    appContent?.setAttribute("aria-hidden", "true");

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleDialogKeyDown);

    window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown);
      document.body.style.overflow = previousOverflow;
      appContent?.removeAttribute("inert");
      appContent?.removeAttribute("aria-hidden");
      previousActiveElement?.focus();
    };
  }, [isModalOpen]);

  return (
    <AnimatePresence>
      {isModalOpen && selectedLomba && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            aria-hidden="true"
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
          />

          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-dialog-title"
            aria-describedby="registration-dialog-description"
            className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="bg-red-600 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h2 id="registration-dialog-title" className="text-xl font-bold leading-tight">
                  Pendaftaran Lomba
                </h2>
                <p id="registration-dialog-description" className="text-white text-sm font-medium mt-0.5">
                  {selectedLomba.name}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Tutup formulir pendaftaran"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              {errorMsg && (
                <div id="registration-error" role="alert" className="mb-5 p-3.5 bg-red-50 text-red-700 rounded-xl flex items-start gap-2.5 border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">
                    {errorMsg}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                aria-describedby={errorMsg ? "registration-error" : undefined}
              >
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
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition-all"
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
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition-all"
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
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition-all"
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
                    value={formData.usia}
                    onChange={handleChange}
                    aria-describedby="age-limit"
                    aria-invalid={errorMsg?.includes("usia") ? "true" : undefined}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition-all"
                    placeholder="Misal: 10"
                  />
                  <p id="age-limit" className="text-xs text-neutral-500 mt-1.5 font-medium">
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
                      aria-required="true"
                      aria-invalid={errorMsg?.includes("audio") ? "true" : undefined}
                      aria-describedby="audio-requirement"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    <p id="audio-requirement" className="mt-1.5 text-xs text-neutral-500">
                      Wajib memilih satu file audio dengan ukuran maksimal 10 MB.
                    </p>
                  </div>
                )}

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                        Memproses...
                      </>
                    ) : (
                      "Daftar Sekarang"
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
