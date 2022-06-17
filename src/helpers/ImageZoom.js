import React, {useRef, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {clamp, noop} from './index';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'whitesmoke',
  },
});

export default function ImageZoom({
  uri = '',
  minScale = 1,
  maxScale = 5,
  minPanPointers = 2,
  maxPanPointers = 2,
  isPanEnabled = true,
  isPinchEnabled = true,
  onLoadEnd = noop,
  onInteractionStart = noop,
  onInteractionEnd = noop,
  onPinchStart = noop,
  onPinchEnd = noop,
  onPanStart = noop,
  onPanEnd = noop,
  style = {},
  containerStyle = {},
  imageContainerStyle = {},
  activityIndicatorProps = {},
  renderLoader,
  resizeMode = 'cover',
  ...props
}) {
  const panRef = useRef();
  const pinchRef = useRef();

  const isInteracting = useRef(false);
  const isPanning = useRef(false);
  const isPinching = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    canInteract: false,
    centerX: 0,
    centerY: 0,
  });

  const {canInteract, centerX, centerY} = state;

  const scale = useSharedValue(1);
  const initialFocalX = useSharedValue(0);
  const initialFocalY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onInteractionStarted = () => {
    if (!isInteracting.current) {
      isInteracting.current = true;
      onInteractionStart();
    }
  };

  const onInteractionEnded = () => {
    if (isInteracting.current && !isPinching.current && !isPanning.current) {
      isInteracting.current = false;
      onInteractionEnd();
    }
  };

  const onPinchStarted = () => {
    onInteractionStarted();
    isPinching.current = true;
    onPinchStart();
  };

  const onPinchEnded = () => {
    isPinching.current = false;
    onPinchEnd();
    onInteractionEnded();
  };

  const onPanStarted = () => {
    onInteractionStarted();
    isPanning.current = true;
    onPanStart();
  };

  const onPanEnded = () => {
    isPanning.current = false;
    onPanEnd();
    onInteractionEnded();
  };

  const panHandler = useAnimatedGestureHandler({
    onActive: event => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onFinish: () => {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    },
  });

  const pinchHandler = useAnimatedGestureHandler({
    onStart: event => {
      initialFocalX.value = event.focalX;
      initialFocalY.value = event.focalY;
    },
    onActive: event => {
      // onStart: focalX & focalY result both to 0 on Android
      if (initialFocalX.value === 0 && initialFocalY.value === 0) {
        initialFocalX.value = event.focalX;
        initialFocalY.value = event.focalY;
      }
      scale.value = clamp(event.scale, minScale, maxScale);
      focalX.value = (centerX - initialFocalX.value) * (scale.value - 1);
      focalY.value = (centerY - initialFocalY.value) * (scale.value - 1);
    },
    onFinish: () => {
      scale.value = withTiming(1);
      focalX.value = withTiming(0);
      focalY.value = withTiming(0);
      initialFocalX.value = 0;
      initialFocalY.value = 0;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {translateX: focalX.value},
      {translateY: focalY.value},
      {scale: scale.value},
    ],
  }));

  const onLayout = ({
    nativeEvent: {
      layout: {x, y, width, height},
    },
  }) => {
    setState(current => ({
      ...current,
      canInteract: true,
      centerX: x + width / 2,
      centerY: y + height / 2,
    }));
  };

  const onImageLoadEnd = () => {
    onLoadEnd();
    setIsLoading(false);
  };

  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={[panRef]}
      onGestureEvent={pinchHandler}
      onActivated={onPinchStarted}
      onCancelled={onPinchEnded}
      onEnded={onPinchEnded}
      onFailed={onPinchEnded}
      enabled={isPinchEnabled && canInteract}>
      <Animated.View style={[styles.container, containerStyle]}>
        <PanGestureHandler
          ref={panRef}
          simultaneousHandlers={[pinchRef]}
          onGestureEvent={panHandler}
          onActivated={onPanStarted}
          onCancelled={onPanEnded}
          onEnded={onPanEnded}
          onFailed={onPanEnded}
          minPointers={minPanPointers}
          maxPointers={maxPanPointers}
          enabled={isPanEnabled && canInteract}>
          <Animated.View
            onLayout={onLayout}
            style={[styles.content, imageContainerStyle]}>
            <AnimatedImage
              style={[styles.container, style, animatedStyle]}
              source={{uri}}
              resizeMode={resizeMode}
              onLoadEnd={onImageLoadEnd}
              {...props}
            />

            {isLoading &&
              (renderLoader ? (
                renderLoader()
              ) : (
                <ActivityIndicator
                  size="small"
                  style={styles.loader}
                  color="dimgrey"
                  {...activityIndicatorProps}
                />
              ))}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
}
