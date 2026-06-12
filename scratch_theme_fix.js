const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'frontend', 'src', 'components', 'Layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

// 1. Layout Wrapper background
content = content.replace(
  `  return (
    <div className={\`min-h-screen flex transition-colors duration-300 \${
      isStudent ? 'bg-[#060814] text-slate-100' : 'bg-slate-50 text-slate-800'
    }\`}>`,
  `  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-slate-50 text-slate-800">`
);

// 2. Desktop Sidebar
content = content.replace(
  `      {/* Sidebar - Desktop */}
      <aside className={\`hidden md:flex flex-col w-64 shrink-0 fixed h-screen z-20 justify-between select-none \${
        isStudent 
          ? 'bg-[#0b0e17] border-r border-slate-900 text-slate-100' 
          : 'bg-slate-50 border-r border-slate-200 text-slate-800'
      }\`}>`,
  `      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 fixed h-screen z-20 justify-between select-none bg-slate-50 border-r border-slate-200 text-slate-800">`
);

// 3. Logo Brand
content = content.replace(
  `          {/* Logo Brand */}
          <div className={\`p-6 flex flex-col items-start gap-0.5 border-b \${
            isStudent ? 'border-slate-900' : 'border-slate-100'
          }\`}>
            <div className="flex items-center gap-2">
              <span className={\`font-extrabold text-xl tracking-tight font-sans \${isStudent ? 'text-white' : 'text-blue-900'}\`}>
                {isStudent ? 'UniSphere' : 'EduCore Enterprise'}
              </span>
            </div>`,
  `          {/* Logo Brand */}
          <div className="p-6 flex flex-col items-start gap-0.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight font-sans text-blue-900">
                {isStudent ? 'UniSphere' : 'EduCore Enterprise'}
              </span>
            </div>`
);

// 4. Navigation Links style
const originalNav = `            {navItems.map((item) => {
              const Icon = item.icon
              const isHash = item.path.startsWith('#')
              const isActive = isHash ? false : location.pathname === item.path
              
              let linkClass = ''
              let iconColor = ''
              
              if (isStudent) {
                // Dark premium space-theme capsule buttons
                const activeClass = 'bg-indigo-600/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 rounded-full font-bold'
                const inactiveClass = 'text-slate-400 border border-slate-800/80 hover:text-white hover:bg-slate-900/40 rounded-full transition-all font-semibold'
                linkClass = isActive ? activeClass : inactiveClass
                iconColor = isActive ? 'text-cyan-400' : 'text-slate-500'
              } else {
                // Light theme EduCore Enterprise buttons
                const activeClass = 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 rounded-r-xl font-bold'
                const inactiveClass = 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/50 rounded-xl transition-all font-semibold'
                linkClass = isActive ? activeClass : inactiveClass
                iconColor = isActive ? 'text-blue-600' : 'text-slate-400'
              }`;

const replacementNav = `            {navItems.map((item) => {
              const Icon = item.icon
              const isHash = item.path.startsWith('#')
              const isActive = isHash ? false : location.pathname === item.path
              
              const linkClass = isActive
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 rounded-r-xl font-bold'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/50 rounded-xl transition-all font-semibold'
              const iconColor = isActive ? 'text-blue-600' : 'text-slate-400'`;

content = content.replace(originalNav, replacementNav);

// 5. Sidebar Bottom Actions
const originalBottom = `        {/* Sidebar Bottom Actions */}
        <div className={\`p-4 space-y-3 border-t \${isStudent ? 'border-slate-900' : 'border-slate-200'}\`}>
          {isStudent ? (
            <>
              {/* Plan upgrade Card */}
              <div className="p-4 bg-[#121624]/60 border border-slate-900 rounded-2xl flex flex-col gap-2.5 shadow-sm">
                <div className="text-xs font-bold text-white">Student Plan: Basic</div>
                <button 
                  onClick={() => alert("Upgrade request sent to Academic Registry portal.")}
                  className="w-full bg-[#00d5ff] hover:bg-[#00c0e0] text-[#052530] text-[11px] font-black py-2 rounded-xl transition-all cursor-pointer text-center"
                >
                  Upgrade Plan
                </button>
              </div>
              
              {/* Profile Row */}
              <div className="flex items-center gap-3 pt-2 px-1">
                <img 
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                  className="h-9 w-9 rounded-full object-cover border border-slate-800" 
                  alt="Alex Johnson" 
                />
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs truncate">{user?.name || 'Alex Johnson'}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.department || 'Computer Science'}, Yr 3</p>
                </div>
              </div>

              {/* Sidebar bottom navigation actions (Support & Logout) for student */}
              <div className="space-y-1 mt-2">
                <button 
                  onClick={() => setActiveDrawer('student-affairs')}
                  className="w-full flex items-center gap-3.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-905 bg-slate-900/20 hover:bg-slate-900/50 transition-all cursor-pointer"
                >
                  <HelpCircle className="h-4.5 w-4.5 text-slate-500" />
                  <span>Support</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-955\/20 hover:text-rose-300 transition-all cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <button 
                  onClick={() => setActiveDrawer('student-affairs')}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
                  <span>Support</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}`;

