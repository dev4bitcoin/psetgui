import {Platform} from 'react-native';
import colors from './Colors';

export default {
  colors,
  text: {
    fontSize: 18,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
    color: colors.dark,
  },
};
