import 'reset-css/reset.css';
import './main.scss'
import './style.css'
import { gsap } from "gsap";

window.addEventListener('load', () => {
  const headerHoverLine = () => {
    const list = document.querySelector('.header__list');
    if (!list) return;

    const links = document.querySelectorAll('.header__link');
    let activeLink = document.querySelector('.header__link--active');

    if (!activeLink && links.length > 0) {
      activeLink = links[0];
    }

    function moveLine(target) {
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();

      list.style.setProperty('--line-left', `${rect.left - listRect.left}px`);
      list.style.setProperty('--line-width', `${rect.width}px`);
    }

    links.forEach(link => {
      link.addEventListener('mouseenter', () => moveLine(link));
    });

    list.addEventListener('mouseleave', () => {
      if (activeLink) moveLine(activeLink);
    });

    if (activeLink) moveLine(activeLink);
  }

  const burgerMenu = () => {
    const burger = document.querySelector('.header__burger')
    const headerNav = document.querySelector('.header__nav')

    burger.addEventListener('click', () => {
      burger.classList.toggle('header__burger--active')
      document.body.classList.toggle('body--overflow-hidden')
      headerNav.classList.toggle('header__nav--show')
    })
  }

  const stickyHeader = () => {
    const header = document.querySelector('.header');
    const headerHeight = header.offsetHeight;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {

          if (window.scrollY > 0) {
            header.classList.add('header--scrolled');
          } else {
            header.classList.remove('header--scrolled');
          }

          ticking = false;
        });

        ticking = true;
      }
    });
  }

  const magneticElements = () => {
    const buttonsMagnetic = document.querySelectorAll("[data-magnetic]");

    buttonsMagnetic.forEach(btn => {
      const xTo = gsap.quickTo(btn, "x", { duration: 1, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(btn, "y", { duration: 1, ease: "elastic.out(1, 0.4)" });

      btn.addEventListener("mousemove", e => {
        const { clientX, clientY } = e;
        const rect = btn.getBoundingClientRect();

        const x = clientX - (rect.left + rect.width / 2);
        const y = clientY - (rect.top + rect.height / 2);

        xTo(x);
        yTo(y);
      });

      btn.addEventListener("mouseleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  const inputsHover = () => {
    const inputWrappers = document.querySelectorAll(".input-box__input-wrapper");

    inputWrappers.forEach(wrapper => {
      const svg = wrapper.querySelector(".input-box__svg");
      const path = wrapper.querySelector(".input-box__line");

      let progress = 0;
      let x = 1;
      let time = Math.PI / 2;
      let reqId = null;

      const queryTextarea = () => {
        if (wrapper.querySelector('textarea')) {
          wrapper.classList.add('input-box__input-wrapper--has-textarea')
        }
      }

      const setPath = (progress) => {
        const width = svg.clientWidth;
        path.setAttribute("d", `M0 20 Q${width * x} ${20 + progress}, ${width} 20`);
      }

      const lerp = (a, b, t) => a * (1 - t) + b * t;

      wrapper.addEventListener("mouseenter", e => {
        const rect = svg.getBoundingClientRect();
        x = (e.clientX - rect.left) / rect.width;

        if (wrapper.closest('.input-box__input-wrapper--has-textarea')) {
          progress = (e.clientY - rect.top - rect.height / 2) * 0.2;
        } else {
          progress = (e.clientY - rect.top - rect.height / 2) * 0.5;
        }

        setPath(progress);
      });

      wrapper.addEventListener("mouseout", () => {
        const animateOut = () => {
          const newProgress = progress * Math.sin(time);
          progress = lerp(progress, 0, 0.05);
          time += 11;
          setPath(newProgress);
          if (Math.abs(progress) > 0.5) {
            reqId = requestAnimationFrame(animateOut);
          } else {
            progress = 0;
            time = Math.PI / 2;
            setPath(0);
          }
        }
        animateOut();
      });

      queryTextarea()
      setPath(0);
    });
  }

  const cf7LiveValidationStyling = () => {
    const inputs = document.querySelectorAll('.wpcf7-form-control');

    if (!inputs.length) return;

    inputs.forEach(input => {
      const box = input.closest('.input-box');
      if (!box) return;

      const observer = new MutationObserver(() => {
        if (input.classList.contains('wpcf7-not-valid')) {
          box.classList.add('has-error');
        } else {
          box.classList.remove('has-error');
        }
      });

      observer.observe(input, {
        attributes: true,
        attributeFilter: ['class']
      });
    });
  };

  headerHoverLine()
  burgerMenu()
  stickyHeader()
  magneticElements()
  inputsHover()
  cf7LiveValidationStyling()
})