const replacementBottom = `        {/* Sidebar Bottom Actions */}
        <div className="p-4 space-y-3 border-t border-slate-200">
          {isStudent ? (
            <>
              {/* Plan upgrade Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2.5 shadow-sm">
                <div className="text-xs font-bold text-slate-800">Student Plan: Basic</div>
                <button 
                  onClick={() => alert("Upgrade request sent to Academic Registry portal.")}
                  className="w-full bg-[#006680] hover:bg-[#00556c] text-white text-[11px] font-black py-2 rounded-xl transition-all cursor-pointer text-center"
                >
                  Upgrade Plan
                </button>
              </div>
              
              {/* Profile Row */}
              <div className="flex items-center gap-3 pt-2 px-1">
                <img 
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                  className="h-9 w-9 rounded-full object-cover border border-slate-200" 
                  alt="Alex Johnson" 
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-xs truncate">{user?.name || 'Alex Johnson'}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{user?.department || 'Computer Science'}, Yr 3</p>
                </div>
              </div>

              {/* Sidebar bottom navigation actions (Support & Logout) for student */}
              <div className="space-y-1 mt-2">
                <button 
                  onClick={() => setActiveDrawer('student-affairs')}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
                  <span>Support</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <button 
                  onClick={() => setActiveDrawer('student-affairs')}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
                  <span>Support</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}`;

content = content.replace(originalBottom, replacementBottom);

// 6. Header
const originalHeader = `        {/* Header */}
        <header className={\`sticky top-0 z-30 backdrop-blur-md h-16 px-4 md:px-8 flex items-center justify-between select-none border-b \${
          isStudent 
            ? 'bg-[#060814]/80 border-slate-900 text-slate-200' 
            : 'bg-white/80 border-slate-200 text-slate-800'
        }\`}>`;

const replacementHeader = `        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-md h-16 px-4 md:px-8 flex items-center justify-between select-none border-b bg-white/80 border-slate-200 text-slate-800">`;

content = content.replace(originalHeader, replacementHeader);

// 7. Mobile menu button
content = content.replace(
  `          {/* Mobile menu button */}
          <button 
            className={\`md:hidden p-2 rounded-xl transition-colors \${
              isStudent ? 'hover:bg-slate-900 text-slate-200' : 'hover:bg-slate-100 text-slate-850'
            }\`}`,
  `          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-xl transition-colors hover:bg-slate-100 text-slate-850"`
);

// 8. Search Input in Header
const originalSearch = `            {/* Search Input */}
            <div className="relative flex items-center w-full max-w-xs">
              <Search className={\`absolute left-3.5 h-4 w-4 \${isStudent ? 'text-slate-500' : 'text-slate-400'}\`} />
              <input 
                type="text" 
                placeholder={isStudent ? "Search courses, events, or resources..." : "Search systems, students, or logs..."} 
                className={\`w-full border rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none transition-all duration-200 \${
                  isStudent 
                    ? 'bg-[#0d111d] border-slate-900 text-white focus:border-cyan-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder-slate-400'
                }\`} />
            </div>`;

const replacementSearch = `            {/* Search Input */}
            <div className="relative flex items-center w-full max-w-xs">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={isStudent ? "Search courses, events, or resources..." : "Search systems, students, or logs..."} 
                className="w-full border rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none transition-all duration-200 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder-slate-400"
              />
            </div>`;

content = content.replace(originalSearch, replacementSearch);

