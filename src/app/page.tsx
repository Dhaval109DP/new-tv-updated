'use client';

import { AppHeader } from '@/components/header';
import { Hero } from '@/components/Hero';
import { ContinueWatching } from '@/components/ContinueWatching';
import { CategoryCard } from '@/components/CategoryCard';
import { TrendingSection } from '@/components/TrendingSection';
import { AIRecommendations } from '@/components/AIRecommendations';
import { Archives } from '@/components/Archives';
import { Film, Tv, MonitorPlay, Video, Trophy } from "lucide-react";
import { DailymotionLogo } from '@/components/dailymotion-logo';
import { BollyzoneLogo } from '@/components/bollyzone-logo';
import { DesiCinemasLogo } from '@/components/desi-cinemas-logo';
import { PlayDesiLogo } from '@/components/play-desi-logo';
import { MessageBanner } from '@/components/widgets/MessageBanner';
import { CountdownTimers } from '@/components/widgets/CountdownTimers';
import { useDashboard } from '@/hooks/use-dashboard';

import { QuickNotes } from '@/components/widgets/QuickNotes';
import { TaskList } from '@/components/widgets/TaskList';
import { BookmarkBar } from '@/components/widgets/BookmarkBar';
import { CastedLinksWidget } from '@/components/widgets/CastedLinks';

const categories = [
// ... [Categories definition remains the same]
  {
    title: "Movies",
    platform: "Desi Cinemas",
    icon: Film,
    featuredContent: [
      { title: "Kalki 2898 AD" },
      { title: "Munjya" },
      { title: "Mr. & Mrs. Mahi" },
    ],
    link: "https://desicinemas.to/",
    logo: <DesiCinemasLogo />,
    gradient: "bg-gradient-to-br from-red-500/20 to-orange-500/20",
  },
  {
    title: "TV Shows",
    platform: "Bollyzone",
    icon: Tv,
    featuredContent: [
      { title: "Bigg Boss OTT 3" },
      { title: "Laughter Chefs" },
      { title: "Khatron Ke Khiladi 14" },
    ],
    link: "https://www.bollyzone.to/",
    logo: <BollyzoneLogo />,
    gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Web Series",
    platform: "PlayDesi!",
    icon: MonitorPlay,
    featuredContent: [
      { title: "Panchayat Season 3" },
      { title: "Kota Factory Season 3" },
      { title: "Gullak Season 4" },
    ],
    link: "https://playdesi.info/",
    logo: <PlayDesiLogo />,
    gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Videos",
    platform: "Dailymotion",
    icon: Video,
    featuredContent: [
      { title: "Latest News" },
      { title: "Sports Highlights" },
      { title: "Music Videos" },
    ],
    link: "https://www.dailymotion.com/au",
    logo: <DailymotionLogo />,
    gradient: "bg-gradient-to-br from-green-500/20 to-teal-500/20",
  },
  {
    title: "Sports",
    platform: "T-Flix",
    icon: Trophy,
    featuredContent: [
      { title: "Live Cricket" },
      { title: "Live Football" },
      { title: "Other Sports" },
    ],
    link: "https://tv.tflix.app/",
    gradient: "bg-gradient-to-br from-yellow-500/20 to-amber-500/20",
  },
];

const Index = () => {
  const { state } = useDashboard();
  const { widgetVisibility } = state.settings;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <Hero />
      <ContinueWatching />
      
      {widgetVisibility.announcements && <MessageBanner />}
      
      {/* New Widgets */}
      {widgetVisibility.quickLinks && <BookmarkBar />}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 container mx-auto">
        {widgetVisibility.tasks && <TaskList />}
        {widgetVisibility.notes && <QuickNotes />}
      </div>
      
      <section className="py-20 -mt-8 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => {
              // Apply overrides if any exist in state
              const override = state.categoryOverrides[category.title];
              if (override && override.visible === false) return null;
              
              const finalContent = override?.customFeaturedContent || category.featuredContent;
              
              return (
                <div key={index} className="animate-scale-in will-change-transform" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CategoryCard {...category} featuredContent={finalContent} />
                </div>
              );
            })}
            
            {state.customCategories.map((category, index) => {
              // Map icon string to component
              let IconComp = Film;
              if (category.icon === 'Tv') IconComp = Tv;
              else if (category.icon === 'MonitorPlay') IconComp = MonitorPlay;
              else if (category.icon === 'Video') IconComp = Video;
              else if (category.icon === 'Trophy') IconComp = Trophy;
              
              return (
                <div key={category.id} className="animate-scale-in will-change-transform" style={{ animationDelay: `${(categories.length + index) * 0.1}s` }}>
                  <CategoryCard 
                    title={category.title}
                    platform={category.platform}
                    icon={IconComp}
                    featuredContent={category.featuredContent}
                    link={category.link}
                    gradient={category.gradient}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {widgetVisibility.trending && <TrendingSection />}
      {widgetVisibility.aiRecommendations && <AIRecommendations />}
      <div className="container mx-auto px-6 mt-6 relative z-30">
        <CastedLinksWidget />
      </div>
      {widgetVisibility.archives && <Archives />}

      <footer className="py-12 border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            Your gateway to premium Desi entertainment
          </p>
        </div>
      </footer>

      {widgetVisibility.timers && <CountdownTimers />}
    </div>
  );
};

export default Index;
