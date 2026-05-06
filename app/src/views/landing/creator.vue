<template>
  <main class="creator-landing">
    <section class="creator-hero">
      <FadeIn class="creator-navbar" :y="-20" :delay="0">
        <a v-for="item in navLinks" :key="item.label" :href="item.href">
          {{ item.label }}
        </a>
      </FadeIn>

      <FadeIn class="creator-heading-wrap" :delay="0.15" :y="40">
        <h1 class="hero-heading">Hi, i&apos;m jack</h1>
      </FadeIn>

      <FadeIn
        class="creator-portrait"
        :delay="0.6"
        :y="30">
        <Magnet
          :padding="150"
          :strength="3"
          active-transition="transform 0.3s ease-out"
          inactive-transition="transform 0.6s ease-in-out">
          <img
            src="@/assets/landing/jack-portrait.webp"
            alt="Jack 3D portrait"
            width="1450"
            height="1570"
            fetchpriority="high">
        </Magnet>
      </FadeIn>

      <div id="contact" class="creator-hero-bottom">
        <FadeIn class="creator-intro" :delay="0.35" :y="20">
          a 3d creator driven by crafting striking and unforgettable projects
        </FadeIn>
        <FadeIn class="creator-actions" :delay="0.5" :y="20">
          <router-link class="creator-login-entry" to="/login">
            <i class="el-icon-user"></i>
            Login
          </router-link>
          <ContactButton />
        </FadeIn>
      </div>
    </section>

    <MarqueeSection />
    <AboutSection />
    <ServicesSection />
    <ProjectsSection />
  </main>
</template>

<script>
const MARQUEE_IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'
];

const ABOUT_IMAGES = [
  {
    className: 'about-asset about-asset-moon',
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    alt: '3D moon icon',
    fade: {delay: 0.1, x: -80, y: 0, duration: 0.9}
  },
  {
    className: 'about-asset about-asset-object',
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    alt: '3D abstract object',
    fade: {delay: 0.25, x: -80, y: 0, duration: 0.9}
  },
  {
    className: 'about-asset about-asset-lego',
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    alt: '3D lego icon',
    fade: {delay: 0.15, x: 80, y: 0, duration: 0.9}
  },
  {
    className: 'about-asset about-asset-group',
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    alt: '3D creative group',
    fade: {delay: 0.3, x: 80, y: 0, duration: 0.9}
  }
];

const SERVICES = [
  {
    number: '01',
    name: '3D Modeling',
    description: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.'
  },
  {
    number: '02',
    name: 'Rendering',
    description: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.'
  },
  {
    number: '03',
    name: 'Motion Design',
    description: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.'
  },
  {
    number: '04',
    name: 'Branding',
    description: 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.'
  },
  {
    number: '05',
    name: 'Web Design',
    description: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.'
  }
];

const PROJECTS = [
  {
    number: '01',
    category: 'Client',
    name: 'Nextlevel Studio',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85'
    ]
  },
  {
    number: '02',
    category: 'Personal',
    name: 'Aura Brand Identity',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85'
    ]
  },
  {
    number: '03',
    category: 'Client',
    name: 'Solaris Digital',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85'
    ]
  }
];

function repeatImages(images) {
  return images.concat(images, images);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const FadeIn = {
  name: 'FadeIn',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    delay: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0.7
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 30
    }
  },
  mounted() {
    this.$el.style.setProperty('--fade-delay', `${this.delay}s`);
    this.$el.style.setProperty('--fade-duration', `${this.duration}s`);
    this.$el.style.setProperty('--fade-x', `${this.x}px`);
    this.$el.style.setProperty('--fade-y', `${this.y}px`);
    this.$el.classList.add('fade-seed');
    const reveal = () => {
      this.$el.classList.add('is-visible');
      if (this.observer) {
        this.observer.unobserve(this.$el);
      }
    };
    this.$nextTick(() => {
      window.requestAnimationFrame(() => {
        const rect = this.$el.getBoundingClientRect();
        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.bottom >= -50 && rect.top <= viewHeight + 50) {
          reveal();
        }
      });
    });
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal();
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0
    });
    this.observer.observe(this.$el);
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  render(h) {
    return h(this.tag, {
      class: this.$attrs.class
    }, this.$slots.default);
  }
};

