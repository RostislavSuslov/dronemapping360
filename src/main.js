import 'reset-css/reset.css';
import './main.scss'
import './style.css'
import { gsap } from "gsap";

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


const inputWrappers = document.querySelectorAll(".input-box__input-wrapper");

inputWrappers.forEach(wrapper => {
  const svg = wrapper.querySelector(".input-box__svg");
  const path = wrapper.querySelector(".input-box__line");

  let progress = 0;
  let x = 0.5;
  let time = Math.PI / 2;
  let reqId = null;

  const setPath = (progress) => {
    const width = svg.clientWidth;
    path.setAttribute("d", `M0 20 Q${width * x} ${20 + progress}, ${width} 20`);
  }

  const lerp = (a, b, t) => a * (1 - t) + b * t;

  wrapper.addEventListener("mousemove", e => {
    const rect = svg.getBoundingClientRect();
    x = (e.clientX - rect.left) / rect.width;
    progress = (e.clientY - rect.top - rect.height / 2) * 0.5;
    setPath(progress);
  });

  wrapper.addEventListener("mouseleave", () => {
    const animateOut = () => {
      const newProgress = progress * Math.sin(time);
      progress = lerp(progress, 0, 0.05);
      time += 11;
      setPath(newProgress);
      if (Math.abs(progress) > 0.5){
        reqId = requestAnimationFrame(animateOut);
      } else {
        progress = 0;
        time = Math.PI / 2;
        setPath(0);
      }
    }
    animateOut();
  });

  setPath(0);
});