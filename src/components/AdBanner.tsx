import { useEffect, useRef } from 'react';
import { AD_UNITS, type AdPlacement, type AdUnit } from '@/config/more-ads';

type Job = { container: HTMLDivElement; unit: AdUnit };

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
  if (!container.isConnected) {
    running = false;
    runNext();
    return;
  }
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
      'key' : ${JSON.stringify(job.unit.key)},
      'format' : 'iframe',
      'height' : ${job.unit.height},
      'width' : ${job.unit.width},
      'params' : ${JSON.stringify(job.unit.params)}
    };
  `;

  const loadScript = document.createElement('script');
  loadScript.type = 'text/javascript';
  loadScript.src = job.unit.scriptSrc;
  const finish = () => {
    doc.write = originalWrite;
    setTimeout(runNext, 50);
  };
  loadScript.onload = finish;
  loadScript.onerror = finish;

  container.appendChild(confScript);
  container.appendChild(loadScript);
}

export const AdBanner = ({ placement }: { placement: AdPlacement }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const unit = AD_UNITS[placement];

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      queue.push({ container: bannerRef.current, unit });
      if (!running) runNext();
    }
  }, [unit]);

  return (
    <div
      className="my-5 flex w-full items-center justify-center overflow-x-auto"
      style={{ minHeight: unit.height }}
      aria-label="Advertisement"
    >
      <div ref={bannerRef} style={{ width: unit.width, minWidth: unit.width }} />
    </div>
  );
};
