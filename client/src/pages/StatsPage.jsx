import { useState } from 'react'
import { STATS_DATA } from '../data/statsData'
import { StatsCard, CardLabel } from '../components/stats/StatsCard'
import FilterBar from '../components/stats/FilterBar'
import HeroStatCard from '../components/stats/HeroStatCard'
import MoodBar from '../components/stats/MoodBar'
import TrendingDestinationCard from '../components/stats/TrendingDestinationCard'
import FeedItem from '../components/stats/FeedItem'
import WorldExploration from '../components/stats/WorldExploration'
import DiscoveryActivityChart from '../components/stats/DiscoveryActivityChart'
import MoodDistributionChart from '../components/stats/MoodDistributionChart'

export default function StatsPage() {
  const [range, setRange] = useState('month')
  const data = STATS_DATA[range]

  return (
    <div className="min-h-screen">
      <header className="litl-page-header">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-2">Statistics</p>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Travel Insights</h1>
              <p className="text-sm text-slate-600 mt-2">
                Explore where LITL travelers are heading
              </p>
            </div>
            <FilterBar active={range} onChange={setRange} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Hero stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.hero.map((s) => (
            <HeroStatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DiscoveryActivityChart data={data.activity} />
          <MoodDistributionChart moods={data.moods} />
        </div>

        {/* Popular moods + Trending */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <StatsCard>
            <CardLabel>Popular moods</CardLabel>
            <div className="space-y-4">
              {data.moods.map((m) => (
                <MoodBar key={m.name} {...m} />
              ))}
            </div>
          </StatsCard>

          <StatsCard>
            <CardLabel>Trending destinations</CardLabel>
            <div className="grid grid-cols-1 gap-3">
              {data.trending.map((d) => (
                <TrendingDestinationCard key={d.city} {...d} />
              ))}
            </div>
          </StatsCard>

        </div>

        {/* World exploration */}
        <WorldExploration countriesCount={data.countriesCount} />

        {/* Recently discovered */}
        <StatsCard>
          <CardLabel>Recently discovered</CardLabel>
          <div>
            {data.feed.map((item, i) => (
              <FeedItem key={i} {...item} />
            ))}
          </div>
        </StatsCard>

      </main>
    </div>
  )
}