const Magnet = {
  name: 'Magnet',
  props: {
    padding: {
      type: Number,
      default: 150
    },
    strength: {
      type: Number,
      default: 3
    },
    activeTransition: {
      type: String,
      default: 'transform 0.3s ease-out'
    },
    inactiveTransition: {
      type: String,
      default: 'transform 0.6s ease-in-out'
    }
  },
  data() {
    return {
      transform: 'translate3d(0, 0, 0)',
      transition: this.inactiveTransition
    };
  },
  methods: {
    move(event) {
      const rect = this.$el.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left - this.padding &&
        event.clientX <= rect.right + this.padding &&
        event.clientY >= rect.top - this.padding &&
        event.clientY <= rect.bottom + this.padding;

      if (!inside) {
        this.leave();
        return;
      }

      const x = (event.clientX - rect.left - rect.width / 2) / this.strength;
      const y = (event.clientY - rect.top - rect.height / 2) / this.strength;
      this.transition = this.activeTransition;
      this.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    leave() {
      this.transition = this.inactiveTransition;
      this.transform = 'translate3d(0, 0, 0)';
    }
  },
  render(h) {
    return h('div', {
      class: 'magnet-shell',
      on: {
        mousemove: this.move,
        mouseleave: this.leave
      }
    }, [
      h('div', {
        class: 'magnet-content',
        style: {
          transform: this.transform,
          transition: this.transition
        }
      }, this.$slots.default)
    ]);
  }
};

const ContactButton = {
  name: 'ContactButton',
  render(h) {
    return h('a', {
      class: 'contact-button',
      attrs: {
        href: '#contact'
      }
    }, 'Contact Me');
  }
};

const LiveProjectButton = {
  name: 'LiveProjectButton',
  render(h) {
    return h('a', {
      class: 'live-project-button',
      attrs: {
        href: '#projects'
      }
    }, 'Live Project');
  }
};

const AnimatedText = {
  name: 'AnimatedText',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      progress: 0
    };
  },
  computed: {
    characters() {
      return this.text.split('');
    }
  },
  mounted() {
    this.onScroll = () => {
      const rect = this.$el.getBoundingClientRect();
      const start = window.innerHeight * 0.8;
      const end = window.innerHeight * 0.2;
      this.progress = clamp((start - rect.top) / (rect.height + start - end), 0, 1);
    };
    this.onScroll();
    window.addEventListener('scroll', this.onScroll, {passive: true});
    window.addEventListener('resize', this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  },
  methods: {
    charOpacity(index) {
      const start = index / this.characters.length;
      const end = start + 0.16;
      return clamp((this.progress - start) / (end - start), 0.2, 1);
    }
  },
  render(h) {
    return h('p', {
      class: 'animated-text'
    }, this.characters.map((char, index) => h('span', {
      class: 'animated-char',
      style: {
        opacity: this.charOpacity(index)
      },
      key: `${char}-${index}`
    }, char === ' ' ? '\u00a0' : char)));
  }
};

const MarqueeSection = {
  name: 'MarqueeSection',
  data() {
    return {
      offset: 0,
      rowOne: repeatImages(MARQUEE_IMAGES.slice(0, 11)),
      rowTwo: repeatImages(MARQUEE_IMAGES.slice(11))
    };
  },
  mounted() {
    this.onScroll = () => {
      if (this.frame) {
        return;
      }
      this.frame = requestAnimationFrame(() => {
        const top = this.$el.getBoundingClientRect().top + window.scrollY;
        this.offset = (window.scrollY - top + window.innerHeight) * 0.3;
        this.frame = null;
      });
    };
    this.onScroll();
    window.addEventListener('scroll', this.onScroll, {passive: true});
    window.addEventListener('resize', this.onScroll);
  },
  beforeDestroy() {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  },
  render(h) {
    const renderRow = (images, direction) => h('div', {
      class: 'marquee-row',
      style: {
        transform: direction === 'right'
          ? `translate3d(${this.offset - 200}px, 0, 0)`
          : `translate3d(${-(this.offset - 200)}px, 0, 0)`
      }
    }, images.map((src, index) => h('img', {
      class: 'marquee-tile',
      attrs: {
        src,
        alt: `3D portfolio preview ${index + 1}`,
        loading: 'lazy'
      },
      key: `${direction}-${index}`
    })));

    return h('section', {
      class: 'marquee-section'
    }, [
      renderRow(this.rowOne, 'right'),
      renderRow(this.rowTwo, 'left')
    ]);
  }
};

