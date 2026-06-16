import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setActiveMatch } from "../store/mathSlice.js";
import { useSocket } from "../../../shared/services/socket/useSocket.js";
import { useMatchesQuery } from "../../../shared/hooks/useQueries.js";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import PremiumSelect from "../../scorer-console/components/PremiumSelect.jsx";

export const LiveMatchHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeMatchId = useSelector((state) => state.match.activeMatchId);
  const reduxMatches = useSelector((state) => state.match.matchesList || []);
  const isSynced = useSelector((state) => state.match.isSynced);
  const { isConnected } = useSocket();

  // Fetch backend matches
  const { data: backendMatches = [], isLoading: matchesLoading } = useMatchesQuery();

  // Combine backend matches + Redux local matches for the dropdown
  const allMatchOptions = [
    // Backend matches (transformed already with teamA/teamB)
    ...backendMatches.map((m) => ({
      id: m._id || m.id,
      name: `${m.teamA?.shortName || m.team1?.shortName || "T1"} vs ${m.teamB?.shortName || m.team2?.shortName || "T2"}`,
      role: m.status || "UPCOMING",
      source: "backend",
    })),
    // Redux local matches (created via Create Custom Match)
    ...reduxMatches
      .filter((m) => !backendMatches.some((bm) => (bm._id || bm.id) === m.id))
      .map((m) => ({
        id: m.id,
        name: `${m.teamA?.name || m.teamA?.shortName || "Local A"} vs ${m.teamB?.name || m.teamB?.shortName || "Local B"}`,
        role: m.subtitle || "Local Match",
        source: "local",
      })),
  ];

  const handleMatchSelect = (matchId) => {
    // Check if it's a Redux local match
    const localMatch = reduxMatches.find((m) => m.id === matchId);
    if (localMatch) {
      dispatch(setActiveMatch(matchId));
      return;
    }

    // It's a backend match - navigate to the scoreboard route
    navigate(`/matches/${matchId}`);
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card mb-6 border border-white/5">
      <div className="flex items-center gap-4">
        {/* Brand Header */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold font-display bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            BoundaryLine
          </span>
          <div className="h-5 w-[1px] bg-white/20 hidden sm:block"></div>
        </div>

        {/* Match Select */}
        <div className="flex items-center gap-2 min-w-[220px]">
          {matchesLoading ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
              <span className="text-xs text-zinc-400 font-medium">Loading matches...</span>
            </div>
          ) : (
            <PremiumSelect
              id="match-selector"
              value={activeMatchId}
              onChange={handleMatchSelect}
              options={allMatchOptions}
              teamColorTheme="emerald"
              placeholder="Select a Match..."
            />
          )}
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold tracking-widest bg-red-950/40 border border-red-500/20 text-red-400 uppercase animate-pulse shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            Live
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-sans text-gray-400">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium bg-emerald-950/35 px-2.5 py-1 rounded-lg border border-emerald-500/10">
              <Wifi className="w-3.5 h-3.5" />
              Socket Connected
            </span>
          ) : (
            <span className="flex items-center gap-1 text-yellow-500 font-medium bg-yellow-950/35 px-2.5 py-1 rounded-lg border border-yellow-500/10">
              <WifiOff className="w-3.5 h-3.5" />
              Socket Offline
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSynced ? (
            <span className="flex items-center gap-1 bg-zinc-850 px-2.5 py-1 rounded-lg text-emerald-400 font-semibold uppercase border border-emerald-500/10">
              ⚡ Synced
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-zinc-850 px-2.5 py-1 rounded-lg text-yellow-500 font-semibold uppercase border border-yellow-500/10 animate-pulse">
              ☁ Pending Save
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMatchHeader;
