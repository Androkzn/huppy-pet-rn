import React, { useCallback, useEffect, useRef, useState } from "react";
import '../components/styles/styles.css';

export interface Props {
  onLeftSwipe: Function;
  onLeftSwipeConfirm?: Function;
  leftSwipeComponent?: React.ReactNode;
  onRightSwipe: Function;
  onRightSwipeConfirm?: Function;
  rightSwipeComponent?: React.ReactNode;
  disabled?: boolean;
  height?: number;
  transitionDuration?: number;
  swipeWidth?: number;  
  swipeThreshold?: number; 
  showSwipeAction?: boolean; 
  leftSwipeColor?: string;  
  leftSwipeText?: string; 
  rightSwipeColor?: string;  
  rightSwipeText?: string;  
  className?: string;
  id?: string;
  rtl?: boolean;
  children?: React.ReactNode;
}

const cursorPosition = (event: any) => {
  if (event?.touches?.[0]?.clientX) return event.touches[0].clientX;
  if (event?.clientX) return event?.clientX;
  if (event?.nativeEvent?.touches?.[0]?.clientX) return event.nativeEvent.touches[0].clientX;
  return event?.nativeEvent?.clientX;
};

const SwipeToDelete = ({
  onLeftSwipe,
  onLeftSwipeConfirm,
  leftSwipeComponent,
  onRightSwipe,
  onRightSwipeConfirm,
  rightSwipeComponent,
  disabled = false,
  height = 50,
  transitionDuration = 250,
  swipeWidth = 75, 
  swipeThreshold = 75,  
  showSwipeAction = true,  
  leftSwipeColor = "rgba(252, 255, 148, 1.00)",  
  leftSwipeText = "Edit",
  rightSwipeColor= "rgba(252, 254, 250, 1.00)",
  rightSwipeText = "Delete",
  className = "",
  id = "",
  rtl = false,
  children,
}: Props) => {
  const [touching, setTouching] = useState(false);
  const [translate, setTranslate] = useState(0);
  const [leftSwiping, setLeftSwiping] = useState(false);
  const [rightSwiping, setRightSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  
  const startTouchPosition = useRef(0);
  const initTranslate = useRef(0);
  const container = useRef<HTMLDivElement>(null);
  const containerWidth: number = container.current?.getBoundingClientRect().width || 0;
  const swipeWithoutConfirmThreshold: number = containerWidth * (swipeThreshold / 100); // Change deleteWithoutConfirmThreshold to swipeWithoutConfirmThreshold

  const onStart = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      if (touching) return;
      startTouchPosition.current = cursorPosition(event);
      initTranslate.current = translate;
      setTouching(true);
    },
    [disabled, touching, translate]
  );

  useEffect(() => {
    const root = container.current;
    root?.style.setProperty("--rstdiHeight", height + "px");
    root?.style.setProperty("--rstdiTransitionDuration", transitionDuration + "ms");
    root?.style.setProperty("--rstdiIsRtl", rtl ? "1" : "-1");
    root?.style.setProperty("--rstdiDeleteColor", leftSwipeColor); 
    root?.style.setProperty("--rstdiArchiveColor", rightSwipeColor);   
    root?.style.setProperty("--rstdiSwipeWidth", swipeWidth + "px"); 
  }, [leftSwipeColor, rightSwipeColor, swipeWidth, height, rtl, transitionDuration]);

  useEffect(() => {
    const root = container.current;
    root?.style.setProperty("--rstdiTranslate", translate * (rtl ? -1 : 1) + "px");
    const shiftSwipe = -translate >= swipeWithoutConfirmThreshold;  
    root?.style.setProperty(
      `--rstdiButtonMargin${rtl ? "Right" : "Left"}`,
      (shiftSwipe ? containerWidth + translate : containerWidth - swipeWidth) + "px"  
    );
  }, [translate, swipeWidth, containerWidth, rtl, swipeWithoutConfirmThreshold]);

  const onMove = useCallback(
    function (event: TouchEvent | MouseEvent) {
 
      if (!touching) return;
      const currentPosition = cursorPosition(event);
      const moveDistance = currentPosition - startTouchPosition.current;
      setSwipeDirection(moveDistance >=0 ? "right" : "left")
      
      // Handle left swipe
      if (!rtl && moveDistance > startTouchPosition.current - initTranslate.current) {
        setTranslate(0);
      }
      // Handle right swipe
      else if (rtl && moveDistance < startTouchPosition.current - initTranslate.current) {
        setTranslate(0);
      } else {
        setTranslate(moveDistance);
      }
    },
    [rtl, touching]
  );

  const onMouseMove = useCallback(
    function (event: MouseEvent): any {
      console.log("onMouseMove")
      onMove(event);
    },
    [onMove]
  );

  const onTouchMove = useCallback(
    function (event: TouchEvent): any {
      onMove(event);
    },
    [onMove]
  );

  const onLeftSwipeConfirmed = useCallback(() => {
    setLeftSwiping(() => true);
    window.setTimeout(onLeftSwipe, transitionDuration);
  }, [onLeftSwipe, transitionDuration]);

  const onRightSwipeConfirmed = useCallback(() => {
    setRightSwiping(() => true);
     window.setTimeout(onRightSwipe, transitionDuration);
  }, [onRightSwipe, transitionDuration]);

  const onSwipeCancel = useCallback(() => {
    console.log("onSwipeCancel")
    setTouching(() => false);
    setTranslate(() => 0);
    setLeftSwiping(() => false);
    setRightSwiping(() => false);
    startTouchPosition.current = 0;
    initTranslate.current = 0;
  }, [onLeftSwipe, onRightSwipe, transitionDuration]);

  const onLeftSwipeClick = useCallback(() => {
    console.log("onLeftSwipeAction")
    if (onLeftSwipeConfirm) {
      onLeftSwipeConfirm(onLeftSwipeConfirmed, onSwipeCancel);
    } else {
      onLeftSwipeConfirmed();
    }
  }, [onLeftSwipeConfirm, onLeftSwipeConfirmed, onSwipeCancel]);

  
  // const onRightSwipeClick = useCallback(() => {
  //   console.log("onRightSwipeAction")
  //   if (onRightSwipeConfirm) {
  //     onRightSwipeConfirm(onRightSwipeConfirmed, onSwipeCancel);
  //   } else {
  //     onRightSwipeConfirmed();
  //   }
  // }, [onRightSwipeConfirm, onRightSwipeConfirmed, onSwipeCancel]);

  const onRightSwipeClick = useCallback(() => {
    setTransitioning(true); // Set transitioning to true before the action
    if (onRightSwipeConfirm) {
      onRightSwipeConfirm(() => {
        setTransitioning(false); // Set transitioning to false after the action is done
        onRightSwipe();
      }, onSwipeCancel);
    } else {
      setTransitioning(false); // Set transitioning to false after the action is done
      onRightSwipe();
    }
  }, [onRightSwipeConfirm, onRightSwipe, onSwipeCancel]);

  useEffect(() => {
    const handleTransitionEnd = () => {
      setTransitioning(false);
    };
  
    const root = container.current;
    root?.addEventListener("transitionend", handleTransitionEnd);
  
    return () => {
      root?.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, []);


  const onMouseUp = useCallback(
    function () {
      console.log("onMouseUp")
      startTouchPosition.current = 0;
      const acceptableMoveLeft = -swipeWidth * 0.7;
      const acceptableMoveRight = swipeWidth * 0.7;
  
      const showSwipeLeft = showSwipeAction ? (rtl ? -1 : 1) * translate < acceptableMoveLeft : false;
      const showSwipeRight = showSwipeAction ? (rtl ? -1 : 1) * translate > acceptableMoveRight : false;
  
      const notShowSwipe = showSwipeAction ? (rtl ? -1 : 1) * translate >= acceptableMoveLeft && (rtl ? -1 : 1) * translate <= acceptableMoveRight : true;
      const swipeWithoutConfirm = (rtl ? 1 : -1) * translate >= swipeWithoutConfirmThreshold;
  
      if (swipeWithoutConfirm) {
        setTranslate(() => -containerWidth);
      } else if (notShowSwipe) {
        setTranslate(() => 0);
      } else if (showSwipeLeft && !swipeWithoutConfirm) {
        setTranslate(() => (rtl ? 1 : -1) * swipeWidth);
      } else if (showSwipeRight && !swipeWithoutConfirm) {
        setTranslate(() => (rtl ? -1 : 1) * swipeWidth);
      }
  
      setTouching(() => false);
      if (swipeWithoutConfirm) {
         swipeDirection === "left" ?  onLeftSwipeClick() : onRightSwipeClick()
        
      }
    },
    [containerWidth, swipeWidth, swipeWithoutConfirmThreshold, onLeftSwipeClick, onRightSwipeClick, rtl, translate, showSwipeAction]
  );

  useEffect(() => {
    if (touching) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchend", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, touching]);


  return (
    <div id={id} className={`rstdi${leftSwiping ? " deleting" : ""} ${className}`} ref={container}>
      { swipeDirection === "left" ? (
        <div className={`delete${leftSwiping ? " deleting" : ""}`}>
          <button onClick={onLeftSwipeClick}>{leftSwipeComponent ? leftSwipeComponent : leftSwipeText}</button>
        </div>
      ) : (
        <div className={`archive${rightSwiping ? " archiving" : ""}`}>
          <button onClick={onRightSwipeClick}>{rightSwipeComponent ? rightSwipeComponent : rightSwipeText}</button>
        </div>
      )}
       { swipeDirection === "left" ? (
      <div
        className={`content${leftSwiping ? " deleting" : ""}${!touching ? " transition" : ""}`}
        onMouseDown={onStart}
        onTouchStart={onStart}>
        {children}
      </div>
       ) : (
        <div
        className={`content${rightSwiping ? " archiving" : ""}${transitioning ? " transitioning" : ""}${!touching ? " transition" : ""}`}
        onMouseDown={onStart}
        onTouchStart={onStart}>
        {children}
      </div>
      )}
      {/* { swipeDirection === "left" ? (
        <div className={`delete${leftSwiping ? " deleting" : ""}`}>
          <button onClick={onLeftSwipeAction}>{leftSwipeComponent ? leftSwipeComponent : leftSwipeText}</button>
        </div>
      ) : (
        <div className={`archive${rightSwiping ? " archiving" : ""}`}>
          <button onClick={onRightSwipeAction}>{rightSwipeComponent ? rightSwipeComponent : rightSwipeText}</button>
        </div>
      )} */}
    </div>
  );
};

export default SwipeToDelete;
