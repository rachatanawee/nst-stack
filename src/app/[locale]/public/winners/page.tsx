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
  redemption_photo_path: string | null;
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

    // Enable scrolling for this page
    document.body.style.overflow = 'auto';

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
                redemption_photo_path: winner.redemption_photo_path,
                count: 0,
                winners: [],
              };
            }

            const winnerExists = groups[winner.prize_id].winners.some(w => w.winner_id === winner.winner_id);
            if (!winnerExists) {
                groups[winner.prize_id].winners.push({
                    winner_id: winner.winner_id,
                    full_name: winner.full_name,
                    employee_id: winner.employee_id,
                    department: winner.department,
                });
                groups[winner.prize_id].count++;
            }
          });

          // Sort winners within each group by employee_id
          Object.values(groups).forEach(group => {
            group.winners.sort((a, b) => a.employee_id.localeCompare(b.employee_id));
          });

          const sortedGroups = Object.values(groups).sort((a, b) => a.count - b.count);

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

    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, [session]);

  const uniqueGroupNos = [...new Set(groupedAwards.map(g => g.group_no))].sort((a, b) => (b ?? 0) - (a ?? 0));
  const top3GroupNos = uniqueGroupNos.slice(0, 3);
  const cardColors = ['bg-[#0168B7]/90', 'bg-[#0168B7]/40', 'bg-[#0168B7]/40'];
  const defaultCardColor = 'bg-white/10';

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
              <div className="session-header morning bg-gradient-to-r from-[#11116B] to-[#0168B7] rounded-xl p-2 md:p-3 mb-2 md:mb-4 flex-shrink-0">
                <h3 className="tx-header-day text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                  <i className="fa-regular fa-sun text-xl md:text-2xl"></i>
                  {sessionDisplayName}
                </h3>
              </div>
              <div className="session-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                  <div className="text-white text-center">Loading winners...</div>
                ) : groupedAwards.length > 0 ? (
                  groupedAwards.map((award) => {
                    const fontSizeClass = getFontSizeForAward(award.count);
                    const titleFontSizeClass = getTitleFontSize(award.count);
                    
                    const cardColorClass = 'bg-[#0168B7]/90';

                    return (
                      <div key={award.prize_id} className={`p-4 rounded-lg flex flex-col ${cardColorClass}`}>
                        <h4 className={`${titleFontSizeClass} font-bold text-[#FF7F50] mb-2 p-2`}>{award.prize_name} <span className="text-base font-normal text-white">({award.count})</span></h4>
                        <table className={`w-full text-white ${fontSizeClass}`}>
                          <thead className="bg-white/20 backdrop-blur-sm text-[#0168B7]">
                            <tr>
                              <th className="p-2 text-left">Emp.ID </th>
                              <th className="p-2 text-left">Name</th>
                              <th className="p-2 text-left">Department</th>
                            </tr>
                          </thead>
                            <tbody>
                              {award.winners.map(winner => (
                                <tr key={winner.winner_id} className="border-b border-white/10">
                                  <td className="p-2 text-xs">{winner.employee_id}</td>
                                  <td className="p-2 text-xs">{winner.full_name}</td>
                                  <td className="p-2 text-xs">{winner.department}</td>
                                </tr>
                              ))}
                            </tbody>
                        </table>
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
