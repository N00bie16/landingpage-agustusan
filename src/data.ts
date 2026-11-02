export type Competition = {
  id: number;
  name: string;
  min_usia: number;
  max_usia: number;
  image: string;
  requiresAudio?: boolean;
};

export const competitions: Competition[] = [
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
  {
    id: 6,
    name: "Tari-tarian",
    min_usia: 5,
    max_usia: 50,
    image: "/images/lomba tarian-rbg.png",
    requiresAudio: true,
  },
];
