import { useEffect, useRef } from 'react';

export const AdBanner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : 'c2f484876794ac0d5180d900c7c12375',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;

      const loadScript = document.createElement('script');
      loadScript.type = 'text/javascript';
      loadScript.src = '//www.highrevenueformat.com/c2f484876794ac0d5180d900c7c12375/invoke.js';

      bannerRef.current.appendChild(confScript);
      bannerRef.current.appendChild(loadScript);
    }
  }, []);

  return (
    <div className="flex justify-center items-center my-4 min-h-[90px] w-full overflow-hidden">
      <div ref={bannerRef} />
    </div>
  );
};