const AboutSection = {
  name: 'AboutSection',
  data() {
    return {
      aboutImages: ABOUT_IMAGES,
      text: 'With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let\'s build something incredible together!'
    };
  },
  render(h) {
    const assets = this.aboutImages.map((image) => h(FadeIn, {
      key: image.className,
      class: image.className,
      props: {
        delay: image.fade.delay,
        x: image.fade.x,
        y: image.fade.y,
        duration: image.fade.duration
      }
    }, [
      h('img', {
        attrs: {
          src: image.src,
          alt: image.alt,
          loading: 'lazy'
        }
      })
    ]));

    return h('section', {
      class: 'about-section',
      attrs: {
        id: 'about'
      }
    }, assets.concat([
      h('div', {
        class: 'about-content'
      }, [
        h(FadeIn, {
          props: {
            delay: 0,
            y: 40
          }
        }, [
          h('h2', {
            class: 'hero-heading section-heading'
          }, 'About me')
        ]),
        h(AnimatedText, {
          props: {
            text: this.text
          }
        }),
        h('div', {
          class: 'about-button-wrap'
        }, [
          h(ContactButton)
        ])
      ])
    ]));
  }
};

const ServicesSection = {
  name: 'ServicesSection',
  data() {
    return {
      services: SERVICES
    };
  },
  render(h) {
    return h('section', {
      class: 'services-section',
      attrs: {
        id: 'price'
      }
    }, [
      h('h2', {
        class: 'section-heading services-heading'
      }, 'Services'),
      h('div', {
        class: 'service-list'
      }, this.services.map((service, index) => h(FadeIn, {
        key: service.number,
        class: 'service-item',
        props: {
          delay: index * 0.1,
          y: 30
        }
      }, [
        h('div', {
          class: 'service-number'
        }, service.number),
        h('div', {
          class: 'service-copy'
        }, [
          h('h3', service.name),
          h('p', service.description)
        ])
      ])))
    ]);
  }
};

const ProjectsSection = {
  name: 'ProjectsSection',
  data() {
    return {
      projects: PROJECTS,
      scales: PROJECTS.map(() => 1)
    };
  },
  mounted() {
    this.onScroll = () => {
      if (this.frame) {
        return;
      }
      this.frame = requestAnimationFrame(() => {
        const shells = this.$el.querySelectorAll('.project-card-shell');
        this.scales = this.projects.map((project, index) => {
          const shell = shells[index];
          if (!shell) {
            return 1;
          }
          const rect = shell.getBoundingClientRect();
          const progress = clamp((window.innerHeight * 0.55 - rect.top) / (window.innerHeight * 0.8), 0, 1);
          const targetScale = 1 - (this.projects.length - 1 - index) * 0.03;
          return 1 - progress * (1 - targetScale);
        });
        this.frame = null;
      });
    };
    this.onScroll();
    window.addEventListener('scroll', this.onScroll, {passive: true});
    window.addEventListener('resize', this.onScroll);
  },
  beforeDestroy() {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  },
  methods: {
    cardStyle(index) {
      return {
        top: `calc(6rem + ${index * 28}px)`,
        transform: `scale(${this.scales[index]})`
      };
    }
  },
  render(h) {
    return h('section', {
      class: 'projects-section',
      attrs: {
        id: 'projects'
      }
    }, [
      h('h2', {
        class: 'hero-heading section-heading projects-heading'
      }, 'Project'),
      h('div', {
        class: 'project-stack'
      }, this.projects.map((project, index) => h('div', {
        key: project.number,
        class: 'project-card-shell'
      }, [
        h('article', {
          class: 'project-card',
          style: this.cardStyle(index)
        }, [
          h('div', {
            class: 'project-card-top'
          }, [
            h('div', {
              class: 'project-number'
            }, project.number),
            h('div', {
              class: 'project-meta'
            }, [
              h('span', project.category),
              h('h3', project.name)
            ]),
            h(LiveProjectButton)
          ]),
          h('div', {
            class: 'project-image-grid'
          }, [
            h('div', {
              class: 'project-image-left'
            }, [
              h('img', {
                attrs: {
                  src: project.images[0],
                  alt: `${project.name} preview 1`,
                  loading: 'lazy'
                }
              }),
              h('img', {
                attrs: {
                  src: project.images[1],
                  alt: `${project.name} preview 2`,
                  loading: 'lazy'
                }
              })
            ]),
            h('img', {
              class: 'project-image-tall',
              attrs: {
                src: project.images[2],
                alt: `${project.name} preview 3`,
                loading: 'lazy'
              }
            })
          ])
        ])
      ])))
    ]);
  }
};

