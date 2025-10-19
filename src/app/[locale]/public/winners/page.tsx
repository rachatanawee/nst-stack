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

          // Sort winners within each group by winner_id
          Object.values(groups).forEach(group => {
            group.winners.sort((a, b) => a.winner_id - b.winner_id);
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
    <div className="h-screen w-screen relative overflow-hidden">
      <video autoPlay muted loop id="bg-video-sum" className="absolute inset-0 w-full h-full object-cover z-0" playsInline key={videoSrc}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="overlay-all absolute inset-0 z-10"></div>
      <div className="relative z-20 h-full w-full flex flex-col">
        <header className="flex-shrink-0 text-center py-4 md:py-8">
          
          
        </header>
        <main className="flex-1 overflow-y-auto pb-8">
          <div className="h-full">
            <div className="session-box bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 md:p-6 lg:p-8 h-full flex flex-col">
              <div className="session-header morning bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-3 md:p-4 mb-4 md:mb-6 flex-shrink-0">
                <h3 className="tx-header-day text-lg md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 md:gap-3">
                  <i className="fa-regular fa-sun text-xl md:text-2xl lg:text-3xl"></i>
                  {sessionDisplayName}
                </h3>
              </div>
              <div className="session-content grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                {loading ? (
                  <div className="text-white text-center">Loading winners...</div>
                ) : groupedAwards.length > 0 ? (
                  groupedAwards.map((award, awardIndex) => (
                    <div key={award.prize_id} className={`award-card bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 md:p-4 ${award.winners.length > 25 ? 'lg:col-span-2' : ''}`}>
                      <div className="award-header flex flex-col lg:flex-row gap-4 md:gap-6">
                        <div className="reward-card-all flex-shrink-0 mx-auto lg:mx-0">
                          <img className="image-award-all w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain rounded-lg" src={award.prize_signed_url || '/HOYA_logo.png'} alt={award.prize_name} onError={(e) => { e.currentTarget.src = '/HOYA_logo.png'; }} />
                        </div>
                        <div className="award-content flex-1">
                          <h4 className="award-title text-lg md:text-xl font-bold text-white mb-2 text-center lg:text-left">
                            {award.prize_name} <span className="txt-number-award text-blue-400">({award.count} รางวัล)</span>
                          </h4>
                          <div className="card-layout-nameemp grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                            {award.winners.map((winner, winnerIndex) => (
                              <div key={winner.winner_id} className="winner-card bg-white bg-opacity-30 rounded-lg p-1 md:p-2">
                                <div className="winner-info">
                                  <div className="align-t">
                                    <div className="winner-name text-white font-semibold text-xs mb-1">
                                      <i className={`fa-solid fa-circle icon-color-or mr-1`}></i>
                                      <span className="block md:inline">{winner.full_name}</span>
                                    </div>
                                    <div className="winner-position text-gray-200 text-xs">
                                      <span className="employee-id font-medium">{winner.employee_id}</span>
                                      <span className="block md:inline">{winner.department}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
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