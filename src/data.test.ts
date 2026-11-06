import { describe, expect, it } from "vitest";
import { competitions } from "./data";

describe("competition data", () => {
  it("provides the expected number of competitions", () => {
    expect(competitions).toHaveLength(6);
  });

  it("marks Tari-tarian as requiring audio", () => {
    const tari = competitions.find(
      (competition) => competition.name === "Tari-tarian",
    );

    expect(tari?.requiresAudio).toBe(true);
  });

  it("keeps each competition age range valid", () => {
    for (const competition of competitions) {
      expect(competition.min_usia).toBeGreaterThan(0);
      expect(competition.max_usia).toBeGreaterThanOrEqual(
        competition.min_usia,
      );
    }
  });
});
