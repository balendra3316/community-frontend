

"use client";

import React, { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

type LevelSpec = { level: number; points: number; name: string; color: string };

const LEVELS: LevelSpec[] = [
  { level: 1, points: 500, name: "Star Club Member", color: "bg-yellow-100 text-yellow-800" },
  { level: 2, points: 5_000, name: "Active Star", color: "bg-green-100 text-green-800" },
  { level: 3, points: 10_000, name: "Great Star", color: "bg-blue-100 text-blue-800" },
  { level: 4, points: 20_000, name: "Inspiring Star", color: "bg-purple-100 text-purple-800" },
  { level: 5, points: 30_000, name: "Torch Bearer", color: "bg-orange-100 text-orange-800" },
  { level: 6, points: 40_000, name: "Role Model", color: "bg-rose-100 text-rose-800" },
  { level: 7, points: 50_000, name: "Game Changer", color: "bg-teal-100 text-teal-800" },
  { level: 8, points: 80_000, name: "Catalyst Star", color: "bg-indigo-100 text-indigo-800" },
  { level: 9, points: 100_000, name: "Unstoppable Star", color: "bg-amber-100 text-amber-800" },
];

function numberWithCommas(n: number) {
  return n.toLocaleString("en-IN");
}

function formatDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function LevelStatus() {
  const { user } = useAuth();
  const points = (user as any)?.points ?? 0;
  const badges = (user as any)?.leaderboardBadges as { level: number; name: string; earnedAt: string }[] | undefined;

  const { currentSpec, nextSpec, progressPct, pointsToNext } = useMemo(() => {
    const currentSpec =
      LEVELS
        .slice()
        .reverse()
        .find(l => points >= l.points) || null;

    const nextSpec = LEVELS.find(l => !currentSpec || l.level === (currentSpec.level + 1)) || null;

    const floor = currentSpec?.points ?? 0;
    const cap = nextSpec?.points ?? floor;
    const span = Math.max(1, cap - floor);
    const progressPct = nextSpec ? Math.min(100, Math.floor(((points - floor) / span) * 100)) : 100;
    const pointsToNext = nextSpec ? Math.max(0, cap - points) : 0;

    return { currentSpec, nextSpec, progressPct, pointsToNext };
  }, [points]);

  const currentDisplayName = currentSpec
    ? badges?.find(b => b.level === currentSpec.level)?.name || currentSpec.name
    : "Not started";
  const nextDisplayName = nextSpec
    ? badges?.find(b => b.level === nextSpec.level)?.name || nextSpec.name
    : null;

  const currentColor =
    LEVELS.find(l => l.level === (currentSpec?.level ?? 0))?.color || "bg-gray-100 text-gray-800";
  const nextColor =
    LEVELS.find(l => l.level === (nextSpec?.level ?? 0))?.color || "bg-gray-100 text-gray-800";

  return (
     <section className="w-full">
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
     
        
          {/* Header row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className={`inline-flex items-center justify-center rounded-full w-12 h-12 md:w-14 md:h-14 text-lg font-semibold ${currentColor}`}>
                {currentSpec?.level ?? 0}
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Current level</div>
                <div className="text-base sm:text-lg md:text-xl font-semibold">
                  {currentSpec
                    ? `Level ${currentSpec.level} – ${currentDisplayName}`
                    : "Level 0 – Not started"}
                </div>
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-xs sm:text-sm text-gray-500">Total points</div>
              <div className="text-lg sm:text-xl md:text-2xl font-semibold">{numberWithCommas(points)}</div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] sm:text-xs text-gray-500 mb-1">
              <span>{currentSpec ? `${numberWithCommas(currentSpec.points)} pts` : "0 pts"}</span>
              <span>{nextSpec ? `${numberWithCommas(nextSpec.points)} pts` : "Max"}</span>
            </div>
            <div className="h-2.5 sm:h-3 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-[width] duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-gray-700">
                {nextSpec ? (
                  <>
                    Next:{" "}
                    <span className={`px-2 py-0.5 rounded ${nextColor}`}>
                      {`Level ${nextSpec.level} – ${nextDisplayName}`}
                    </span>
                  </>
                ) : (
                  <>Highest level reached</>
                )}
              </div>

              <div className="text-sm text-gray-600">
                {nextSpec ? (
                  <>
                    Need <span className="font-semibold">{numberWithCommas(pointsToNext)}</span> more points to reach Level {nextSpec.level}.
                  </>
                ) : (
                  <>No further levels.</>
                )}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-5">
            <div className="text-sm font-medium text-gray-800 mb-2">Earned badges</div>
            <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {badges?.length ? (
                badges
                  .slice()
                  .sort((a, b) => a.level - b.level)
                  .map(b => {
                    const spec = LEVELS.find(l => l.level === b.level);
                    const color = spec?.color ?? "bg-gray-100 text-gray-800";
                    return (
                      <div
                        key={`${b.level}-${b.earnedAt}`}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 ${color}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center rounded-full w-7 h-7 text-sm font-semibold bg-white/70 text-gray-900">
                            L{b.level}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium leading-5">{b.name}</span>
                            <span className="text-[11px] text-black/70 leading-4">
                              Earned {formatDate(b.earnedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <span className="text-sm text-gray-500">No badges yet.</span>
              )}
            </div>
          </div>
        
      </div>
    </section>
  );
}
