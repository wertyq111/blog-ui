<template>
  <main class="creator-landing">
    <section class="creator-hero">
      <FadeIn class="creator-navbar" :y="-20" :delay="0">
        <a v-for="item in navLinks" :key="item.label" :href="item.href">
          {{ item.label }}
        </a>
      </FadeIn>

      <FadeIn class="creator-heading-wrap" :delay="0.15" :y="40">
        <h1 class="hero-heading">Blog hub</h1>
      </FadeIn>

      <FadeIn
        class="creator-portrait"
        :delay="0.6"
        :y="30">
        <Magnet
          :padding="320"
          :strength="2.2"
          active-transition="transform 0.3s ease-out"
          inactive-transition="transform 0.6s ease-in-out">
          <div class="creator-avatar-card">
            <div class="creator-avatar-frame">
              <img
                :src="currentAvatar"
                :alt="currentAvatarAlt"
                width="1024"
                height="1536"
                fetchpriority="high">
            </div>
            <div v-if="isLoggedIn" class="creator-avatar-name">
              {{ currentNickname }}
            </div>
          </div>
        </Magnet>
      </FadeIn>

      <div id="contact" class="creator-hero-bottom">
        <FadeIn class="creator-intro" :delay="0.35" :y="20">
          记录开发日常、沉淀项目文档、管理平台来源与工具配置
        </FadeIn>
        <FadeIn class="creator-actions" :delay="0.5" :y="20">
          <router-link v-if="!isLoggedIn" class="creator-login-entry" to="/login">
            <i class="el-icon-user"></i>
            登录
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
import setting from '@/config/setting';

const AVATAR_GUEST = require('@/assets/landing/avatar-guest.webp');
const AVATAR_MALE = require('@/assets/landing/avatar-male.webp');
const AVATAR_FEMALE = require('@/assets/landing/avatar-female.webp');
const BUNNY_LOGO = require('@/assets/logo.png');
const MODULE_WORK_DAILY = require('@/assets/landing/module-work-daily.svg');
const MODULE_WORK_DOC = require('@/assets/landing/module-work-doc.svg');
const MODULE_WORK_PLATFORM = require('@/assets/landing/module-work-platform.svg');
const MODULE_CONVERT_PATH = require('@/assets/landing/module-convert-path.svg');
const MODULE_INIT_MODEL = require('@/assets/landing/module-init-model.svg');
const MODULE_MEMBER = require('@/assets/landing/module-member.svg');
const MODULE_MINI_PROGRAM = require('@/assets/landing/module-mini-program.svg');
const MODULE_SYSTEM = require('@/assets/landing/module-system.svg');
const MODULE_SITE_CONFIG = require('@/assets/landing/module-site-config.svg');
const MODULE_API = require('@/assets/landing/module-api.svg');
const MODULE_REMOTE = require('@/assets/landing/module-remote.svg');
const PROJECT_UI = require('@/assets/landing/project-ui.svg');
const PROJECT_BACKEND = require('@/assets/landing/project-backend.svg');
const PROJECT_DEPLOY = require('@/assets/landing/project-deploy.svg');

const MARQUEE_ITEMS = [
  {title: '工作日常', desc: '日报 / 周报 / 月报', image: MODULE_WORK_DAILY},
  {title: '开发文档', desc: '项目资料沉淀', image: MODULE_WORK_DOC},
  {title: '平台来源', desc: '绑定项目上下文', image: MODULE_WORK_PLATFORM},
  {title: '路径转换', desc: '网址与服务器地址', image: MODULE_CONVERT_PATH},
  {title: '模型初始化', desc: '框架模板配置', image: MODULE_INIT_MODEL},
  {title: '会员管理', desc: '用户资料与头像', image: MODULE_MEMBER},
  {title: '小程序内容', desc: '壁纸 / 相册 / 记录', image: MODULE_MINI_PROGRAM},
  {title: '系统管理', desc: '菜单 / 角色 / 权限', image: MODULE_SYSTEM},
  {title: '站点配置', desc: '字典 / 参数 / 登录日志', image: MODULE_SITE_CONFIG},
  {title: '接口后台', desc: 'Laravel API', image: MODULE_API},
  {title: '远端验证', desc: 'Docker 运行环境', image: MODULE_REMOTE}
];

const ABOUT_IMAGES = [
  {
    className: 'about-asset about-asset-moon',
    src: BUNNY_LOGO,
    alt: '网站兔子头像',
    fade: {delay: 0.1, x: -80, y: 0, duration: 0.9}
  },
  {
    className: 'about-asset about-asset-object',
    src: AVATAR_GUEST,
    alt: '未登录访客卡通大头贴',
    fade: {delay: 0.25, x: -80, y: 0, duration: 0.9}
  },
  {
    className: 'about-asset about-asset-lego',
    src: AVATAR_MALE,
    alt: '男性账号卡通大头贴',
    fade: {delay: 0.15, x: 80, y: 0, duration: 0.9}
  },
  {
    className: 'about-asset about-asset-group',
    src: AVATAR_FEMALE,
    alt: '女性账号卡通大头贴',
    fade: {delay: 0.3, x: 80, y: 0, duration: 0.9}
  }
];