// 9. Nav Links in Header
const originalHeaderLinks = `            {/* Nav Links */}
            <div className={\`flex gap-6 text-xs font-semibold \${isStudent ? 'text-slate-400' : 'text-slate-550'}\`}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('announcements'); }} className={\`transition-colors \${isStudent ? 'hover:text-white' : 'hover:text-slate-900'}\`}>Announcements</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('calendar'); }} className={\`transition-colors \${isStudent ? 'hover:text-white' : 'hover:text-slate-900'}\`}>Calendar</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('directory'); }} className={\`transition-colors \${isStudent ? 'hover:text-white' : 'hover:text-slate-900'}\`}>Directory</a>
            </div>`;

const replacementHeaderLinks = `            {/* Nav Links */}
            <div className="flex gap-6 text-xs font-semibold text-slate-550">
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('announcements'); }} className="transition-colors hover:text-slate-900 font-bold">Announcements</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('calendar'); }} className="transition-colors hover:text-slate-900 font-bold">Calendar</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('directory'); }} className="transition-colors hover:text-slate-900 font-bold">Directory</a>
            </div>`;

content = content.replace(originalHeaderLinks, replacementHeaderLinks);

// 10. Bell icon class
content = content.replace(
  `                className={\`p-2 rounded-xl transition-colors relative cursor-pointer \${
                  isStudent ? 'hover:bg-slate-900 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                }\`}`,
  `                className="p-2 rounded-xl transition-colors relative cursor-pointer hover:bg-slate-100 text-slate-400 hover:text-slate-700"`
);

// 11. Notifications Box
const originalNotifBox = `              {notificationsOpen && (
                <div className={\`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-3 duration-200 z-50 \${
                  isStudent ? 'bg-[#0c101d] border border-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-800'
                }\`}>
                  <div className={\`flex items-center justify-between mb-3 border-b pb-2 \${isStudent ? 'border-slate-800' : 'border-slate-100'}\`}>
                    <span className={\`font-bold text-xs \${isStudent ? 'text-white' : 'text-slate-900'}\`}>Notifications</span>
                    {unreadCount > 0 && (
                      <span className={\`text-[10px] font-bold \${isStudent ? 'text-cyan-400' : 'text-blue-600'}\`}>{unreadCount} Unread</span>
                    )}
                  </div>`;

const replacementNotifBox = `              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-3 duration-200 z-50 bg-white border border-slate-200 text-slate-800">
                  <div className="flex items-center justify-between mb-3 border-b pb-2 border-slate-100">
                    <span className="font-bold text-xs text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold text-blue-600">{unreadCount} Unread</span>
                    )}
                  </div>`;

content = content.replace(originalNotifBox, replacementNotifBox);

// 12. Notification items read state styling
content = content.replace(
  `                          className={\`p-2.5 rounded-xl text-[11px] transition-colors border border-transparent \${
                            n.isRead 
                              ? 'opacity-60 bg-transparent' 
                              : isStudent 
                                ? 'bg-indigo-950/20 border-l-2 border-l-cyan-400 text-white font-semibold'
                                : 'bg-blue-50/50 border-l-2 border-l-blue-600 text-slate-950 font-semibold'
                          }\`}
                          onClick={() => !n.isRead && readNotifMutation.mutate(n.id)}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className={\`font-bold \${isStudent ? 'text-white' : 'text-slate-900'}\`}>{n.title}</span>
                          </div>
                          <p className={\`mt-1 \${isStudent ? 'text-slate-300' : 'text-slate-600'}\`}>{n.message}</p>`,
  `                          className={\`p-2.5 rounded-xl text-[11px] transition-colors border border-transparent \${
                            n.isRead 
                              ? 'opacity-60 bg-transparent' 
                              : 'bg-blue-55/50 border-l-2 border-l-blue-600 text-slate-950 font-semibold'
                          }\`}
                          onClick={() => !n.isRead && readNotifMutation.mutate(n.id)}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-bold text-slate-900">{n.title}</span>
                          </div>
                          <p className="mt-1 text-slate-600">{n.message}</p>`
);

// 13. Bot / Mail icons
content = content.replace(
  `            <button
              onClick={() => setActiveDrawer('system-admin')}
              className={\`p-2 rounded-xl transition-colors cursor-pointer \${
                isStudent ? 'hover:bg-slate-900 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
              }\`}
            >
              <Bot className="h-4.5 w-4.5" />
            </button>

            {/* Messages Mail Icon */}
            <button
              onClick={() => alert("Mailbox is currently empty.")}
              className={\`p-2 rounded-xl transition-colors cursor-pointer \${
                isStudent ? 'hover:bg-slate-900 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
              }\`}`,
  `            <button
              onClick={() => setActiveDrawer('system-admin')}
              className="p-2 rounded-xl transition-colors cursor-pointer hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <Bot className="h-4.5 w-4.5" />
            </button>

            {/* Messages Mail Icon */}
            <button
              onClick={() => alert("Mailbox is currently empty.")}
              className="p-2 rounded-xl transition-colors cursor-pointer hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >`
);

