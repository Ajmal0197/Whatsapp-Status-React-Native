import {I18nManager, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ImageStory from './ImageStory';

// I18nManager.forceRTL(false);

const data = {
  user_id: 1,
  user_image:
    'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
  user_name: 'Ajmal',
  stories: [
    {
      story_id: 1,
      story_image:
        'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
    },
    {
      story_id: 2,
      story_image:
        'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
    },
    {
      story_id: 3,
      story_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
    },
    {
      story_id: 4,
      story_image:
        'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
    },
  ],
};

const App = () => {
  return <ImageStory stories={data?.stories} />;
};

export default App;

const styles = StyleSheet.create({});