export default {
  name: 'CreatorLanding',
  components: {
    AboutSection,
    ContactButton,
    FadeIn,
    Magnet,
    MarqueeSection,
    ProjectsSection,
    ServicesSection
  },
  data() {
    return {
      navLinks: [
        {label: 'About', href: '#about'},
        {label: 'Price', href: '#price'},
        {label: 'Projects', href: '#projects'},
        {label: 'Contact', href: '#contact'}
      ]
    };
  },
  mounted() {
    document.title = 'Jack -- 3D Creator';
    document.documentElement.classList.add('creator-landing-html');
    document.body.classList.add('creator-landing-body');
  },
  beforeDestroy() {
    document.documentElement.classList.remove('creator-landing-html');
    document.body.classList.remove('creator-landing-body');
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap");

.creator-landing-html,
.creator-landing-body,
.creator-landing-body #app {
  min-height: 100%;
  background: #0c0c0c;
}

.creator-landing-body {
  margin: 0;
  font-family: "Kanit", sans-serif;
}

.creator-landing-body *,
.creator-landing-body *::before,
.creator-landing-body *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.creator-landing {
  min-height: 100vh;
  overflow-x: clip;
  background: #0c0c0c;
  color: #d7e2ea;
  font-family: "Kanit", sans-serif;
}

.creator-landing img {
  display: block;
  max-width: 100%;
}

.hero-heading {
  background: linear-gradient(180deg, #646973 0%, #bbccd7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.fade-seed {
  opacity: 0;
  transform: translate3d(var(--fade-x, 0), var(--fade-y, 30px), 0);
  transition:
    opacity var(--fade-duration, 0.7s) cubic-bezier(0.25, 0.1, 0.25, 1) var(--fade-delay, 0s),
    transform var(--fade-duration, 0.7s) cubic-bezier(0.25, 0.1, 0.25, 1) var(--fade-delay, 0s);
}

.fade-seed.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.creator-hero {
  position: relative;
  display: flex;
  min-height: 100vh;
  min-height: 100svh;
  flex-direction: column;
  overflow-x: clip;
  background: #0c0c0c;
}

.creator-navbar {
  position: relative;
  z-index: 30;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 24px 24px 0;
}

.creator-navbar a {
  color: #d7e2ea;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  transition: opacity 200ms ease;
}

.creator-navbar a:hover {
  opacity: 0.7;
}

.creator-login-entry {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(215, 226, 234, 0.52);
  border-radius: 999px;
  padding: 7px 12px;
  color: #d7e2ea;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-decoration: none;
  text-transform: uppercase;
  background: rgba(12, 12, 12, 0.36);
  backdrop-filter: blur(14px);
  transition:
    background-color 200ms ease,
    transform 200ms ease;
}

.creator-login-entry:hover {
  background: rgba(215, 226, 234, 0.12);
  transform: translateY(-2px);
}

.creator-heading-wrap {
  position: relative;
  z-index: 5;
  width: 100%;
  margin-top: 24px;
  overflow: hidden;
}

.creator-heading-wrap h1 {
  width: 100%;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
  white-space: nowrap;
}

.creator-portrait {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 10;
  width: 280px;
  aspect-ratio: 145 / 157;
  translate: -50% -50%;
}

.magnet-shell,
.magnet-content {
  width: 100%;
  height: 100%;
  will-change: transform;
}

.creator-portrait img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
}

.creator-hero-bottom {
  position: relative;
  z-index: 30;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  margin-top: auto;
  padding: 0 24px 28px;
}

.creator-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.creator-intro {
  max-width: 160px;
  color: #d7e2ea;
  font-size: clamp(0.75rem, 1.4vw, 1.5rem);
  font-weight: 300;
  line-height: 1.18;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.contact-button,
.live-project-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
}

.contact-button {
  outline: 2px solid #ffffff;
  outline-offset: -3px;
  padding: 12px 32px;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  background: linear-gradient(123deg, #18011f 7%, #b600a8 37%, #7621b0 72%, #be4c00 100%);
  box-shadow:
    0 4px 4px rgba(181, 1, 167, 0.25),
    4px 4px 12px #7721b1 inset;
  transition:
    filter 200ms ease,
    transform 200ms ease;
}

.contact-button:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
}

.marquee-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  padding: 96px 0 40px;
  background: #0c0c0c;
}

