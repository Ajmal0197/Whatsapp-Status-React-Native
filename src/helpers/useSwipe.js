import {Dimensions, I18nManager} from 'react-native';
const windowWidth = Dimensions.get('window').width;

export function useSwipe(onSwipeLeft, onSwipeRight, rangeOffset = 4) {
  let firstTouch = 0;

  // set user touch start position
  function onTouchStart(e) {
    firstTouch = e.nativeEvent.pageX;
  }

  // when touch ends check for swipe directions
  function onTouchEnd(e) {
    // get touch position and screen size
    const positionX = e.nativeEvent.pageX;
    const range = windowWidth / rangeOffset;

    //for swiping
    if (firstTouch - positionX) {
      // check if position is growing positively and has reached specified range
      if (positionX - firstTouch > range) {
        onSwipeRight && onSwipeRight();
      }
      // check if position is growing negatively and has reached specified range
      else if (firstTouch - positionX > range) {
        onSwipeLeft && onSwipeLeft();
      }
    } else {
      //for tap

      if (!I18nManager.isRTL) {
        if (e.nativeEvent.pageX < windowWidth / 2) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      } else {
        if (e.nativeEvent.pageX < windowWidth / 2) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
      }
    }
  }

  return {onTouchStart, onTouchEnd};
}
