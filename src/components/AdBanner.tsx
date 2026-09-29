import { useEffect, useRef } from 'react';

type Job = { container: HTMLDivElement; width: number };

// The ad script writes its iframe via document.write and global `atOptions`,
// so banners must be configured and loaded ONE at a time — not in parallel.
const queue: Job[] = [];
let running = false;

function runNext() {
  const job = queue.shift();
  if (!job) {
    running = false;
    return;
  }
  running = true;

  const container = job.container;
  const doc = document as Document & { write: (html: string) => void };
  const originalWrite = doc.write.bind(doc);

  // Capture what the ad script writes and place it inside this banner's slot.
  doc.write = (html: string) => {
    container.innerHTML = html;
  };

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
  const finish = () => {
    doc.write = originalWrite;
    setTimeout(runNext, 50);
  };
  loadScript.onload = finish;
  loadScript.onerror = finish;

  container.appendChild(confScript);
  container.appendChild(loadScript);
}

export const AdBanner = ({ width = 790 }: { width?: number }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      queue.push({ container: bannerRef.current, width });
      if (!running) runNext();
    }
  }, []);

  return (
    <div className="flex justify-center items-center my-4 min-h-[90px] w-full overflow-hidden">
      <div ref={bannerRef} style={{ width }} />
    </div>
  );
};
