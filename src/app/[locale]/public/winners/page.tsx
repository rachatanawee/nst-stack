'use client';

import { useEffect } from 'react';

interface Winner {
  name: string;
  employeeId: string;
  position: string;
  color: string;
}

interface Award {
  title: string;
  count: number;
  image: string;
  winners: Winner[];
}

const morningAwards: Award[] = [
  {
    title: 'Gift Card Central ฿1,000',
    count: 5,
    image: '/GiftCard1000.png',
    winners: [
      { name: 'สมชาย ใจดี', employeeId: 'EMP001', position: 'ผู้จัดการฝ่ายขาย', color: 'icon-color-or' },
      { name: 'สมหญิง ขยัน', employeeId: 'EMP002', position: 'หัวหน้าแผนกการตลาด', color: 'icon-color-gr' },
      { name: 'วิชัย พัฒนา', employeeId: 'EMP003', position: 'ผู้ช่วยผู้อำนวยการ', color: 'icon-color-p' },
      { name: 'ประยุทธ สร้างสรรค์', employeeId: 'EMP004', position: 'นักพัฒนาระบบ', color: 'icon-color-gr' },
      { name: 'อรทัย คิดดี', employeeId: 'EMP005', position: 'นักวิเคราะห์ระบบ', color: 'icon-color-pu' },
    ],
  },
  {
    title: 'Smartwatch',
    count: 3,
    image: '/SW-1.png',
    winners: [
      { name: 'น้ำมล วิลัยภัค', employeeId: 'EMP093', position: 'ฝ่ายผลิต', color: 'icon-color-gr' },
      { name: 'พชร พงษ์ศักดิ์', employeeId: 'EMP037', position: 'นักวิเคราะห์ระบบ', color: 'icon-color-p' },
      { name: 'อครเดช เย็นใจ', employeeId: 'EMP245', position: 'จัดซื้อ จัดจ้าง', color: 'icon-color-pu' },
    ],
  },
  {
    title: 'พัดลม hatari',
    count: 5,
    image: '/พัดลมhatari1.png',
    winners: [
      { name: 'สุรชัย มั่นคง', employeeId: 'EMP006', position: 'พนักงานฝ่ายผลิต', color: 'icon-color-pu' },
      { name: 'มานี รักงาน', employeeId: 'EMP007', position: 'พนักงานฝ่ายคุณภาพ', color: 'icon-color-or' },
      { name: 'วิไล ทำดี', employeeId: 'EMP008', position: 'พนักงานฝ่ายสนับสนุน', color: 'icon-color-or' },
      { name: 'สมศรี ใส่ใจ', employeeId: 'EMP009', position: 'พนักงานฝ่ายบริการ', color: 'icon-color-gr' },
      { name: 'นฤมล ชัยชาญ', employeeId: 'EMP087', position: 'บัญชี', color: 'icon-color-p' },
    ],
  },
];

export default function WinnersPage() {
  useEffect(() => {
    // Set page title and meta description
    document.title = 'ประกาศผลรางวัล - Hoya Event';

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'ประกาศผลรางวัลผู้โชคดีในงานเลี้ยงปีใหม่ Hoya');

    // Add CSS link
    let cssLink = document.querySelector('link[href="/box-glass-box.css"]');
    if (!cssLink) {
      cssLink = document.createElement('link');
      cssLink.setAttribute('rel', 'stylesheet');
      cssLink.setAttribute('href', '/box-glass-box.css');
      document.head.appendChild(cssLink);
    }
  }, []);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* วิดีโอพื้นหลัง */}
      <video
        autoPlay
        muted
        loop
        id="bg-video-sum"
        className="absolute inset-0 w-full h-full object-cover z-0"
        playsInline
      >
        <source src="/Fantasy_Sports.mp4" type="video/mp4" />
      </video>

      {/* ชั้นมืดซ้อนพื้นหลัง */}
      <div className="overlay-all absolute inset-0 z-10"></div>

      {/* Content Container - Full Screen */}
      <div className="relative z-20 h-full w-full flex flex-col">
        {/* Header - Fixed Height */}
        <header className="flex-shrink-0 text-center py-4 md:py-8">
          <div className="header-logo-all flex items-center justify-center mb-4 md:mb-6">
            <div className="logo-all">
              <img
                src="/HOYA_logo.png"
                alt="HOYA Vision Care"
                className="w-32 md:w-48 lg:w-64 h-auto mx-auto"
                onError={(e) => {
                  e.currentTarget.src = '/next.svg'; // Fallback to Next.js logo
                }}
              />
            </div>
          </div>
          <div className="badge">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-2">
              ประกาศผลรางวัล
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-gray-200">
              Award Announcement
            </p>
          </div>
        </header>

        {/* Main Content - Flexible Height */}
        <main className="flex-1 overflow-y-auto pb-8">
          <div className="h-full">
            {/* Morning Session - Full Height Container */}
            <div className="session-box bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 md:p-6 lg:p-8 h-full flex flex-col">
              <div className="session-header morning bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-3 md:p-4 mb-4 md:mb-6 flex-shrink-0">
                <h3 className="tx-header-day text-lg md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 md:gap-3">
                  <i className="fa-regular fa-sun text-xl md:text-2xl lg:text-3xl"></i>
                  รอบเช้า - Morning Session
                </h3>
              </div>

              <div className="session-content flex-1 overflow-y-auto space-y-4 md:space-y-6 lg:space-y-8">
                {morningAwards.map((award, awardIndex) => (
                  <div key={awardIndex} className="award-card bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 md:p-6">
                    <div className="award-header flex flex-col lg:flex-row gap-4 md:gap-6">
                      <div className="reward-card-all flex-shrink-0 mx-auto lg:mx-0">
                        <img
                          className="image-award-all w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain rounded-lg"
                          src={award.image}
                          alt={award.title}
                          onError={(e) => {
                            e.currentTarget.src = '/HOYA_logo.png'; // Fallback image
                          }}
                        />
                      </div>
                      <div className="award-content flex-1">
                        <h4 className="award-title text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4 text-center lg:text-left">
                          {award.title} <span className="txt-number-award text-blue-400">({award.count} รางวัล)</span>
                        </h4>
                        <div className="card-layout-nameemp grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                          {award.winners.map((winner, winnerIndex) => (
                            <div key={winnerIndex} className="winner-card bg-white bg-opacity-30 rounded-lg p-3 md:p-4">
                              <div className="winner-info">
                                <div className="align-t">
                                  <div className="winner-name text-white font-semibold text-sm md:text-base lg:text-lg mb-1">
                                    <i className={`fa-solid fa-circle ${winner.color} mr-1 md:mr-2`}></i>
                                    <span className="block md:inline">{winner.name}</span>
                                  </div>
                                  <div className="winner-position text-gray-200 text-xs md:text-sm">
                                    <span className="employee-id font-medium">{winner.employeeId}</span>
                                    <span className="block md:inline">{winner.position}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
