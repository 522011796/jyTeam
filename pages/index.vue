<template>
  <div class="home-page">
    <HeroSection />
    <StatusBarSection />
    <MissionTimelineSection />
    <PeopleSection />
    <FieldSection />
    <JournalPreviewSection />
    <NextCallSection />
  </div>
</template>

<script>
import HeroSection from '@/components/home/HeroSection.vue'
import StatusBarSection from '@/components/home/StatusBar.vue'
import MissionTimelineSection from '@/components/home/MissionTimeline.vue'
import PeopleSection from '@/components/home/PeopleSection.vue'
import FieldSection from '@/components/home/FieldSection.vue'
import JournalPreviewSection from '@/components/home/JournalPreview.vue'
import NextCallSection from '@/components/home/NextCallSection.vue'

export default {
  name: 'HomePage',
  components: {
    HeroSection,
    StatusBarSection,
    MissionTimelineSection,
    PeopleSection,
    FieldSection,
    JournalPreviewSection,
    NextCallSection
  }
}
</script>
