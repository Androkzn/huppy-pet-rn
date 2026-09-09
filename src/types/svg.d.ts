/**
 * SVG assets are compiled to React components by react-native-svg-transformer,
 * mirroring the web app's `import { ReactComponent as Icon } from './x.svg'`.
 */
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