const SERVICES = [
  {
    number: '01',
    name: '工作日常',
    description: '记录每天的开发推进，并延伸成周报、月报和年报，让项目进度不再只停留在聊天和脑子里。',
    image: MODULE_WORK_DAILY
  },
  {
    number: '02',
    name: '开发文档',
    description: '沉淀项目资料、模板文档和分类内容，把零散信息整理成后续能继续接力的知识库。',
    image: MODULE_WORK_DOC
  },
  {
    number: '03',
    name: '平台来源',
    description: '统一管理不同项目和平台来源，给日志、文档、内容管理都提供清楚的归属。',
    image: MODULE_WORK_PLATFORM
  },
  {
    number: '04',
    name: '路径转换',
    description: '集中维护项目编码、网址和服务器地址，减少本地、远端和线上环境之间切换时的查找成本。',
    image: MODULE_CONVERT_PATH
  },
  {
    number: '05',
    name: '模型初始化',
    description: '管理框架模板和初始化配置，把重复搭建动作收束成可复用的开发流程。',
    image: MODULE_INIT_MODEL
  }
];

const PROJECTS = [
  {
    number: '01',
    category: 'Vue2 Admin',
    name: 'Blog UI',
    href: '/dashboard/workplace',
    images: [PROJECT_UI, MODULE_WORK_DAILY, MODULE_WORK_DOC]
  },
  {
    number: '02',
    category: 'Laravel API',
    name: 'Blog Backend',
    href: '/develop/work-doc',
    images: [PROJECT_BACKEND, MODULE_API, MODULE_WORK_PLATFORM]
  },
  {
    number: '03',
    category: 'Docker Remote',
    name: 'Runtime Verify',
    href: '/develop/work-platform',
    images: [PROJECT_DEPLOY, MODULE_REMOTE, MODULE_INIT_MODEL]
  }
];

function repeatItems(items) {
  return items.concat(items, items);
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
    return h('router-link', {
      class: 'contact-button',
      props: {
        to: '/login'
      }
    }, '进入后台');
  }
};

const LiveProjectButton = {
  name: 'LiveProjectButton',
  props: {
    to: {
      type: String,
      default: '/login'
    }
  },
  render(h) {
    return h('router-link', {
      class: 'live-project-button',
      props: {
        to: this.to
      }
    }, '进入模块');
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
      rowOne: repeatItems(MARQUEE_ITEMS.slice(0, 6)),
      rowTwo: repeatItems(MARQUEE_ITEMS.slice(6))
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
    }, images.map((item, index) => h('article', {
      class: 'marquee-tile',
      key: `${direction}-${item.title}-${index}`
    }, [
      h('img', {
        attrs: {
          src: item.image,
          alt: item.title,
          loading: 'lazy'
        }
      }),
      h('div', {
        class: 'marquee-tile-copy'
      }, [
        h('span', item.title),
        h('small', item.desc)
      ])
    ])));

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
      text: '这个 blog 项目不是单纯的展示页，它更像一个私人开发中枢：工作日常记录推进过程，工作文档沉淀资料，平台来源绑定项目上下文，路径转换和模型初始化负责把重复配置收束起来。'
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
          }, 'About blog')
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
      }, 'Modules'),
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
        ]),
        h('img', {
          class: 'service-image',
          attrs: {
            src: service.image,
            alt: `${service.name}模块插画`,
            loading: 'lazy'
          }
        })
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
            h(LiveProjectButton, {
              props: {
                to: project.href
              }
            })
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
  name: 'BlogLanding',
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
      landingUserLoadError: '',
      navLinks: [
        {label: '概览', href: '#about'},
        {label: '模块', href: '#price'},
        {label: '项目', href: '#projects'},
        {label: '登录', href: '/login'}
      ]
    };
  },
  computed: {
    loginUser() {
      return this.$store.state.user.user || {};
    },
    isLoggedIn() {
      return Boolean(setting.takeToken());
    },
    currentNickname() {
      const user = this.loginUser || {};
      const member = user.member || {};
      return member.nickname || user.nickname || member.realname || user.realname || user.username || '我的账号';
    },
    landingGender() {
      if (!this.isLoggedIn) {
        return 0;
      }
      return this.resolveGender(this.loginUser);
    },
    currentAvatar() {
      if (this.landingGender === 2) {
        return AVATAR_FEMALE;
      }
      if (this.landingGender === 1) {
        return AVATAR_MALE;
      }
      return AVATAR_GUEST;
    },
    currentAvatarAlt() {
      if (this.landingGender === 2) {
        return '女性账号卡通大头贴';
      }
      if (this.landingGender === 1) {
        return '男性账号卡通大头贴';
      }
      return '未登录访客卡通大头贴';
    }
  },
  mounted() {
    document.title = '个人博客 -- 开发与知识工作台';
    document.documentElement.classList.add('creator-landing-html');
    document.body.classList.add('creator-landing-body');
    this.loadLandingUser();
  },
  beforeDestroy() {
    document.documentElement.classList.remove('creator-landing-html');
    document.body.classList.remove('creator-landing-body');
  },
  methods: {
    resolveGender(user) {
      const member = user && user.member ? user.member : {};
      const value = member.gender || user.gender || member.sex || user.sex;
      return Number(value || 0);
    },
    loadLandingUser() {
      if (!setting.takeToken() || this.resolveGender(this.loginUser)) {
        return;
      }
      this.$http.get(setting.userUrl, {params: {include: ['member']}}).then((res) => {
        const result = setting.parseUser ? setting.parseUser(res.data) : res.data;
        if (result.code !== 0) {
          throw new Error(result.msg || '获取用户信息失败');
        }
        this.$store.dispatch('user/setUser', result.data || {});
      }).catch((e) => {
        this.landingUserLoadError = e.message || '获取用户信息失败';
        console.error(e);
      });
    }
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
  z-index: 24;
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
  top: 56%;
  z-index: 12;
  width: clamp(180px, 48vw, 250px);
  translate: -50% -50%;
}

