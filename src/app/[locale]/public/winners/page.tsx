'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getWinners } from './actions';

// Define interfaces for our data structures
interface Winner {
  winner_id: number;
  full_name: string;
  employee_id: string;
  department: string;
}

interface AwardGroup {
  group_no: number | null;
  order_no: number | null;
  prize_id: string;
  prize_name: string;
  prize_signed_url: string | null;
  count: number;
  winners: Winner[];
}

function WinnersDisplay() {
  const searchParams = useSearchParams();
  const session = searchParams.get('session');
  const [groupedAwards, setGroupedAwards] = useState<AwardGroup[]>([]);
  const [sessionDisplayName, setSessionDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [videoSrc, setVideoSrc] = useState('/Fantasy_Sports.mp4');

  const getFontSizeForAward = (winnerCount: number) => {
    if (winnerCount > 50) {
      return 'text-[10px]';
    }
    if (winnerCount > 25) {
      return 'text-xs';
    }
    if (winnerCount > 10) {
      return 'text-sm';
    }
    return 'text-base';
  };

  const getTitleFontSize = (winnerCount: number) => {
    if (winnerCount > 50) {
        return 'text-lg';
    }
    if (winnerCount > 25) {
        return 'text-xl';
    }
    return 'text-2xl';
  }

  useEffect(() => {
    if (session === 'day') {
        setSessionDisplayName('รอบเช้า - Morning Session');
        setVideoSrc('/Fantasy_Sports.mp4');
    } else if (session === 'night') {
        setSessionDisplayName('รอบค่ำ - Night Session');
        setVideoSrc('/magic-harry.mp4');
    } else {
        setSessionDisplayName('ประกาศผลรางวัล');
        setVideoSrc('/Fantasy_Sports.mp4');
    }

    // Add CSS link
    let cssLink = document.querySelector('link[href="/box-glass-box.css"]');
    if (!cssLink) {
      cssLink = document.createElement('link');
      cssLink.setAttribute('rel', 'stylesheet');
      cssLink.setAttribute('href', '/box-glass-box.css');
      document.head.appendChild(cssLink);
    }

    async function fetchData() {
      if (session) {
        setLoading(true);
        try {
          const winnersData = await getWinners(session);
          
          const groups: { [key: string]: AwardGroup } = {};
          
          winnersData.forEach(winner => {
            if (!groups[winner.prize_id]) {
              groups[winner.prize_id] = {
                group_no: winner.group_no,
                order_no: winner.order_no,
                prize_id: winner.prize_id,
                prize_name: winner.prize_name,
                prize_signed_url: winner.prize_signed_url,
                count: 0,
                winners: [],
              };
            }
            groups[winner.prize_id].winners.push({
                winner_id: winner.winner_id,
                full_name: winner.full_name,
                employee_id: winner.employee_id,
                department: winner.department,
            });
            groups[winner.prize_id].count++;
          });

          // Sort winners within each group by employee_id
          Object.values(groups).forEach(group => {
            group.winners.sort((a, b) => a.employee_id.localeCompare(b.employee_id));
          });

          const sortedGroups = Object.values(groups).sort((a, b) => {
            const groupA = a.group_no ?? Infinity;
            const groupB = b.group_no ?? Infinity;
            if (groupA !== groupB) {
              return groupA - groupB;
            }
            const orderA = a.order_no ?? Infinity;
            const orderB = b.order_no ?? Infinity;
            return orderA - orderB;
          });

          setGroupedAwards(sortedGroups);

        } catch (error) {
            console.error("Failed to fetch winners", error);
        } finally {
            setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchData();
  }, [session]);

  return (
    <div className="w-screen relative">
      <video autoPlay muted loop id="bg-video-sum" className="absolute inset-0 w-full h-full object-cover z-0" playsInline key={videoSrc}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="overlay-all absolute inset-0 z-10"></div>
      <div className="relative z-20 h-full w-full flex flex-col">
        <header className="flex-shrink-0 text-center py-2 md:py-4">
        </header>
        <main className="flex-1 pb-4">
          <div className="h-full">
            <div className="session-box bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-2 md:p-4 lg:p-6 flex flex-col">
              <div className="session-header morning bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-2 md:p-3 mb-2 md:mb-4 flex-shrink-0">
                <h3 className="tx-header-day text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                  <i className="fa-regular fa-sun text-xl md:text-2xl"></i>
                  {sessionDisplayName}
                </h3>
              </div>
              <div className="session-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                  <div className="text-white text-center">Loading winners...</div>
                ) : groupedAwards.length > 0 ? (
                  groupedAwards.map(award => {
                    const fontSizeClass = getFontSizeForAward(award.count);
                    const titleFontSizeClass = getTitleFontSize(award.count);
                    return (
                      <div key={award.prize_id} className="bg-white/10 p-4 rounded-lg flex flex-col">
                        <h4 className={`${titleFontSizeClass} font-bold text-white mb-2`}>{award.prize_name}</h4>
                        <div className="overflow-y-auto">
                          <table className={`w-full text-white ${fontSizeClass}`}>
                            <thead className="sticky top-0 bg-white/20 backdrop-blur-sm">
                              <tr>
                                <th className="p-2 text-left">Employee ID</th>
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2 text-left">Department</th>
                              </tr>
                            </thead>
                            <tbody>
                              {award.winners.map(winner => (
                                <tr key={winner.winner_id} className="border-b border-white/10">
                                  <td className="p-2">{winner.employee_id}</td>
                                  <td className="p-2">{winner.full_name}</td>
                                  <td className="p-2">{winner.department}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-white text-center">No winners to display for this session.</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function WinnersPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WinnersDisplay />
        </Suspense>
    );
}
