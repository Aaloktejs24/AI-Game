import React, { useEffect, useRef } from "react";

const GameBox = ({ assets, parameters }) => {
  const iframeRef = useRef();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const sendMessage = () => {
      iframe.contentWindow.postMessage(
        {
          injectedAssets: assets,
          injectedParams: parameters,
        },
        "*"
      );
    };

    iframe.onload = sendMessage;
  }, [assets, parameters]);

  return (
    <div className="mx-auto w-[431px] h-[768px] border shadow-lg rounded overflow-hidden">
      <iframe
        ref={iframeRef}
        src="/games/flappy-bird/index.html"
        width="431"
        height="768"
        title="Floppy Bird Game"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};

export default GameBox;