// 14. User Profile Widget
content = content.replace(
  `            {/* User Profile Widget */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className={\`font-extrabold text-xs \${isStudent ? 'text-white' : 'text-slate-800'}\`}>{user?.name || 'Admin Chief'}</p>
                <p className={\`text-[9px] font-black tracking-wider uppercase mt-0.5 \${isStudent ? 'text-cyan-400' : 'text-emerald-600'}\`}>
                  {isAdmin ? 'LEVEL 4 ACCESS' : isFaculty ? 'FACULTY COORDINATOR' : 'STUDENT LEVEL 3'}
                </p>
              </div>
              <div className={\`h-9 w-9 rounded-full overflow-hidden border \${isStudent ? 'border-slate-800' : 'border-slate-200'}\`}>`,
  `            {/* User Profile Widget */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-extrabold text-xs text-slate-800">{user?.name || 'Admin Chief'}</p>
                <p className="text-[9px] font-black tracking-wider uppercase mt-0.5 text-blue-600">
                  {isAdmin ? 'LEVEL 4 ACCESS' : isFaculty ? 'FACULTY COORDINATOR' : 'STUDENT LEVEL 3'}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200">`
);

// 15. Drawer Container Panel
content = content.replace(
  `          {/* Drawer container panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className={\`w-screen max-w-md sm:max-w-lg border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 \${
              isStudent 
                ? 'bg-[#0b0e17] border-slate-900 text-slate-100' 
                : 'bg-white border-slate-200 text-slate-800'
            }\`}>`,
  `          {/* Drawer container panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md sm:max-w-lg border-l border-slate-200 bg-white text-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">`
);

// 16. Drawer Header
content = content.replace(
  `              {/* Header */}
              <div className={\`p-6 border-b flex items-center justify-between \${
                isStudent ? 'border-slate-900' : 'border-slate-100'
              }\`}>
                <div className="flex items-center gap-2">
                  {getDrawerIcon()}
                  <h3 className={\`font-extrabold text-base \${isStudent ? 'text-white' : 'text-slate-800'}\`}>{getDrawerTitle()}</h3>
                </div>
                <button 
                  onClick={() => {
                    setActiveDrawer(null)
                    setDrawerSearchQuery('')
                    setAdminActionStatus(null)
                    setAffairsSuccess(false)
                    setTranscriptRequestStatus(null)
                  }}
                  className={\`p-1.5 rounded-xl transition-colors \${
                    isStudent ? 'hover:bg-slate-900 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                  }\`}`,
  `              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDrawerIcon()}
                  <h3 className="font-extrabold text-base text-slate-800">{getDrawerTitle()}</h3>
                </div>
                <button 
                  onClick={() => {
                    setActiveDrawer(null)
                    setDrawerSearchQuery('')
                    setAdminActionStatus(null)
                    setAffairsSuccess(false)
                    setTranscriptRequestStatus(null)
                  }}
                  className="p-1.5 rounded-xl transition-colors hover:bg-slate-100 text-slate-450 hover:text-slate-700"`
);

// 17. Drawer Body and Footer
content = content.replace(
  `              {/* Scrollable Content */}
              <div className={\`flex-1 overflow-y-auto p-6 space-y-6 \${isStudent ? 'text-slate-300' : 'text-slate-700'}\`}>
                {renderDrawerContent()}
              </div>

              {/* Drawer Footer */}
              <div className={\`p-6 border-t text-center text-[10px] font-bold uppercase tracking-wider \${
                isStudent ? 'border-slate-900 bg-[#080b12] text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400'
              }\`}>`,
  `              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-700">
                {renderDrawerContent()}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 text-center text-[10px] text-slate-450 font-bold uppercase tracking-wider">`
);

