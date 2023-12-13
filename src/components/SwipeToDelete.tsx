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
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  distructiveLeftSwipe?: boolean;
  distructiveRightSwipe?: boolean;
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
  swipeThreshold = 50,  
  showSwipeAction = true,  
  leftSwipeColor = "rgba(252, 255, 148, 1.00)",  
  leftSwipeText = "Edit",
  rightSwipeColor= "rgba(252, 254, 250, 1.00)",
  rightSwipeText = "Delete",
  className = "",
  id = "",
  rtl = false,
  disableLeftSwipe = false,
  disableRightSwipe = false,
  distructiveLeftSwipe = false,
  distructiveRightSwipe = false,
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
    root?.style.setProperty("--visibilityLeft", swipeDirection === "left" ? "visible" : "hidden"); 
    root?.style.setProperty("--visibilityRight", swipeDirection === "right" ? "visible" : "hidden"); 
  }, [swipeDirection]);


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

      // console.log("swipe direction", swipeDirection)
      // console.log("disableRightSwipe && moveDistance >0 && translate >= -1 * swipeWidth", disableRightSwipe && moveDistance >0 && translate >= -1 * swipeWidth)
      // console.log("disableRightSwipe && moveDistance < 0", disableLeftSwipe && moveDistance < 0)
      //console.log("translate",translate)
      //console.log("startTouchPosition.current - initTranslate.current", startTouchPosition.current - initTranslate.current)
      //console.log("moveDistance",moveDistance)
      
      // Handle left swipe
      // if (moveDistance < 0 && disableLeftSwipe) {
      //   console.log("disableLeftSwipe",disableLeftSwipe)
      //   return 
      // }
      // // Handle right swipe
      // else if (moveDistance > 0 && disableRightSwipe) {
      //   console.log("disableRightSwipe",disableRightSwipe)
      //  return
      // } 
      // else {
      //   setTranslate(moveDistance);
      // }

      
      setTranslate(moveDistance);
    },
    [rtl, touching]
  );

  const onMouseMove = useCallback(
    function (event: MouseEvent): any {
      // console.log("onMouseMove")
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
    console.log("onLeftSwipeConfirmed")
    onSwipeCancel()
    setLeftSwiping(() => true);
    window.setTimeout(onLeftSwipe, transitionDuration);
  }, [onLeftSwipe, transitionDuration]);

  const onRightSwipeConfirmed = useCallback(() => {
     console.log("onRightSwipeConfirmed")
     onSwipeCancel()
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
    if (disableLeftSwipe || disabled) return;
    console.log("onLeftSwipeAction")
    if (onLeftSwipeConfirm) {
      console.log("onLeftSwipeClick 1")
      onLeftSwipeConfirm(() => {
        setTransitioning(false); // Set transitioning to false after the action is done
        onLeftSwipeConfirmed();
      }, onSwipeCancel);
    } else {
      console.log("onLeftSwipeClick 2")
      setTransitioning(false);
      onLeftSwipeConfirmed();
    }
  }, [onLeftSwipeConfirm, onLeftSwipeConfirmed, onSwipeCancel, disableLeftSwipe]);

  
  // const onRightSwipeClick = useCallback(() => {
  //   if (disableRightSwipe || disabled) return; 
  //   console.log("onRightSwipeAction")
  //   if (onRightSwipeConfirm) {
  //     console.log("onRightSwipeAction 1")
  //     onRightSwipeConfirm(onRightSwipeConfirmed, onSwipeCancel);
  //   } else {
  //     console.log("onRightSwipeAction 2")
  //     onRightSwipeConfirmed();
  //   }
  // }, [onRightSwipeConfirm, onRightSwipeConfirmed, onSwipeCancel, disableRightSwipe, disabled]);

  const onRightSwipeClick = useCallback(() => {
    console.log("onRightSwipeClick")
    if (disableRightSwipe || disabled) return; 
    setTransitioning(true); // Set transitioning to true before the action
    if (onRightSwipeConfirm) {
      onRightSwipeConfirm(() => {
        console.log("onRightSwipeAction 1")
        setTransitioning(false); // Set transitioning to false after the action is done
        onRightSwipeConfirmed()
      }, onSwipeCancel);
    } else {
      console.log("onRightSwipeAction 2")
      setTransitioning(false); // Set transitioning to false after the action is done
      onRightSwipeConfirmed()
    }
  }, [onRightSwipeConfirm, onRightSwipe, onSwipeCancel,disableRightSwipe, disabled]);

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
      const swipeWithoutConfirm = (swipeDirection === "right" ? 1 : -1) * translate >= swipeWithoutConfirmThreshold;
      
      
      console.log("onMouseUp swipeWithoutConfirm", swipeWithoutConfirm)

      if (swipeWithoutConfirm) {
        console.log("onMouseUp setTranslate 1", swipeDirection === "left" ? -containerWidth : -containerWidth)
        
        setTranslate(() => swipeDirection === "left" ? -containerWidth : containerWidth)
      } else if (notShowSwipe) {
        console.log("onMouseUp setTranslate 2", 0)
        setTranslate(() => 0);
      } else if (showSwipeLeft && !swipeWithoutConfirm) {
        console.log("onMouseUp setTranslate 3 ", (rtl ? 1 : -1) * swipeWidth)
        setTranslate(() => (rtl ? 1 : -1) * swipeWidth);
      } else if (showSwipeRight && !swipeWithoutConfirm) {
        console.log("onMouseUp setTranslate 4", (rtl ? -1 : 1) * swipeWidth)
        setTranslate(() => (rtl ? -1 : 1) * swipeWidth);
      }
 
      setTouching(() => false);
      if (swipeWithoutConfirm) {
        console.log("onMouseUp swipeDirection 6", swipeDirection)
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

  const classNameContainer = () => {
    if (swipeDirection === "left")  {
      const name = `rstdi${leftSwiping && distructiveLeftSwipe ? " deleting" : ""} ${className}`
      console.log("classNameMain", name)
      return name
    } else {
      const name = `rstdi${rightSwiping && distructiveRightSwipe? " deleting" : ""} ${className}`
      console.log("classNameMain", name)
      return name
    }
  } 

  const classNameContent = () => {
    if (swipeDirection === "left")  {
      const name = `content${leftSwiping && distructiveLeftSwipe ? " deleting" : ""}${transitioning ? " transitioning" : ""}${!touching ? " transition" : ""}`
      // console.log("classNameMain", name)
      return name
    } else {
      const name = `content${rightSwiping && distructiveRightSwipe ? " archiving" : ""}${transitioning ? " transitioning" : ""}${!touching ? " transition" : ""}`
      // console.log("classNameMain", name)
      return name
    }
  } 

  return (
    <div id={id} className={ classNameContainer() } ref={container}>
      
      {/* Do not add left button if left swipe is disabled */}
      {!disableLeftSwipe && 
      <div className={`delete${leftSwiping ? " deleting" : ""}`}>
        <button onClick={onLeftSwipeClick}>{leftSwipeComponent ? leftSwipeComponent : leftSwipeText}</button>
      </div>
      }
      
      {/* Do not add right button if right swipe is disabled */}
      { !disableRightSwipe && 
      <div className={`archive${rightSwiping ? " archiving" : ""}`}>
        <button onClick={onRightSwipeClick}>{rightSwipeComponent ? rightSwipeComponent : rightSwipeText}</button>
      </div>
      }

      <div
        className={classNameContent()}
        onMouseDown={onStart}
        onTouchStart={onStart}>
        {children}
      </div>
       
    </div>
  );
};

export default SwipeToDelete;
