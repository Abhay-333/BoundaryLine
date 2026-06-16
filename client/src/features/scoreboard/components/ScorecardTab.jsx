import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * ScorecardTab — shows batting/bowling scorecards.
 * Accepts optional `externalScores` and `externalMatch` from backend.
 * Falls back to Redux state for active scoring sessions.
 */
export const ScorecardTab = ({ externalScores = [], externalMatch }) => {
  const reduxMatch = useSelector((state) => state.match.currentMatch);

  // Try Redux first (active scoring session), then external backend scores
  // Redux state shape: state.match.currentMatch → { innings: [{ batters, bowlers }, ...] }
  const hasReduxInnings = reduxMatch?.innings?.[0]?.batters?.length > 0;
  const inningsData = useMemo(() => {
    if (hasReduxInnings) {
      return {
        fromRedux: true,
        match: reduxMatch,
        activeInnings: reduxMatch.innings[reduxMatch.currentInningsNum - 1],
      };
    }
    // Fallback: show innings summary from backend scores
    return { fromRedux: false, match: externalMatch, scores: externalScores };
  }, [hasReduxInnings, reduxMatch, externalScores, externalMatch]);

  if (inningsData.fromRedux) {
    const match = inningsData.match;
    const activeInnings = inningsData.activeInnings;

    return (
      <div className="flex flex-col gap-6 font-sans">
        {/* Batting Scorecard */}
        <div className="rounded-xl bg-zinc-950/40 border border-white/5 overflow-hidden">
          <div className="bg-zinc-900 px-4 py-3 border-b border-white/5 flex justify-between items-center">
            <span className="text-sm font-semibold text-white">{activeInnings.teamName} Batting</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {activeInnings.runs}/{activeInnings.wickets} ({activeInnings.overs}.{activeInnings.balls} Overs)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 font-medium">
                  <th className="px-4 py-3">Batter</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">R</th>
                  <th className="px-4 py-3 text-right">B</th>
                  <th className="px-4 py-3 text-right">4s</th>
                  <th className="px-4 py-3 text-right">6s</th>
                  <th className="px-4 py-3 text-right">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeInnings.batters.map((b) => {
                  const sr = b.battingStats && b.battingStats.balls > 0
                    ? ((b.battingStats.runs / b.battingStats.balls) * 100).toFixed(1)
                    : "0.0";
                  const isStriking = match.activeBatter1Id === b.playerId;
                  return (
                    <tr key={b.playerId}
                      className={`hover:bg-white/5 transition-colors duration-150 ${isStriking ? "bg-emerald-950/20" : ""}`}>
                      <td className="px-4 py-3.5 font-medium text-white flex items-center gap-1.5">
                        {b.name}{isStriking && <span className="text-emerald-400 font-extrabold animate-pulse">*</span>}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-500 leading-normal">
                        {b.battingStats?.isOut ? b.battingStats.howOut || "Out" : <span className="text-emerald-400 font-medium">Batting</span>}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-white">{b.battingStats?.runs || 0}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-zinc-400">{b.battingStats?.balls || 0}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-zinc-400">{b.battingStats?.fours || 0}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-zinc-400">{b.battingStats?.sixes || 0}</td>
                      <td className="px-4 py-3.5 text-right font-mono font-semibold text-zinc-400">{sr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-zinc-900/60 p-4 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-2 justify-between text-xs font-sans">
            <div className="text-zinc-400 flex gap-2">
              <span className="font-semibold text-zinc-300">Extras:</span>
              <span className="font-mono">{activeInnings.extras.total} (Wd {activeInnings.extras.wides}, Nb {activeInnings.extras.noBalls}, B {activeInnings.extras.byes}, Lb {activeInnings.extras.legByes})</span>
            </div>
            <div className="text-zinc-400">
              <span className="font-semibold text-zinc-300">Yet to bat:</span>{' '}
              {activeInnings.batters.filter(b => b.playerId !== match.activeBatter1Id && b.playerId !== match.activeBatter2Id && !b.battingStats?.isOut && (!b.battingStats || (b.battingStats.runs === 0 && b.battingStats.balls === 0))).map(b => b.name).join(", ") || "None"}
            </div>
          </div>
        </div>

        {/* Bowling Scorecard */}
        <div className="rounded-xl bg-zinc-950/40 border border-white/5 overflow-hidden">
          <div className="bg-zinc-900 px-4 py-3 border-b border-white/5 text-sm font-semibold text-white">
            {activeInnings.teamId === match.teamA.id ? match.teamB.name : match.teamA.name} Bowling
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 font-medium">
                <th className="px-4 py-3">Bowler</th>
                <th className="px-4 py-3 text-right">O</th>
                <th className="px-4 py-3 text-right">M</th>
                <th className="px-4 py-3 text-right">R</th>
                <th className="px-4 py-3 text-right">W</th>
                <th className="px-4 py-3 text-right">ECON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeInnings.bowlers.map((b) => {
                const totalOvers = b.bowlingStats ? `${b.bowlingStats.overs}.${b.bowlingStats.balls}` : "0.0";
                const totalOversFloat = b.bowlingStats ? b.bowlingStats.overs + b.bowlingStats.balls / 6 : 0;
                const econ = b.bowlingStats && totalOversFloat > 0 ? (b.bowlingStats.runsConceded / totalOversFloat).toFixed(2) : "0.00";
                const isActive = match.activeBowlerId === b.playerId;
                return (
                  <tr key={b.playerId} className={`hover:bg-white/5 transition-colors duration-150 ${isActive ? "bg-cyan-950/20" : ""}`}>
                    <td className="px-4 py-3.5 font-medium text-white flex items-center gap-1.5">
                      {b.name}{isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-white">{totalOvers}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-zinc-400">{b.bowlingStats?.maidens || 0}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-rose-400">{b.bowlingStats?.runsConceded || 0}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-400">{b.bowlingStats?.wickets || 0}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-zinc-400">{econ}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Backend scores fallback: show innings summary ───
  const scores = inningsData.scores || [];
  if (scores.length === 0) {
    return (
      <div className="rounded-xl bg-zinc-950/40 border border-white/5 p-8 flex flex-col items-center justify-center text-center gap-2">
        <p className="text-sm text-zinc-500 font-semibold">No scorecard data yet</p>
        <p className="text-xs text-zinc-600">Score data will appear once the match is scored via the Scorer Console.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {scores.map((score, idx) => {
        const teamName = score.battingTeam?.name || score.battingTeam?.shortName || `Innings ${score.innings}`;
        const oversStr = score.overs || "0.0";
        return (
          <div key={idx} className="rounded-xl bg-zinc-950/40 border border-white/5 overflow-hidden">
            <div className="bg-zinc-900 px-4 py-3 border-b border-white/5 flex justify-between items-center">
              <span className="text-sm font-semibold text-white">
                {inningsLabel(idx)}: {teamName} Batting
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {score.score}/{score.wickets || 0} ({oversStr} Ov)
              </span>
            </div>
            <div className="p-4 flex flex-col gap-2 text-xs text-zinc-400">
              {score.runRate > 0 && <p>Run Rate: <span className="font-mono text-white">{score.runRate.toFixed(2)}</span></p>}
              {score.target && <p>Target: <span className="font-mono text-amber-400 font-bold">{score.target}</span></p>}
              <p className="text-zinc-600 italic mt-1">Detailed batter/bowler stats available after the match.</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Map backend innings index (0, 1) to a readable label.
 */
const inningsLabel = (idx) => {
  if (idx === 0) return "Innings 1";
  if (idx === 1) return "Innings 2";
  return `Innings ${idx + 1}`;
};

export default ScorecardTab;
