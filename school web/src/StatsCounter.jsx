import { useEffect } from "react";

function StatsCounter() {
  useEffect(() => {
    const counters = document.querySelectorAll(".count");
    const speed = 200; // lower = faster

    const isInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom >= 0;
    };

    const runCounters = () => {
      counters.forEach((counter) => {
        if (!counter.started && isInViewport(counter)) {
          counter.started = true;
          const updateCount = () => {
            const target = +counter.getAttribute("data-target");
            const count = +counter.innerText;
            const increment = Math.ceil(target / speed);

            if (count < target) {
              counter.innerText = count + increment;
              setTimeout(updateCount, 20);
            } else {
              counter.innerText = target + "+"; 
            }
          };
          updateCount();
        }
      });
    };

    window.addEventListener("scroll", runCounters);
    runCounters(); // initial check

    return () => window.removeEventListener("scroll", runCounters);
  }, []);

  return null;
}

export default StatsCounter;