// 18. Mobile Menu
content = content.replace(
  `      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className={\`relative flex flex-col w-64 h-full p-6 animate-in slide-in-from-left duration-200 \${
            isStudent ? 'bg-[#0b0e17] text-slate-100 border-r border-slate-900' : 'bg-slate-50 border-r border-slate-200 text-slate-800'
          }\`}>
            <div className="flex items-center justify-between mb-8">
              <span className={\`font-extrabold text-xl \${isStudent ? 'text-white' : 'text-blue-900'}\`}>UniSphere</span>
              <button onClick={() => setMobileMenuOpen(false)} className={\`p-1.5 rounded-xl \${
                isStudent ? 'hover:bg-slate-900 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
              }\`}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isHash = item.path.startsWith('#')
                const isActive = isHash ? false : location.pathname === item.path
                
                let linkClass = ''
                if (isStudent) {
                  linkClass = isActive 
                    ? 'bg-indigo-600/10 text-cyan-400 border border-cyan-500/20 rounded-full font-bold'
                    : 'text-slate-400 border border-slate-800/80 rounded-full font-semibold'
                } else {
                  linkClass = isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-bold' 
                    : 'text-slate-600 hover:bg-slate-100 rounded-xl'
                }

                return (
                  <Link
                    key={item.label}
                    to={isHash ? '#' : item.path}
                    onClick={(e) => {
                      setMobileMenuOpen(false)
                      if (isHash) {
                        e.preventDefault()
                        const drawerId = item.path.substring(1)
                        setActiveDrawer(drawerId)
                      }
                    }}
                    className={\`flex items-center gap-3 px-4 py-3 text-xs transition-all \${linkClass}\`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className={\`border-t pt-4 \${isStudent ? 'border-slate-900' : 'border-slate-200'}\`}>
              <button 
                onClick={handleLogout}
                className={\`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all \${
                  isStudent 
                    ? 'bg-rose-950/20 text-rose-400 hover:bg-rose-900/30'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                }\`}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}`,
  `      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="relative flex flex-col w-64 h-full p-6 animate-in slide-in-from-left duration-200 bg-slate-50 border-r border-slate-200 text-slate-800">
            <div className="flex items-center justify-between mb-8">
              <span className="font-extrabold text-xl text-blue-900">UniSphere</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isHash = item.path.startsWith('#')
                const isActive = isHash ? false : location.pathname === item.path
                
                const linkClass = isActive
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 rounded-r-xl font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/50 rounded-xl transition-all font-semibold';

                return (
                  <Link
                    key={item.label}
                    to={isHash ? '#' : item.path}
                    onClick={(e) => {
                      setMobileMenuOpen(false)
                      if (isHash) {
                        e.preventDefault()
                        const drawerId = item.path.substring(1)
                        setActiveDrawer(drawerId)
                      }
                    }}
                    className={\`flex items-center gap-3 px-4 py-3 text-xs transition-all \${linkClass}\`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="border-t pt-4 border-slate-200">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all bg-rose-50 text-rose-600 hover:bg-rose-100"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}`
);

