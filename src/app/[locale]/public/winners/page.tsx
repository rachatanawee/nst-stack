'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getWinners } from './actions';

// Define interfaces for our data structures
interface Winner {
  full_name: string;
  employee_id: string;
  department: string;
}

interface AwardGroup {
  group_no: number;
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

  useEffect(() => {
    if (session === 'day') {
        setSessionDisplayName('รอบเช้า - Morning Session');
    } else if (session === 'night') {
        setSessionDisplayName('รอบค่ำ - Night Session');
    } else {
        setSessionDisplayName('ประกาศผลรางวัล');
    }

    // Add CSS link
    let cssLink = document.querySelector('link[href="/box-glass-box.css"]');
    if (!cssLink) {
      cssLink = document.createElement('link');
      cssLink.setAttribute('rel', 'stylesheet');
      cssLink.setAttribute('href', '/box-glass-box.css');
      document.head.appendChild(cssLink);
    }
  }, [session]);

  useEffect(() => {
    async function fetchData() {
      if (session) {
        setLoading(true);
        try {
          const winnersData = await getWinners(session);
          
          const groups: { [key: number]: AwardGroup } = {};
          
          winnersData.forEach(winner => {
            if (!groups[winner.group_no]) {
              groups[winner.group_no] = {
                group_no: winner.group_no,
                prize_name: winner.prize_name,
                prize_signed_url: winner.prize_signed_url,
                count: 0,
                winners: [],
              };
            }
            groups[winner.group_no].winners.push({
                full_name: winner.full_name,
                employee_id: winner.employee_id,
                department: winner.department,
            });
            groups[winner.group_no].count++;
          });

          setGroupedAwards(Object.values(groups));
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
      <video autoPlay muted loop id="bg-video-sum" className="absolute inset-0 w-full h-full object-cover z-0" playsInline>
        <source src="/Fantasy_Sports.mp4" type="video/mp4" />
      </video>
      <div className="overlay-all absolute inset-0 z-10"></div>
      <div className="relative z-20 h-full w-full flex flex-col">
        <header className="flex-shrink-0 text-center py-4 md:py-8">
          <div className="header-logo-all flex items-center justify-center mb-4 md:mb-6">
            <div className="logo-all">
              <img src="/HOYA_logo.png" alt="HOYA Vision Care" className="w-32 md:w-48 lg:w-64 h-auto mx-auto" onError={(e) => { e.currentTarget.src = '/next.svg'; }} />
            </div>
          </div>
          
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
              <div className="session-content flex-1 overflow-y-auto space-y-4 md:space-y-6 lg:space-y-8">
                {loading ? (
                  <div className="text-white text-center">Loading winners...</div>
                ) : groupedAwards.length > 0 ? (
                  groupedAwards.map((award, awardIndex) => (
                    <div key={awardIndex} className="award-card bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 md:p-6">
                      <div className="award-header flex flex-col lg:flex-row gap-4 md:gap-6">
                        <div className="reward-card-all flex-shrink-0 mx-auto lg:mx-0">
                          <img className="image-award-all w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain rounded-lg" src={award.prize_signed_url || '/HOYA_logo.png'} alt={award.prize_name} onError={(e) => { e.currentTarget.src = '/HOYA_logo.png'; }} />
                        </div>
                        <div className="award-content flex-1">
                          <h4 className="award-title text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4 text-center lg:text-left">
                            {award.prize_name} <span className="txt-number-award text-blue-400">({award.count} รางวัล)</span>
                          </h4>
                          <div className="card-layout-nameemp grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                            {award.winners.map((winner, winnerIndex) => (
                              <div key={winnerIndex} className="winner-card bg-white bg-opacity-30 rounded-lg p-3 md:p-4">
                                <div className="winner-info">
                                  <div className="align-t">
                                    <div className="winner-name text-white font-semibold text-sm md:text-base lg:text-lg mb-1">
                                      <i className={`fa-solid fa-circle icon-color-or mr-1 md:mr-2`}></i>
                                      <span className="block md:inline">{winner.full_name}</span>
                                    </div>
                                    <div className="winner-position text-gray-200 text-xs md:text-sm">
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
