/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from 'react-native';
import {usePrevious} from './helpers/StateHelpers';
import {isNullOrWhitespace} from './helpers/ValidationHelpers';
import ImageZoom from './helpers/ImageZoom';
import {useSwipe} from './helpers/useSwipe';
import {hpx, wpx} from './helpers/Scale';
import TopDescription from './components/TopDescription';

const {width, height} = Dimensions.get('window');

export const StoryListItem = props => {
  const {stories} = props;

  const [load, setLoad] = useState(true);
  const [content, setContent] = useState(
    stories.map(x => {
      return {
        image: x.story_image,
        finish: 0,
      };
    }),
  );
  const [current, setCurrent] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 0

  const prevCurrent = usePrevious(current);

  useEffect(() => {
    if (!isNullOrWhitespace(prevCurrent)) {
      if (
        current > prevCurrent &&
        content[current - 1].image == content[current].image
      ) {
        start();
      } else if (
        current < prevCurrent &&
        content[current + 1].image == content[current].image
      ) {
        start();
      }
    }
  }, [current]);

  function start() {
    setLoad(false);
    progress.setValue(0);
    startAnimation();
  }

  function startAnimation() {
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        next();
      }
    });
  }

  function next() {
    // check if the next content is not empty
    setLoad(true);
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
    }
  }

  function previous() {
    // checking if the previous content is not empty
    setLoad(true);
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
    }
  }

  const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6);

  function onSwipeLeft() {
    next();
  }

  function onSwipeRight() {
    previous();
  }

  const onPressClose = () => {
    if (props.onClosePress) {
      props.onClosePress();
    }
  };

  const onInteractionStart = () => {
    progress.stopAnimation(() =>
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(),
    );
  };

  const onInteractionEnd = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      startAnimation();
    });
  };

  const onTouchStartF = e => {
    onTouchStart(e);
  };
  const onTouchEndF = e => {
    onTouchEnd(e);
  };

  return (
    <View
      onTouchStart={e => onTouchStartF(e)}
      onTouchEnd={e => onTouchEndF(e)}
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      {/* TOP VIEW */}

      <Animated.View
        style={{
          ...styles.headerConatiner,
          opacity: fadeAnim, // Bind opacity to animated value
        }}>
        <SafeAreaView style={styles.animationBarContainer}>
          {content.map((index, key) => {
            return (
              <View key={key} style={styles.animationBackground}>
                <Animated.View
                  style={{
                    flex: current == key ? progress : content[key].finish,
                    height: 2,
                    backgroundColor: 'white',
                  }}
                />
              </View>
            );
          })}
        </SafeAreaView>
        <TopDescription
          currentViewIndex={`${current + 1} / ${stories.length}`}
        />
      </Animated.View>

      <TouchableWithoutFeedback
        onPressIn={() => progress.stopAnimation()}
        onPressOut={() => {
          startAnimation();
        }}>
        <ImageZoom
          uri={content[current].image}
          activityIndicatorProps={{
            color: 'white',
            style: styles.loader,
          }}
          onInteractionStart={onInteractionStart}
          onInteractionEnd={onInteractionEnd}
          minScale={0.5}
          onLoadEnd={() => start()}
          resizeMode={true ? 'cover' : 'center'}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default StoryListItem;

const styles = StyleSheet.create({
  headerConatiner: {
    height: hpx(143, 763),
    position: 'absolute',
    zIndex: 1,
    width,
    paddingHorizontal: wpx(16),
  },
  spinnerContainer: {
    zIndex: -100,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'black',
    alignSelf: 'center',
    width: width,
    height: height,
  },
  animationBarContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    marginTop: hpx(10, 763),
    marginBottom: hpx(18, 763),
  },
  animationBackground: {
    height: 2,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(117, 117, 117, 0.5)',
    marginHorizontal: 2,
    borderRadius: 10,
  },
  pressContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  rowCenter: {flexDirection: 'row', alignItems: 'center'},
});
