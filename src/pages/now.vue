<template>
  <div class="content-page">
    <Banner height="70vh" image="/assets/img/collections/default-banners/0.jpg">
      <div class="text-center">
        <SlideRight :duration="1500" :delay="200">
          <h1 v-if="$store.getters['router/onMountedShow']" class="text-white text-smooth text-shadow">
            <b>Now</b>
          </h1>
        </SlideRight>
        <SlideLeft :duration="1500" :delay="200">
          <h5 v-if="$store.getters['router/onMountedShow']" class="text-white text-smooth text-shadow">
            <span id="desc-now" />”
          </h5>
        </SlideLeft>
      </div>
    </Banner>
    <section class="section section-skew">
      <div class="container">
        <Card class="card-content" shadow no-body>
          <div id="now-content" class="px-4 row justify-content-center">
            <div class="col-lg-9">
              <p>
                <client-only>
                  <md-quote-icon w="14px" h="14px" />
                </client-only>
                At first, i'll be thanking to
                <a rel="noreferrer" target="_blank" href="https://faultable.dev/now/">Fariz Rizaldy</a>,
                <a rel="noreferrer" target="_blank" href="https://afrijaldzuhri.wordpress.com/now/">Afrijal Dzuhri</a> and
                <a rel="noreferrer" target="_blank" href="https://www.wahudamon.com/now">Afwa Bagas Wahuda</a>.
                Because all of them, i was inspired to create this page for describing about <b><i>what i'm doing right now</i></b>.
                So, maybe you don't need to ask me frequently about that.
              </p>
              <p>
                If you have your own site, maybe you should to make one, too.
              </p>

              <h2 class="mt-5">
                Careers
              </h2>
              <p>
                <b>
                  Working as a
                  <a rel="noreferrer" target="_blank" href="https://www.google.com/search?q=what+is+core+team">Core</a>
                  <a rel="noreferrer" target="_blank" href="https://www.google.com/search?q=what+is+frontend+developer+do">
                    Frontend Developer
                  </a>
                  at
                  <a rel="noreferrer" target="_blank" href="https://www.google.com/search?q=orami+indonesia">
                    Orami
                  </a>
                  by
                  <a rel="noreferrer" target="_blank" href="https://www.google.com/search?q=sirclo+group">
                    SIRCLO Group
                  </a>.
                </b>
              </p>

              <h2 class="mt-5">
                Activities
              </h2>
              <ul>
                <li>Trading, Investing, and Learning Cryptocurrency</li>
                <li>Learning and research some technology stuff from the internet.</li>
                <li>Social Media, coding, reading and blogging for fun.</li>
                <li>Making quality time for my family and girlfriend every weekend.</li>
              </ul>

              <h2 class="mt-5">
                Stack Experiences
              </h2>
              <ul>
                <li>Pure JavaScript/TypeScript</li>
                <li>React, Vue or other JavaScript framework for frontend stuff.</li>
                <li>CSS Preprocessor (SASS, LESS)</li>
                <li>Node with Express for backend services.</li>
                <li>Bots, Automation, Task Runner, Puppeteer</li>
                <li>Vercel, Netlify, Firebase, Mongo Cloud/mLab, Heroku, Cloudinary, AWS EC2, GAPPS API (SaaS/PaaS)</li>
                <li>Sometimes using PHP with Laravel or Codeigniter as backend services.</li>
              </ul>

              <h2 class="mt-5">
                Tools that i use
              </h2>
              <ul>
                <li>Main Device: MacBook Pro M1 (2020)</li>
                <li>OS: MacOS Monterey</li>
                <li>Code Editor: Visual Studio Code</li>
                <li>Database GUI: DBEaver, PhpMyAdmin and Robo 3T</li>
                <li>Browsers: Google Chrome and Safari</li>
                <li>Others: Jira/Trello, Postman, Spotify</li>
              </ul>

              <p class="mt-5">
                <i>Last updated at: Februray, 2022 from Palembang, South Sumatera. Indonesia</i>.
                <a rel="noreferrer" target="_blank" :href="`https://github.com/${githubUsername}/sutanlab.id/commits/master/pages/now.vue`">
                  History
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  </div>
</template>

<script>
import { SlideXLeftTransition as SlideLeft, SlideXRightTransition as SlideRight } from 'vue2-transitions';
import MdQuoteIcon from 'vue-ionicons/dist/md-quote.vue';
import Card from '~/components/Argon/Card';
import Banner from '~/components/Base/Banner';
import MountedAnimation from '~/mixins/mounted-animation';
import { metaGenerator } from '~/utils/helpers';
import { AUTHOR_NAME, GITHUB_USERNAME } from '~/utils/config';
import { type } from '~/utils/typical';

export default {
  components: {
    SlideLeft,
    SlideRight,
    Banner,
    Card,
    MdQuoteIcon
  },
  mixins: [MountedAnimation],
  data: () => ({
    githubUsername: GITHUB_USERNAME
  }),
  head: () => ({
    title: `Now | ${AUTHOR_NAME}`,
    meta: metaGenerator('article', {
      title: 'Now Page',
      description: `What am i doing right now ? - ${AUTHOR_NAME}`,
      keywords: 'now, now page, what im doing right now',
      image: '/assets/img/collections/default-banners/0.jpg',
      url: '/now'
    })
  }),
  mounted() {
    setTimeout(() => {
      const desc = document.getElementById('desc-now');
      type(desc, 'What am i doing right now ?');
    }, 250);
  }
};
</script>

<style scoped>
#now-content {
  padding-top: 2.25rem;
  padding-bottom: 2.25rem;
}

@media only screen and (max-width: 768px) {
  #now-content {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}
</style>
