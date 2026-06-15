export const TraceEngine = {
  createPlaybackState(problemData, onUpdateFrame) {
    let activeStep = 0;
    let playInterval = null;

    const stop = () => {
      if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
      }
    };

    const updateToFrame = (frameIdx) => {
      if (!problemData.trace || problemData.trace.length === 0) return;
      activeStep = Math.max(0, Math.min(frameIdx, problemData.trace.length - 1));
      onUpdateFrame(activeStep);
    };

    const play = (onFinish) => {
      stop();
      if (activeStep >= problemData.trace.length - 1) {
        activeStep = 0;
        updateToFrame(0);
      }
      playInterval = setInterval(() => {
        if (activeStep < problemData.trace.length - 1) {
          updateToFrame(activeStep + 1);
        } else {
          stop();
          if (onFinish) onFinish();
        }
      }, 1500);
    };

    return {
      getActiveStep() { return activeStep; },
      isPlaying() { return !!playInterval; },
      stop,
      updateToFrame,
      play,
      next() { updateToFrame(activeStep + 1); },
      prev() { updateToFrame(activeStep - 1); },
      replay() { updateToFrame(0); }
    };
  }
};