// 19. Clean up inline drawer elements (dark-themed branches converted to light branches)
content = content.replace(/isStudent\s*\?\s*'bg-indigo-950\/20 border border-indigo-600\/30 text-emerald-400'\s*:\s*'bg-emerald-55 bg-emerald-50 border border-emerald-100 text-emerald-650'/g, "'bg-emerald-50 border border-emerald-100 text-emerald-700'");
content = content.replace(/isStudent\s*\?\s*'bg-indigo-950\/20 border border-indigo-600\/30 text-indigo-400'\s*:\s*'bg-blue-50 border border-blue-200 text-blue-605'/g, "'bg-blue-50 border border-blue-200 text-blue-600'");
content = content.replace(/isStudent\s*\?\s*'bg-indigo-955\/20 border border-indigo-600\/30 text-indigo-450'\s*:\s*'bg-blue-50 border border-blue-200 text-blue-600'/g, "'bg-blue-50 border border-blue-200 text-blue-600'");
content = content.replace(/isStudent\s*\?\s*'bg-emerald-955 bg-emerald-950\/20 border-emerald-600\/30 text-emerald-400'\s*:\s*'bg-emerald-50 border border-emerald-200 text-emerald-700'/g, "'bg-emerald-50 border border-emerald-200 text-emerald-700'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#121624\]\/60 border-slate-800\/80 hover:border-slate-700 text-white'\s*:\s*'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-850'/g, "'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#121624\]\/40 border-slate-800\/80'\s*:\s*'bg-slate-50 border-slate-200'/g, "'bg-slate-50 border-slate-200'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#121624\]\/60 border-slate-800\/80 text-white'\s*:\s*'bg-slate-50 border-slate-200 text-slate-850'/g, "'bg-slate-50 border-slate-200 text-slate-800'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#121624\]\/30 border-slate-800\/60'\s*:\s*'bg-slate-50 border-slate-200'/g, "'bg-slate-50 border-slate-200'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#0b0e17\] border-slate-800 text-white'\s*:\s*'bg-white border-slate-200 text-slate-850'/g, "'bg-white border-slate-200 text-slate-800'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#121624\]\/40 border-slate-800\/60 text-white'\s*:\s*'bg-slate-50 border-slate-200 text-slate-850'/g, "'bg-slate-50 border-slate-200 text-slate-800'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#121624\]\/60 border-slate-800\/80 text-white'\s*:\s*'bg-white border-slate-200 text-slate-850 shadow-sm'/g, "'bg-white border-slate-200 text-slate-800 shadow-sm'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#121624\]\/30 border-slate-800\/60 text-white'\s*:\s*'bg-white border-slate-200 text-slate-850 shadow-sm'/g, "'bg-white border-slate-200 text-slate-800 shadow-sm'");
content = content.replace(/isStudent\s*\?\s*'bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500'\s*:\s*'bg-\[#006680\] hover:bg-\[#00556c\] disabled:bg-slate-200 disabled:text-slate-400'/g, "'bg-[#006680] hover:bg-[#00556c] disabled:bg-slate-200 disabled:text-slate-400'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#121624\]\/30 border-slate-800\/60 text-white'\s*:\s*'bg-white border-slate-200 text-slate-850 shadow-sm'/g, "'bg-white border-slate-200 text-slate-800 shadow-sm'");
content = content.replace(/isStudent\s*\?\s*'bg-indigo-600\/10 hover:bg-indigo-600\/20 border-indigo-600\/20 text-indigo-400 hover:text-indigo-300'\s*:\s*'bg-\[#006680\]\/10 hover:bg-\[#006680\]\/20 border-blue-600\/25 text-blue-600'/g, "'bg-[#006680]/10 hover:bg-[#006680]/20 border border-[#006680]/20 text-[#006680]'");
content = content.replace(/isStudent\s*\?\s*'bg-indigo-950\/40 text-indigo-400 border-indigo-600\/20'\s*:\s*'bg-blue-50 text-blue-600 border-blue-205'/g, "'bg-blue-50 text-blue-600 border border-blue-200'");
content = content.replace(/isStudent\s*\?\s*'bg-indigo-905\/40 text-indigo-400 border-indigo-600\/20'\s*:\s*'bg-blue-50 text-blue-600 border-blue-200'/g, "'bg-blue-50 text-blue-600 border border-blue-200'");
content = content.replace(/isStudent\s*\?\s*'bg-indigo-900\/30 border border-indigo-600\/20 text-indigo-400'\s*:\s*'bg-\[#e6f2f5\] border border-\[#006680\]\/20 text-\[#006680\]'/g, "'bg-[#e6f2f5] border border-[#006680]/20 text-[#006680]'");
content = content.replace(/isStudent\s*\?\s*'bg-slate-900 hover:bg-slate-800 border-slate-850 text-slate-300'\s*:\s*'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'/g, "'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'");
content = content.replace(/isStudent\s*\?\s*'bg-slate-900 hover:bg-slate-800 border-slate-850'\s*:\s*'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'/g, "'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#121624\]\/20 border-slate-800\/40 text-slate-350'\s*:\s*'bg-slate-50 border border-slate-200 text-slate-700'/g, "'bg-slate-50 border border-slate-200 text-slate-700'");
content = content.replace(/isStudent\s*\?\s*'bg-indigo-500\/10 border-indigo-500\/20 text-slate-300'\s*:\s*'bg-blue-50 border-blue-100 text-slate-700'/g, "'bg-blue-50 border-blue-100 text-slate-700'");
content = content.replace(/isStudent\s*\?\s*'bg-indigo-505\/10 border-indigo-500\/20 text-slate-300'\s*:\s*'bg-blue-50 border-blue-100 text-slate-700'/g, "'bg-blue-50 border-blue-100 text-slate-700'");
content = content.replace(/isStudent\s*\?\s*'bg-\[#121624\]\/60 border-slate-800\/80 hover:border-slate-700 text-white'\s*:\s*'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-850'/g, "'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'");

// Text colors
content = content.replace(/isStudent \? 'text-white' : 'text-slate-900'/g, "'text-slate-900'");
content = content.replace(/isStudent \? 'text-slate-400' : 'text-slate-650'/g, "'text-slate-600'");
content = content.replace(/isStudent \? 'text-slate-400' : 'text-slate-550'/g, "'text-slate-500'");
content = content.replace(/isStudent \? 'text-slate-500' : 'text-slate-600'/g, "'text-slate-500'");
content = content.replace(/isStudent \? 'text-slate-300' : 'text-slate-750'/g, "'text-slate-750'");
content = content.replace(/isStudent \? 'text-white' : 'text-slate-800'/g, "'text-slate-800'");
content = content.replace(/isStudent \? 'text-slate-400' : 'text-slate-500'/g, "'text-slate-500'");
content = content.replace(/isStudent \? 'text-slate-300' : 'text-slate-700'/g, "'text-slate-700'");
content = content.replace(/isStudent \? 'text-cyan-400' : 'text-emerald-600'/g, "'text-emerald-600'");
content = content.replace(/isStudent \? 'border-slate-800' : 'border-slate-200'/g, "'border-slate-200'");
content = content.replace(/isStudent \? 'border-slate-900' : 'border-slate-100'/g, "'border-slate-100'");
content = content.replace(/isStudent \? 'border-slate-900' : 'border-slate-200'/g, "'border-slate-200'");

// Clean up remaining text variables/typos
content = content.replace(/text-slate-850/g, 'text-slate-800');
content = content.replace(/text-slate-650/g, 'text-slate-600');
content = content.replace(/text-slate-550/g, 'text-slate-500');

fs.writeFileSync(layoutPath, content, 'utf8');
console.log('Precise Layout.tsx update successful!');

// EventCard.tsx
const cardPath = path.join(__dirname, 'frontend', 'src', 'components', 'EventCard.tsx');
let cardContent = fs.readFileSync(cardPath, 'utf8');

// Always use light theme styling for cards
cardContent = cardContent.replace(
  `      variant={isStudent ? 'default' : 'glass'} 
      className={\`overflow-hidden flex flex-col h-full select-none border \${
        isStudent ? 'bg-white border-slate-200 shadow-sm rounded-3xl hover:border-slate-300' : 'border-slate-800/80'
      }\`}`,
  `      variant='default' 
      className="overflow-hidden flex flex-col h-full select-none border bg-white border-slate-200 shadow-sm rounded-3xl hover:border-slate-300"`
);
cardContent = cardContent.replace(
  `            <h4 className={\`font-black text-base tracking-tight truncate-2-lines line-clamp-2 min-h-[48px] \${
              isStudent ? 'text-slate-800' : 'text-slate-100'
            }\`}>`,
  `            <h4 className="font-black text-base tracking-tight truncate-2-lines line-clamp-2 min-h-[48px] text-slate-800">`
);
cardContent = cardContent.replace(
  `          {/* Description */}
          {!isStudent && (
            <p className="text-xs text-slate-300/90 line-clamp-3 mb-4">
              {event.description}
            </p>
          )}`,
  `          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-3 mb-4">
            {event.description}
          </p>`
);
cardContent = cardContent.replace(
  `          {/* Details list */}
          <div className={\`space-y-2 mb-5 text-xs font-semibold \${isStudent ? 'text-slate-500' : 'text-slate-300'}\`}>`,
  `          {/* Details list */}
          <div className="space-y-2 mb-5 text-xs font-semibold text-slate-500">`
);
cardContent = cardContent.replace(
  `              <Calendar className={\`h-4 w-4 shrink-0 \${isStudent ? 'text-[#006680]' : 'text-indigo-400'}\`} />`,
  `              <Calendar className="h-4 w-4 shrink-0 text-[#006680]" />`
);
cardContent = cardContent.replace(
  `              <MapPin className={\`h-4 w-4 shrink-0 \${isStudent ? 'text-[#006680]' : 'text-indigo-400'}\`} />`,
  `              <MapPin className="h-4 w-4 shrink-0 text-[#006680]" />`
);
cardContent = cardContent.replace(
  `              <Users className={\`h-4 w-4 shrink-0 \${isStudent ? 'text-[#006680]' : 'text-indigo-400'}\`} />`,
  `              <Users className="h-4 w-4 shrink-0 text-[#006680]" />`
);

fs.writeFileSync(cardPath, cardContent, 'utf8');
console.log('Precise EventCard.tsx update successful!');