.magnet-shell,
.magnet-content {
  width: 100%;
  will-change: transform;
}

.creator-avatar-card {
  width: 100%;
  text-align: center;
}

.creator-avatar-frame {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 999px;
  background: #0c0c0c;
  box-shadow:
    0 0 0 10px rgba(12, 12, 12, 0.72),
    0 28px 80px rgba(182, 0, 168, 0.24),
    0 18px 64px rgba(76, 211, 255, 0.18);
}

.creator-avatar-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1);
  user-select: none;
  pointer-events: none;
}

.creator-avatar-name {
  display: inline-flex;
  max-width: min(100%, 320px);
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  border: 1px solid rgba(215, 226, 234, 0.16);
  border-radius: 999px;
  padding: 7px 16px;
  color: #d7e2ea;
  font-size: clamp(0.82rem, 1.4vw, 1.05rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(12, 12, 12, 0.5);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);
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
  position: relative;
  display: flex;
  align-items: flex-end;
  width: 420px;
  height: 270px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 16px;
  background: #111820;
}

.marquee-tile::after {
  position: absolute;
  inset: 0;
  content: "";
  background: linear-gradient(180deg, rgba(12, 12, 12, 0.02) 0%, rgba(12, 12, 12, 0.66) 100%);
}

.marquee-tile img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.92;
  filter: saturate(1.08) contrast(1.04);
}

.marquee-tile-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
}

.marquee-tile-copy span {
  color: #f4f8fb;
  font-size: clamp(1.45rem, 2vw, 2rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.marquee-tile-copy small {
  color: rgba(215, 226, 234, 0.72);
  font-size: 0.92rem;
  font-weight: 300;
  letter-spacing: 0.08em;
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
  aspect-ratio: 1 / 1;
  border: 1px solid rgba(215, 226, 234, 0.2);
  border-radius: 999px;
  object-fit: cover;
  background: #0c0c0c;
  box-shadow:
    0 0 0 8px rgba(12, 12, 12, 0.72),
    0 18px 58px rgba(0, 0, 0, 0.36),
    0 16px 52px rgba(182, 0, 168, 0.18),
    0 12px 44px rgba(76, 211, 255, 0.12);
}

.about-asset-moon img {
  object-fit: contain;
  padding: 7%;
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
  flex: 1 1 auto;
  min-width: 0;
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

.service-image {
  width: clamp(96px, 16vw, 190px);
  aspect-ratio: 1.26 / 1;
  flex: 0 0 auto;
  border: 1px solid rgba(12, 12, 12, 0.1);
  border-radius: 24px;
  object-fit: cover;
  box-shadow: 0 24px 60px rgba(12, 12, 12, 0.12);
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
  background: #111820;
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
    top: 56%;
    width: clamp(230px, 30vw, 330px);
    translate: -50% -50%;
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
    top: 55%;
    width: clamp(260px, 28vw, 360px);
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
    width: clamp(290px, 27vw, 380px);
  }
}

@media (max-width: 639px) {
  .creator-hero-bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .service-item {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 18px;
  }

  .service-copy {
    flex: 1 1 calc(100% - 96px);
  }

  .service-image {
    width: 100%;
    border-radius: 20px;
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
