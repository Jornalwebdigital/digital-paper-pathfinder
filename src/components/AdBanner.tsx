import { useEffect, useRef } from 'react';

type Job = { bannerRef: React.RefObject<HTMLDivElement | null>; width: number };

// The ad script reads the global `atOptions` when it executes, so multiple
// banners must be configured and loaded one at a time — not in parallel.
const queue: Job[] = [];
let running = false;

function runNext() {
  const job = queue.shift();
  if (!job) {
    running = false;
    return;
  }
  running = true;

  const confScript = document.createElement('script');
  confScript.type = 'text/javascript';
  confScript.innerHTML = `
    atOptions = {
      'key' : 'c2f484876794ac0d5180d900c7c12375',
      'format' : 'iframe',
      'height' : 90,
      'width' : ${job.width},
      'params' : {}
    };
  `;

  const loadScript = document.createElement('script');
  loadScript.type = 'text/javascript';
  loadScript.src = '//www.highrevenueformat.com/c2f484876794ac0d5180d900c7c12375/invoke.js';
  // The ad renders via document.write into the current script's position,
  // so move the banner div right before the script executes.
  if (job.bannerRef.current && job.bannerRef.current.parentNode) {
    const placeholder = document.createComment('ad-slot');
    job.bannerRef.current.replaceWith(placeholder);
    document.currentScript?.after;
    loadScript.onload = () => {
      // restore the div container after the ad writes itself
      placeholder.replaceWith(job.bannerRef.current!);
      runNext();
    };
    loadScript.onerror = () => {
      placeholder.replaceWith(job.bannerRef.current!);
      runNext();
    };
  } else {
    loadScript.onload = runNext;
    loadScript.onerror = runNext;
  }

  job.bannerRef.current?.appendChild(confScript);
  job.bannerRef.current?.appendChild(loadScript);
}

export const AdBanner = ({ width = 790 }: { width?: number }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      queue.push({ bannerRef, width });
      if (!running) runNext();
    }
  }, []);

  return (
    <div className="flex justify-center items-center my-4 min-h-[90px] w-full overflow-hidden">
      <div ref={bannerRef} style={{ width }} />
    </div>
  );
};