.marquee-row {
  display: flex;
  gap: 12px;
  width: max-content;
  will-change: transform;
}

.marquee-tile {
  width: 420px;
  height: 270px;
  flex: 0 0 auto;
  border-radius: 16px;
  object-fit: cover;
}

.about-section {
  position: relative;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 20px;
  background: #0c0c0c;
}

.about-content {
  position: relative;
  z-index: 5;
  display: flex;
  max-width: 760px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  text-align: center;
}

.section-heading {
  font-size: clamp(3rem, 12vw, 160px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;
  text-align: center;
  text-transform: uppercase;
}

.animated-text {
  max-width: 560px;
  color: #d7e2ea;
  font-size: clamp(1rem, 2vw, 1.35rem);
  font-weight: 500;
  line-height: 1.7;
  text-align: center;
}

.animated-char {
  position: relative;
  display: inline-block;
  transition: opacity 120ms linear;
}

.about-button-wrap {
  margin-top: 24px;
}

.about-asset {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.about-asset img {
  width: 100%;
}

.about-asset-moon {
  top: 4%;
  left: 1%;
  width: 120px;
}

.about-asset-object {
  bottom: 8%;
  left: 3%;
  width: 100px;
}

.about-asset-lego {
  top: 4%;
  right: 1%;
  width: 120px;
}

.about-asset-group {
  right: 3%;
  bottom: 8%;
  width: 130px;
}

.services-section {
  padding: 80px 20px;
  border-radius: 40px 40px 0 0;
  background: #ffffff;
  color: #0c0c0c;
}

.services-heading {
  margin-bottom: 64px;
  color: #0c0c0c;
}

.service-list {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 28px;
  border-top: 1px solid rgba(12, 12, 12, 0.15);
  padding: 32px 0;
}

.service-item:last-child {
  border-bottom: 1px solid rgba(12, 12, 12, 0.15);
}

.service-number,
.project-number {
  flex: 0 0 auto;
  color: #0c0c0c;
  font-size: clamp(3rem, 10vw, 140px);
  font-weight: 900;
  line-height: 0.85;
}

.service-copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-copy h3 {
  color: #0c0c0c;
  font-size: clamp(1rem, 2.2vw, 2.1rem);
  font-weight: 500;
  line-height: 1.1;
  text-transform: uppercase;
}

.service-copy p {
  max-width: 672px;
  color: rgba(12, 12, 12, 0.6);
  font-size: clamp(0.85rem, 1.6vw, 1.25rem);
  font-weight: 300;
  line-height: 1.7;
}

.projects-section {
  position: relative;
  z-index: 10;
  margin-top: -40px;
  padding: 92px 20px 120px;
  border-radius: 40px 40px 0 0;
  background: #0c0c0c;
}

.projects-heading {
  margin-bottom: 56px;
}

.project-stack {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

.project-card-shell {
  position: relative;
  height: 85vh;
}

.project-card {
  position: sticky;
  z-index: 1;
  overflow: hidden;
  border: 2px solid #d7e2ea;
  border-radius: 40px;
  padding: 16px;
  background: #0c0c0c;
  transform-origin: top center;
  transition: transform 120ms linear;
  will-change: transform;
}

.project-card-top {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: end;
  gap: 18px;
  margin-bottom: 24px;
}

.project-card .project-number {
  color: #d7e2ea;
}

.project-meta {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.project-meta span {
  color: rgba(215, 226, 234, 0.68);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.project-meta h3 {
  overflow-wrap: anywhere;
  color: #d7e2ea;
  font-size: clamp(1.35rem, 4vw, 4.4rem);
  font-weight: 800;
  line-height: 0.95;
  text-transform: uppercase;
}

.live-project-button {
  grid-column: 1 / -1;
  justify-self: start;
  border: 2px solid #d7e2ea;
  padding: 12px 32px;
  color: #d7e2ea;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  transition: background-color 200ms ease;
}

.live-project-button:hover {
  background: rgba(215, 226, 234, 0.1);
}

.project-image-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.project-image-left {
  display: grid;
  gap: 12px;
}

.project-image-grid img {
  width: 100%;
  border-radius: 40px;
  object-fit: cover;
}

.project-image-left img:first-child {
  height: clamp(130px, 16vw, 230px);
}

.project-image-left img:last-child {
  height: clamp(160px, 22vw, 340px);
}

.project-image-tall {
  height: clamp(300px, 44vw, 582px);
}

@media (min-width: 640px) {
  .creator-navbar {
    padding: 32px 40px 0;
  }

  .creator-navbar a {
    font-size: 1.125rem;
  }

  .creator-login-entry {
    padding: 9px 16px;
    font-size: 0.75rem;
  }

  .creator-heading-wrap {
    margin-top: 16px;
  }

  .creator-heading-wrap h1 {
    font-size: 15vw;
  }

  .creator-portrait {
    top: auto;
    bottom: 0;
    width: 360px;
    translate: -50% 0;
  }

  .creator-hero-bottom {
    padding: 0 40px 32px;
  }

  .creator-intro {
    max-width: 220px;
  }

  .contact-button {
    padding: 14px 40px;
    font-size: 0.875rem;
  }

  .marquee-section {
    padding-top: 128px;
  }

  .about-section,
  .services-section {
    padding-right: 32px;
    padding-left: 32px;
  }

  .about-content {
    gap: 56px;
  }

  .about-button-wrap {
    margin-top: 24px;
  }

  .about-asset-moon,
  .about-asset-lego {
    width: 160px;
  }

  .about-asset-object {
    left: 6%;
    width: 140px;
  }

  .about-asset-group {
    right: 6%;
    width: 170px;
  }

  .services-section {
    border-radius: 50px 50px 0 0;
    padding-top: 96px;
    padding-bottom: 96px;
  }

  .services-heading {
    margin-bottom: 80px;
  }

  .service-item {
    gap: 40px;
    padding: 40px 0;
  }

  .projects-section {
    margin-top: -48px;
    border-radius: 50px 50px 0 0;
  }

  .project-card {
    border-radius: 50px;
    padding: 24px;
  }

  .project-card-top {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .live-project-button {
    grid-column: auto;
    justify-self: end;
    padding: 14px 40px;
    font-size: 1rem;
  }

  .project-image-grid {
    grid-template-columns: minmax(0, 0.4fr) minmax(0, 0.6fr);
  }
}

@media (min-width: 768px) {
  .creator-navbar {
    padding-top: 32px;
  }

  .creator-heading-wrap {
    margin-top: -20px;
  }

  .creator-heading-wrap h1 {
    font-size: 16vw;
  }

  .creator-portrait {
    width: 440px;
  }

  .creator-hero-bottom {
    padding-bottom: 40px;
  }

  .creator-intro {
    max-width: 260px;
  }

  .contact-button {
    padding: 16px 48px;
    font-size: 1rem;
  }

  .marquee-section {
    padding-top: 160px;
  }

  .about-section,
  .services-section {
    padding-right: 40px;
    padding-left: 40px;
  }

  .about-content {
    gap: 64px;
  }

  .about-button-wrap {
    margin-top: 32px;
  }

  .about-asset-moon {
    left: 4%;
    width: 210px;
  }

  .about-asset-object {
    left: 10%;
    width: 180px;
  }

  .about-asset-lego {
    right: 4%;
    width: 210px;
  }

  .about-asset-group {
    right: 10%;
    width: 220px;
  }

  .services-section {
    border-radius: 60px 60px 0 0;
    padding-top: 128px;
    padding-bottom: 128px;
  }

  .services-heading {
    margin-bottom: 112px;
  }

  .service-item {
    padding: 48px 0;
  }

  .projects-section {
    margin-top: -56px;
    border-radius: 60px 60px 0 0;
  }

  .project-card {
    border-radius: 60px;
    padding: 32px;
  }

  .project-card {
    top: 8rem;
  }

  .project-image-grid,
  .project-image-left {
    gap: 16px;
  }

  .project-image-grid img {
    border-radius: 60px;
  }
}

@media (min-width: 1024px) {
  .creator-navbar a {
    font-size: 1.4rem;
  }

  .creator-heading-wrap h1 {
    font-size: 17.5vw;
  }

  .creator-portrait {
    width: 520px;
  }
}

@media (max-width: 639px) {
  .creator-hero-bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .project-card-shell {
    height: auto;
    min-height: 85vh;
    padding-bottom: 56px;
  }

  .project-card {
    top: 5.5rem !important;
  }
}
</style>
